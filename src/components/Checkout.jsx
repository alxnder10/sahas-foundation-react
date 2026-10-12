import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { buildReceiptEmail } from '../email'
import { maskPan, money } from '../format'
import EmailPreview from './EmailPreview'
import Icon from './Icon'

const METHODS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
  { id: 'bank', label: 'Net banking' },
]

const STEPS = ['Contacting demo payment gateway', 'Confirming transaction', 'Finishing up']

const newTxnId = () => 'DEMO-' + Math.random().toString(36).slice(2, 10).toUpperCase()

function DemoField({ id, label, value }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="demo-field" value={value} readOnly aria-readonly="true" tabIndex={-1} />
    </div>
  )
}

function MethodPanel({ method, donor }) {
  if (method === 'upi') {
    return (
      <div className="pay-panel">
        <DemoField id="demo-upi" label="UPI ID" value="demo@upi" />
        <p className="pay-hint">A real checkout would send a collect request to this UPI ID.</p>
      </div>
    )
  }
  if (method === 'card') {
    return (
      <div className="pay-panel">
        <DemoField id="demo-card" label="Card number" value="4111 1111 1111 1111" />
        <div className="field-row">
          <DemoField id="demo-exp" label="Expiry" value="12/30" />
          <DemoField id="demo-cvv" label="CVV" value="•••" />
        </div>
        <DemoField id="demo-name" label="Name on card" value={donor} />
        <p className="pay-hint">Standard test card number, pre-filled and locked.</p>
      </div>
    )
  }
  return (
    <div className="pay-panel">
      <DemoField id="demo-bank" label="Bank" value="Demo Bank of India" />
      <p className="pay-hint">A real checkout would redirect you to your bank to approve the payment.</p>
    </div>
  )
}

export default function Checkout({ donation, onEdit, onFinish }) {
  const [phase, setPhase] = useState('review')
  const [method, setMethod] = useState('upi')
  const [outcome, setOutcome] = useState('success')
  const [step, setStep] = useState(0)
  const [txn, setTxn] = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const donor = `${donation.fname} ${donation.lname}`.trim()

  const pay = () => {
    setPhase('processing')
    setStep(0)
    timers.current.forEach(clearTimeout)
    timers.current = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => {
        if (outcome === 'success') {
          setTxn({ id: newTxnId(), at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) })
          setPhase('success')
        } else {
          setPhase('failed')
        }
      }, 2700),
    ]
  }

  return (
    <div className="checkout">
      <div className="demo-banner" role="note">
        <b>Demo checkout.</b> No real payment is taken and nothing is saved or emailed. Never enter real card or bank details on this page.
      </div>

      <div className="checkout-grid">
        <aside className="summary">
          <span className="eyebrow">Your donation</span>
          <div className="summary-amount">{money(donation.amount)}</div>
          <p className="summary-to">to SAHAS Foundation</p>
          <dl className="summary-rows">
            <div>
              <dt>Donor</dt>
              <dd>{donor}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{donation.email}</dd>
            </div>
            {donation.pan && (
              <div>
                <dt>PAN</dt>
                <dd className="mono">{maskPan(donation.pan)}</dd>
              </div>
            )}
          </dl>
          <p className="summary-note">Real donations qualify for 80G tax exemption. This demo produces no valid receipt.</p>
          {phase === 'review' && (
            <button className="link-btn" onClick={onEdit}>
              Change details
            </button>
          )}
        </aside>

        <div className="pay-box">
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'review' && (
              <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <h3>Pay with</h3>
                <div className="pay-tabs" role="tablist" aria-label="Payment method">
                  {METHODS.map((m) => (
                    <button key={m.id} role="tab" aria-selected={method === m.id} className={'pay-tab' + (method === m.id ? ' on' : '')} onClick={() => setMethod(m.id)}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <MethodPanel method={method} donor={donor} />

                <fieldset className="outcome">
                  <legend>Demo outcome</legend>
                  <label className={outcome === 'success' ? 'on' : ''}>
                    <input type="radio" name="outcome" checked={outcome === 'success'} onChange={() => setOutcome('success')} />
                    Payment succeeds
                  </label>
                  <label className={outcome === 'fail' ? 'on' : ''}>
                    <input type="radio" name="outcome" checked={outcome === 'fail'} onChange={() => setOutcome('fail')} />
                    Payment fails
                  </label>
                </fieldset>

                <button className="btn btn-primary pay-btn" onClick={pay}>
                  Pay {money(donation.amount)} (demo)
                </button>
              </motion.div>
            )}

            {phase === 'processing' && (
              <motion.div key="processing" className="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite">
                <div className="spinner" aria-hidden="true" />
                <p>{STEPS[step]}…</p>
                <div className="bar" aria-hidden="true">
                  <motion.i initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.7, ease: 'linear' }} />
                </div>
              </motion.div>
            )}

            {phase === 'success' && (
              <motion.div key="success" className="result ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} role="status">
                <motion.div className="result-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}>
                  <Icon name="check" size={30} strokeWidth={2.6} />
                </motion.div>
                <h3>Demo payment successful</h3>
                <p>Thank you, {donation.fname}. In a live setup this is where the donation would be recorded and a receipt emailed to you.</p>
                <dl className="receipt">
                  <div>
                    <dt>Transaction ID</dt>
                    <dd className="mono">{txn?.id}</dd>
                  </div>
                  <div>
                    <dt>Amount</dt>
                    <dd className="mono">{money(donation.amount)}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{txn?.at}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>Demo only, no money moved</dd>
                  </div>
                  <div>
                    <dt>Thank-you email</dt>
                    <dd>Previewed below, not sent</dd>
                  </div>
                </dl>
                <div className="result-actions">
                  <button className="btn btn-primary" onClick={onFinish}>
                    Back to the site
                  </button>
                  <a href="#donate" className="link-btn" onClick={(e) => { e.preventDefault(); onEdit() }}>
                    See real bank transfer details
                  </a>
                </div>
              </motion.div>
            )}

            {phase === 'failed' && (
              <motion.div key="failed" className="result bad" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} role="alert">
                <div className="result-icon">
                  <Icon name="close" size={30} strokeWidth={2.6} />
                </div>
                <h3>Transaction failed (demo)</h3>
                <p>{money(donation.amount)} was not charged. In a live setup the donation would not be recorded.</p>
                <div className="result-actions">
                  <button className="btn btn-primary" onClick={() => setPhase('review')}>
                    Try again
                  </button>
                  <button className="link-btn" onClick={onEdit}>
                    Change details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {phase === 'success' && txn && <EmailPreview email={buildReceiptEmail({ donation, txn, method })} />}
    </div>
  )
}
