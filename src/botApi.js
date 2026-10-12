const BASE = (import.meta.env.VITE_BOT_URL || '').replace(/\/$/, '')

export const botEnabled = BASE !== ''

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'request failed')
  return data
}

export const sendThankYou = (payload) => post('/api/donations', payload)

export const emailBill = (payload) => post('/api/bill', payload)
