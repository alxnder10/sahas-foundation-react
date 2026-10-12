import { buildBill, buildReceiptEmail } from '../src/email.js'
import { CONTACT } from '../src/data.js'

const DEMO_LINE = 'DEMO ONLY. This is not a valid receipt and no money was charged.'

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

const prefix = (demo) => (demo ? '[DEMO] ' : '')

function shell(bodyHtml, demo) {
  const banner = demo
    ? `<div style="background:#fbeed2;border:1px solid #e6c37a;color:#6b4710;padding:10px 14px;font:600 12px monospace;letter-spacing:.05em;text-transform:uppercase">${esc(DEMO_LINE)}</div>`
    : ''
  return `<!doctype html><html><body style="margin:0;background:#f5f1e6;padding:24px;font-family:Georgia,serif;color:#1c2a44">
<div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e1d8c3">${banner}<div style="padding:28px 26px;font:15.5px/1.7 Arial,sans-serif;color:#4c5771">${bodyHtml}</div></div></body></html>`
}

function receiptTable(rows) {
  const tr = rows
    .map(([k, v]) => `<tr><td style="padding:6px 0;color:#4c5771">${esc(k)}</td><td style="padding:6px 0;text-align:right;font-family:monospace;color:#1c2a44">${esc(v)}</td></tr>`)
    .join('')
  return `<table role="presentation" width="100%" style="border-left:3px solid #df9328;padding-left:14px;margin:18px 0;border-collapse:collapse">${tr}</table>`
}

const paragraphs = (list) => list.map((p) => `<p style="margin:0 0 14px">${esc(p)}</p>`).join('')
const lines = (list) => list.map((l) => esc(l)).join('<br>')

export function thankYouMessage(record, { demo }) {
  const email = buildReceiptEmail(record)
  const text = [
    ...(demo ? [DEMO_LINE, ''] : []),
    email.greeting,
    '',
    ...email.paragraphs.flatMap((p) => [p, '']),
    ...email.receipt.map(([k, v]) => `${k}: ${v}`),
    '',
    ...email.signoff,
    '',
    ...email.footer,
  ].join('\n')

  const html = shell(
    `<p style="margin:0 0 14px;font:22px Georgia,serif;color:#1c2a44">${esc(email.greeting)}</p>${paragraphs(email.paragraphs)}${receiptTable(email.receipt)}
<p style="margin:18px 0 0;color:#1c2a44">${lines(email.signoff)}</p>
<p style="margin:18px 0 0;padding-top:14px;border-top:1px solid #e1d8c3;font-size:12.5px">${lines(email.footer)}</p>`,
    demo,
  )
  return { subject: prefix(demo) + email.subject, text, html }
}

export function billMessage(record, { demo }) {
  const bill = buildBill(record)
  const name = record.donation.fname
  const text = [
    `Dear ${name},`,
    '',
    'As requested, here is your bill:',
    '',
    bill.text,
    '',
    'This message was sent automatically. Reply with the word "bill" any time to get it again.',
  ].join('\n')

  const html = shell(
    `<p style="margin:0 0 14px;font:22px Georgia,serif;color:#1c2a44">Dear ${esc(name)},</p>
<p style="margin:0 0 14px">As requested, here is your bill:</p>${receiptTable(bill.rows)}
<p style="margin:18px 0 0;font-size:13px">This message was sent automatically. Reply with the word "bill" any time to get it again.</p>`,
    demo,
  )
  return { subject: `${prefix(demo)}Your SAHAS donation bill (${record.txn.id})`, text, html }
}

export function helpMessage({ found }, { demo }) {
  const body = found
    ? 'I am the automated assistant of SAHAS Foundation. For now I can only send you the bill for your donation. Reply with the word "bill" and I will send it.'
    : `I am the automated assistant of SAHAS Foundation. I could not find a donation made with this email address, so I have no bill to send. If you donated using a different address, write to us at ${CONTACT.email}.`
  const text = ['Hello,', '', body, '', 'SAHAS Foundation'].join('\n')
  const html = shell(`<p style="margin:0 0 14px">Hello,</p><p style="margin:0 0 14px">${esc(body)}</p><p style="margin:0;color:#1c2a44">SAHAS Foundation</p>`, demo)
  return { subject: `${prefix(demo)}Re: your message to SAHAS Foundation`, text, html }
}
