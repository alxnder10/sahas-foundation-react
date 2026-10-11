import { useState } from 'react'
import { CONTACT } from '../data'
import { copyText } from './copy'
import Icon from './Icon'

function CopyRow({ href, text, label }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    if (await copyText(text)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    }
  }
  return (
    <div className="foot-copy-row">
      <a href={href}>{text}</a>
      <button type="button" onClick={onCopy} aria-label={label} className={copied ? 'copied' : ''}>
        <Icon name={copied ? 'check' : 'copy'} size={14} strokeWidth={2} />
      </button>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    setMsg(ok ? { ok: true, text: "Newsletter signup isn't connected yet, so your email wasn't saved." } : { ok: false, text: 'Enter a valid email address.' })
  }

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <h4>Sahas Foundation</h4>
            <p className="foot-blurb">Spreading Aid, Health and Smiles. Mumbai, India. Registered Society No. 2190/2019.</p>
          </div>
          <div>
            <h4>Visit</h4>
            <p>
              B-144, Kalpataru Sparkle
              <br />
              Gandhi Nagar, Bandra (E)
              <br />
              Mumbai – 400051, India
            </p>
          </div>
          <div>
            <h4>Reach us</h4>
            <CopyRow href="tel:+918850994284" text={CONTACT.phone} label="Copy phone number" />
            <CopyRow href={'mailto:' + CONTACT.email} text={CONTACT.email} label="Copy email address" />
          </div>
        </div>

        <form className="news" onSubmit={onSubmit} noValidate>
          <div>
            <h4>Be the first to know</h4>
            <p>Sign up to our newsletter to stay informed.</p>
          </div>
          <div className="news-field">
            <label className="visually-hidden" htmlFor="nlEmail">
              Email address
            </label>
            <input id="nlEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" autoComplete="email" />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
          </div>
          {msg && (
            <p className={'news-msg' + (msg.ok ? '' : ' bad')} role="status">
              {msg.text}
            </p>
          )}
        </form>

        <div className="foot-bottom">
          <span>© 2026 Sahas Foundation. All contributions are tax-exempt under Section 80G(5).</span>
        </div>
      </div>
    </footer>
  )
}
