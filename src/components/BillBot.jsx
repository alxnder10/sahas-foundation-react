import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { botEnabled, emailBill } from '../botApi'
import { buildBill } from '../email'
import { copyText } from './copy'
import Icon from './Icon'

const BILL_RE = /\b(bill|bills|receipt|recipt|reciept|invoice)\b/i
const MAIL_RE = /\b(e-?mail|mail)\b/i
const HELLO_RE = /^\s*(hi|hello|hey|namaste)\b/i
const TYPING_MS = 900

function BillCard({ bill, id }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    if (await copyText(bill.text)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  const onDownload = () => {
    const url = URL.createObjectURL(new Blob([bill.text], { type: 'text/plain' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `SAHAS-bill-${id}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bill-card">
      <div className="bill-tag">Demo bill · not valid for 80G</div>
      <dl>
        {bill.rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="bill-actions">
        <button type="button" onClick={onCopy}>
          <Icon name={copied ? 'check' : 'copy'} size={14} strokeWidth={2} />
          {copied ? 'Copied' : 'Copy bill'}
        </button>
        <button type="button" onClick={onDownload}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}

export default function BillBot({ donation, txn, method }) {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: `Hi ${donation.fname}, thank you for your donation. I can fetch your bill for you.` },
    { id: 2, from: 'bot', text: 'Tap "Get my bill" or type "bill".' },
  ])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)
  const timer = useRef(null)
  const nextId = useRef(3)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  const push = (m) => setMessages((prev) => [...prev, { id: nextId.current++, ...m }])

  const ask = (text) => {
    const clean = text.trim()
    if (!clean || typing) return
    push({ from: 'me', text: clean })
    setDraft('')
    setTyping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const wantsBill = BILL_RE.test(clean)
      const wantsEmail = MAIL_RE.test(clean)
      if (wantsBill && wantsEmail && botEnabled) {
        try {
          const r = await emailBill({ txnId: txn.id, email: donation.email })
          push({
            from: 'bot',
            text: r.state === 'sent' ? `Done. I have emailed your bill to ${donation.email}.` : 'The email server is in preview mode, so your bill was saved but not delivered.',
          })
        } catch {
          push({ from: 'bot', text: "Sorry, I couldn't reach the email server. Tap \"Get my bill\" to see it here instead." })
        }
        setTyping(false)
        return
      }
      setTyping(false)
      if (wantsBill) {
        push({ from: 'bot', text: wantsEmail ? 'Email delivery is not connected yet, so here it is in the chat:' : 'Here is your bill:' })
        push({ from: 'bot', bill: buildBill({ donation, txn, method }) })
        push({ from: 'bot', text: 'That is all I can do for now. I can only fetch your bill.' })
      } else if (HELLO_RE.test(clean)) {
        push({ from: 'bot', text: 'Hello! Tap "Get my bill" and I will fetch it.' })
      } else {
        push({ from: 'bot', text: 'Sorry, I can only fetch your bill for now. Tap "Get my bill" or type "bill".' })
      }
    }, TYPING_MS)
  }

  return (
    <motion.div
      className="bot"
      role="region"
      aria-label="Bill assistant"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bot-head">
        <span className="bot-avatar" aria-hidden="true">
          S
        </span>
        <div>
          <b>SAHAS Assistant</b>
          <span>Demo bot · replies are scripted</span>
        </div>
      </div>

      <div className="bot-list" ref={listRef} aria-live="polite">
        {messages.map((m) => (
          <motion.div key={m.id} className={'bubble ' + m.from} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {m.bill ? <BillCard bill={m.bill} id={txn.id} /> : m.text}
          </motion.div>
        ))}
        {typing && (
          <div className="bubble bot typing" aria-label="Assistant is typing">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>

      <div className="bot-quick">
        <button type="button" className="amount-chip" disabled={typing} onClick={() => ask('Get my bill')}>
          Get my bill
        </button>
        {botEnabled && (
          <button type="button" className="amount-chip" disabled={typing} onClick={() => ask('Email me my bill')}>
            Email me the bill
          </button>
        )}
      </div>

      <form
        className="bot-form"
        onSubmit={(e) => {
          e.preventDefault()
          ask(draft)
        }}
      >
        <label className="visually-hidden" htmlFor="bot-input">
          Message the assistant
        </label>
        <input id="bot-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message" autoComplete="off" />
        <button className="btn btn-primary" type="submit" disabled={typing || !draft.trim()}>
          Send
        </button>
      </form>
    </motion.div>
  )
}
