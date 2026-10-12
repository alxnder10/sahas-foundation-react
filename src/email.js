import { BANK, CONTACT } from './data'
import { maskPan, money } from './format'

const METHOD_LABEL = { upi: 'UPI', card: 'Card', bank: 'Net banking' }

const IMPACT_LINE = {
  500: "goes toward bicycles for children in Maharashtra's villages (Cycle Project)",
  1000: 'provides nutrition packets for one TB patient for a month (Nikshay Poshan)',
  8000: 'puts a child through school for a year (3E)',
}

export function buildReceiptEmail({ donation, txn, method }) {
  const amount = Number(donation.amount)
  const donor = `${donation.fname} ${donation.lname}`.trim()
  const impact = IMPACT_LINE[amount]

  return {
    from: `SAHAS Foundation <${CONTACT.email}>`,
    to: `${donor} <${donation.email}>`,
    subject: `Thank you for your donation of ${money(amount)}`,
    greeting: `Dear ${donation.fname},`,
    paragraphs: [
      `Thank you for your donation of ${money(amount)} to SAHAS Foundation.`,
      impact
        ? `Your gift ${impact}.`
        : 'Your gift supports our work in education, health and care for underprivileged children, TB patients and lonely elders.',
      `Donations to SAHAS are exempt under section 80G(5) of the IT Act 1961 (provisional certificate no. ${BANK.cert}, valid till 31-03-2026). Your receipt is below.`,
    ],
    receipt: [
      ['Receipt no.', txn.id],
      ['Date', txn.at],
      ['Donor', donor],
      ...(donation.pan ? [['PAN', maskPan(donation.pan)]] : []),
      ['Amount', money(amount)],
      ['Payment method', METHOD_LABEL[method]],
      ['Status', 'Paid'],
    ],
    signoff: ['With gratitude,', 'The SAHASIs', 'SAHAS Foundation'],
    footer: [
      'B-144, Kalpataru Sparkle, Gandhi Nagar, Bandra (E), Mumbai - 400051',
      `${CONTACT.phone} · ${CONTACT.email}`,
      'Registered Society No. 2190/2019',
    ],
  }
}
