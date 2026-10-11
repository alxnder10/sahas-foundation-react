import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BANK, CONTACT, IMPACT, PAN_LIMIT } from '../data'
import { copyText } from './copy'
import Icon from './Icon'
import Reveal from './Reveal'

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(\+91-?)?\d{10}$/

const EMPTY = { fname: '', lname: '', email: '', phone: '', amount: '', dob: '', address: '', pan: '' }
const ORDER = ['fname', 'lname', 'email', 'phone', 'amount', 'dob', 'address', 'pan']

function validate(v) {
  const e = {}
  const amount = Number(v.amount)
  const pan = v.pan.trim().toUpperCase()
  if (!v.fname.trim()) e.fname = 'Enter your first name.'
  if (!v.lname.trim()) e.lname = 'Enter your last name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  if (!PHONE_RE.test(v.phone.replace(/\s+/g, ''))) e.phone = 'Enter a 10-digit phone number.'
  if (!(amount > 0)) e.amount = 'Enter an amount in rupees.'
  if (!v.dob) e.dob = 'Enter your date of birth.'
  if (!v.address.trim()) e.address = 'Enter your address.'
  if (amount > PAN_LIMIT && !pan) e.pan = 'PAN is required for donations above ₹2000.'
  else if (pan && !PAN_RE.test(pan)) e.pan = 'PAN should look like ABCDE1234F.'
  return e
}

function Field({ id, label, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span className="err" id={id + '-err'} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

function Impact({ amount, setAmount }) {
  const current = IMPACT.find((i) => String(i.amount) === String(amount))
  return (
    <div className="impact">
      <h3>What your gift does</h3>
      <div className="impact-chips" role="group" aria-label="Choose an amount">
        {IMPACT.map((i) => (
          <button
            key={i.amount}
            className={'amount-chip' + (current === i ? ' on' : '')}
            aria-pressed={current === i}
            onClick={() => setAmount(String(i.amount))}
          >
            ₹{i.amount.toLocaleString('en-IN')}
          </button>
        ))}
      </div>
      <div className="impact-out" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={current ? current.amount : 'none'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {current ? (
              <>
                <b>{current.text}</b> <span>{current.project}</span>
              </>
            ) : (
              'Pick an amount to see what it supports, or enter your own in the form.'
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Passbook() {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    const ok = await copyText(`${BANK.name}\n${BANK.bank}\nA/C: ${BANK.account}\nIFSC: ${BANK.ifsc}`)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1700)
    }
  }
  return (
    <div className="passbook">
      <h3>
        Bank transfer <span className="mono">INR, India only</span>
      </h3>
      <div className="row">
        <span className="k">Account name</span>
        <span className="v">SAHAS SPREADING AID<br />HEALTH AND SMILE FOUNDATION</span>
      </div>
      <div className="row">
        <span className="k">Bank</span>
        <span className="v">{BANK.bank}</span>
      </div>
      <div className="row">
        <span className="k">Account no.</span>
        <span className="v">{BANK.account}</span>
      </div>
      <div className="row">
        <span className="k">IFSC</span>
        <span className="v">{BANK.ifsc}</span>
      </div>
      <div className="row">
        <span className="k">80G certificate</span>
        <span className="v">{BANK.cert}</span>
      </div>
      <button className="copy-btn" onClick={onCopy}>
        <Icon name={copied ? 'check' : 'copy'} size={15} strokeWidth={2} />
        {copied ? 'Copied to clipboard' : 'Copy account details'}
      </button>
      <p className="passbook-note">80G(5) provisional certificate no. {BANK.cert}, dated 13/03/2023, valid till 31/03/2026. Registered under the Societies Registration Act, 1860, Reg. No. 2190/2019.</p>
    </div>
  )
}

function DonateForm({ amount, setAmount }) {
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const values = { ...v, amount }
  const needsPan = Number(amount) > PAN_LIMIT

  const set = (key) => (e) => {
    setDone(false)
    if (key === 'amount') setAmount(e.target.value)
    else setV((prev) => ({ ...prev, [key]: key === 'pan' ? e.target.value.toUpperCase() : e.target.value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = ORDER.find((k) => found[k])
    setDone(!first)
    if (first) document.getElementById(first)?.focus()
  }

  const attrs = (id) => ({ id, value: values[id], onChange: set(id), 'aria-invalid': errors[id] ? 'true' : 'false', 'aria-describedby': errors[id] ? id + '-err' : undefined })

  return (
    <form className="contact" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        <Field id="fname" label="First name *" error={errors.fname}>
          <input {...attrs('fname')} autoComplete="given-name" />
        </Field>
        <Field id="lname" label="Last name *" error={errors.lname}>
          <input {...attrs('lname')} autoComplete="family-name" />
        </Field>
      </div>
      <div className="field-row">
        <Field id="email" label="Email *" error={errors.email}>
          <input {...attrs('email')} type="email" autoComplete="email" />
        </Field>
        <Field id="phone" label="Phone *" error={errors.phone}>
          <input {...attrs('phone')} type="tel" autoComplete="tel" />
        </Field>
      </div>
      <div className="field-row">
        <Field id="amount" label="Amount (₹) *" error={errors.amount}>
          <input {...attrs('amount')} type="number" min="1" step="1" inputMode="numeric" />
        </Field>
        <Field id="dob" label="Date of birth *" error={errors.dob}>
          <input {...attrs('dob')} type="date" autoComplete="bday" />
        </Field>
      </div>
      <Field id="address" label="Address *" error={errors.address}>
        <input {...attrs('address')} autoComplete="street-address" />
      </Field>
      <Field id="pan" label={needsPan ? 'PAN number *' : 'PAN number'} error={errors.pan}>
        <input {...attrs('pan')} maxLength={10} autoCapitalize="characters" spellCheck="false" placeholder="ABCDE1234F" />
      </Field>

      <AnimatePresence initial={false}>
        {needsPan && (
          <motion.div
            className="warn"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            Amount entered is above ₹2000, so a PAN number is mandatory for compliance.
          </motion.div>
        )}
      </AnimatePresence>

      <button className="btn btn-primary" type="submit">
        Submit Application
      </button>
      <p className="form-note">This form checks your details but is not connected to a payment gateway or inbox yet. Nothing is sent or charged.</p>

      <AnimatePresence>
        {done && (
          <motion.div className="confirm" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Icon name="check" size={16} strokeWidth={2.4} />
            <span>Your details look valid, but online payment isn't set up yet. To donate now, use the bank transfer details on this page.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

const MINI = [
  { tag: 'Membership', title: 'Take Part', text: 'Any Resident or Non Resident Indian who accepts the constitution of SAHAS can enroll as a member, as a life member or yearly member.', cta: 'Know More', href: '#about' },
  { tag: 'Volunteer', title: 'Volunteer With Us', text: "Lend your time and skills to SAHAS's ongoing projects, from food-packet distribution to tutoring and outreach.", cta: 'Sign up to volunteer', href: 'mailto:' + CONTACT.email },
  { tag: 'Partnership', title: 'Partner With Us', text: "Schools, clinics, corporates and other NGOs: if your work overlaps with ours, let's find where we can help each other.", cta: 'Discuss a partnership', href: 'mailto:' + CONTACT.email },
]

export default function Contact() {
  const [amount, setAmount] = useState('')

  return (
    <section id="donate">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Contact Us</span>
          <h2>Take a part and help us grow</h2>
          <p>Online Transfer. For deposits being made in ₹ INR. All Indian deposits qualify for 80G tax exemption.</p>
        </Reveal>

        <div className="donate-grid">
          <Reveal className="donate-left">
            <Impact amount={amount} setAmount={setAmount} />
            <Passbook />
          </Reveal>
          <Reveal delay={0.1}>
            <DonateForm amount={amount} setAmount={setAmount} />
          </Reveal>
        </div>

        <div className="mini-grid">
          {MINI.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.08} className="mini-card">
              <span className="tag mono">{m.tag}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <a href={m.href} className="btn btn-line">
                {m.cta}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
