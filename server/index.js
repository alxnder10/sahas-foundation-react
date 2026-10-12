import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMailer } from './mailer.js'
import { createStore } from './store.js'
import { billMessage, helpMessage, thankYouMessage } from './templates.js'

try {
  process.loadEnvFile(new URL('../.env', import.meta.url))
} catch {
  // no .env file: defaults apply
}

const env = process.env
const here = path.dirname(fileURLToPath(import.meta.url))
const list = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean)

const config = {
  port: Number(env.PORT) || 8787,
  from: env.MAIL_FROM || 'SAHAS Foundation <no-reply@localhost>',
  smtpHost: env.SMTP_HOST || '',
  smtpPort: Number(env.SMTP_PORT) || 587,
  smtpUser: env.SMTP_USER || '',
  smtpPass: env.SMTP_PASS || '',
  outbox: path.join(here, 'outbox'),
  inboundSecret: env.INBOUND_SECRET || '',
  origins: list(env.ALLOWED_ORIGINS || 'http://localhost:5601,http://localhost:5173,https://alxnder10.github.io'),
  // Payments are demo-only, so emails may only be delivered to these addresses.
  // Everyone else gets the message written to the outbox folder instead.
  demoRecipients: list(env.DEMO_ALLOWED_RECIPIENTS).map((a) => a.toLowerCase()),
}
const FROM_ADDRESS = (config.from.match(/<([^>]+)>/)?.[1] || config.from).toLowerCase()
const DEMO = { demo: true }

const mailer = createMailer(config)
const store = createStore(path.join(here, 'data', 'donations.json'))

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TXN_RE = /^DEMO-[A-Z0-9]{8}$/
const PAN_MASK_RE = /^[A-Z0-9]{2}\*{6}[A-Z0-9]{2}$/
const BILL_RE = /\b(bill|bills|receipt|recipt|reciept|invoice)\b/i

const hits = new Map()
function tooMany(key, max, windowMs) {
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > max
}

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function readJson(req, limit = 20_000) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let tooBig = false
    req.on('data', (c) => {
      size += c.length
      if (size > limit) tooBig = true
      else chunks.push(c)
    })
    req.on('end', () => {
      if (tooBig) return reject(new HttpError(413, 'payload too large'))
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}'))
      } catch {
        reject(new HttpError(400, 'invalid json'))
      }
    })
    req.on('error', reject)
  })
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function parseDonation(body) {
  const d = body?.donation || {}
  const t = body?.txn || {}
  const method = body?.method
  const donation = {
    fname: str(d.fname, 80),
    lname: str(d.lname, 80),
    email: str(d.email, 120).toLowerCase(),
    amount: Number(d.amount),
    pan: PAN_MASK_RE.test(str(d.pan, 10)) ? str(d.pan, 10) : '',
  }
  const txn = { id: str(t.id, 20), at: str(t.at, 40) }
  if (!donation.fname || !donation.lname) throw new HttpError(400, 'name required')
  if (!EMAIL_RE.test(donation.email)) throw new HttpError(400, 'valid email required')
  if (!(donation.amount >= 1 && donation.amount <= 10_000_000)) throw new HttpError(400, 'invalid amount')
  if (!TXN_RE.test(txn.id) || !txn.at) throw new HttpError(400, 'invalid transaction')
  if (!['upi', 'card', 'bank'].includes(method)) throw new HttpError(400, 'invalid method')
  return { donation, txn, method }
}

async function deliver(to, message) {
  if (tooMany('to:' + to.toLowerCase(), 5, 24 * 60 * 60 * 1000)) throw new HttpError(429, 'too many emails to this address')
  const allowed = config.demoRecipients.includes(to.toLowerCase())
  const result = await mailer.send({ ...message, to }, { deliver: allowed })
  return result.delivered ? 'sent' : 'preview'
}

function senderAddress(from) {
  const raw = str(from, 200)
  const addr = (raw.match(/<([^>]+)>/)?.[1] || raw).toLowerCase()
  return EMAIL_RE.test(addr) ? addr : ''
}

function wantsBill(subject, text) {
  const own = str(text, 4000)
    .split('\n')
    .filter((l) => !l.trim().startsWith('>'))
    .join('\n')
    .slice(0, 2000)
  return BILL_RE.test(`${str(subject, 200)}\n${own}`)
}

const routes = {
  'GET /health': async () => ({ ok: true, mail: mailer.real ? 'smtp' : 'preview' }),

  'POST /api/donations': async (req) => {
    const record = parseDonation(await readJson(req))
    if (!store.add(record)) return { ok: true, duplicate: true, state: 'preview' }
    const state = await deliver(record.donation.email, thankYouMessage(record, DEMO))
    return { ok: true, state }
  },

  'POST /api/bill': async (req) => {
    const body = await readJson(req)
    const email = str(body.email, 120).toLowerCase()
    const record = store.findByTxn(str(body.txnId, 20))
    if (!record || record.donation.email !== email) throw new HttpError(404, 'not found')
    return { ok: true, state: await deliver(email, billMessage(record, DEMO)) }
  },

  'POST /api/inbound': async (req) => {
    if (config.inboundSecret) {
      if (req.headers['x-webhook-secret'] !== config.inboundSecret) throw new HttpError(401, 'unauthorized')
    } else if (mailer.real) {
      throw new HttpError(401, 'INBOUND_SECRET is required when SMTP is configured')
    }
    const body = await readJson(req, 100_000)
    const addr = senderAddress(body.from)
    const autoHeader = String(body.headers?.['auto-submitted'] || '').toLowerCase()
    const robot = /^(no-?reply|mailer-daemon|postmaster)@/.test(addr)
    if (!addr || addr === FROM_ADDRESS || robot || (autoHeader && autoHeader !== 'no')) {
      return { ok: true, action: 'ignored' }
    }
    const record = store.findLatestByEmail(addr)
    if (wantsBill(body.subject, body.text) && record) {
      return { ok: true, action: 'bill', state: await deliver(addr, billMessage(record, DEMO)) }
    }
    return { ok: true, action: record ? 'help' : 'no-donation', state: await deliver(addr, helpMessage({ found: Boolean(record) }, DEMO)) }
  },
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin
  const headers = { 'Content-Type': 'application/json', Vary: 'Origin' }
  if (origin && config.origins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
  }
  const reply = (status, payload) => {
    res.writeHead(status, headers)
    res.end(JSON.stringify(payload))
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    return res.end()
  }

  const route = (req.url || '').split('?')[0]
  const handler = routes[`${req.method} ${route}`]
  if (!handler) return reply(404, { ok: false, error: 'not found' })

  const ip = req.socket.remoteAddress || 'unknown'
  if (tooMany('ip:' + ip, 30, 10 * 60 * 1000)) return reply(429, { ok: false, error: 'slow down' })

  try {
    reply(200, await handler(req))
  } catch (err) {
    if (err instanceof HttpError) return reply(err.status, { ok: false, error: err.message })
    console.error(err)
    reply(500, { ok: false, error: 'server error' })
  }
})

server.listen(config.port, () => {
  console.log(`SAHAS email bot on http://localhost:${config.port}`)
  console.log(mailer.real ? `Mail: SMTP ${config.smtpHost} (delivering only to ${config.demoRecipients.length} allow-listed address(es))` : 'Mail: preview mode, messages are written to server/outbox')
})
