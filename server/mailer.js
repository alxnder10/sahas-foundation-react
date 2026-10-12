import fs from 'node:fs'
import path from 'node:path'
import nodemailer from 'nodemailer'

const safeName = (s) => s.replace(/[^a-z0-9._-]/gi, '_').slice(0, 60)

export function createMailer(config) {
  const real = Boolean(config.smtpHost)
  const smtp = real
    ? nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: config.smtpUser ? { user: config.smtpUser, pass: config.smtpPass } : undefined,
      })
    : null
  const preview = nodemailer.createTransport({ streamTransport: true, newline: 'unix', buffer: true })

  // Sends only when SMTP is configured and the caller allows delivery.
  // Otherwise the full message is written to the outbox as an .eml file.
  async function send(message, { deliver }) {
    const mail = {
      from: config.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      headers: { 'Auto-Submitted': 'auto-generated', 'X-Auto-Response-Suppress': 'All' },
    }
    if (real && deliver) {
      const info = await smtp.sendMail(mail)
      return { delivered: true, messageId: info.messageId }
    }
    const info = await preview.sendMail(mail)
    fs.mkdirSync(config.outbox, { recursive: true })
    const file = path.join(config.outbox, `${Date.now()}-${safeName(message.to)}.eml`)
    fs.writeFileSync(file, info.message)
    return { delivered: false, file }
  }

  return { send, real }
}
