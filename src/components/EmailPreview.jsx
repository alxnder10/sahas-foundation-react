import { motion } from 'framer-motion'

export default function EmailPreview({ email }) {
  return (
    <motion.section
      className="email-wrap"
      aria-label="Thank-you email preview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="email-head">
        <span className="eyebrow">Auto-reply · demo</span>
        <h3>The thank-you email</h3>
        <p>This is the message a donor would receive after a successful payment. In this demo it is only shown here. Nothing was sent.</p>
      </div>

      <article className="email">
        <div className="email-ribbon">DEMO. Not a valid receipt.</div>
        <dl className="email-meta">
          <div>
            <dt>From</dt>
            <dd>{email.from}</dd>
          </div>
          <div>
            <dt>To</dt>
            <dd>{email.to}</dd>
          </div>
          <div>
            <dt>Subject</dt>
            <dd>
              <b>{email.subject}</b>
            </dd>
          </div>
        </dl>

        <div className="email-body">
          <p className="email-greeting">{email.greeting}</p>
          {email.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <dl className="email-receipt">
            {email.receipt.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <p className="email-sign">
            {email.signoff.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
          <p className="email-foot">
            {email.footer.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
        </div>
      </article>
    </motion.section>
  )
}
