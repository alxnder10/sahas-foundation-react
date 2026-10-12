import fs from 'node:fs'
import path from 'node:path'

// Minimal JSON-file store. Keeps only what is needed to email a bill:
// name, email, amount, masked PAN, payment method and the transaction.
export function createStore(file) {
  const read = () => {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      return []
    }
  }
  const write = (rows) => {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, JSON.stringify(rows, null, 2))
  }
  const same = (a, b) => a.toLowerCase() === b.toLowerCase()

  return {
    add(record) {
      const rows = read()
      if (rows.some((r) => r.txn.id === record.txn.id)) return false
      rows.push({ ...record, createdAt: new Date().toISOString() })
      write(rows)
      return true
    },
    findByTxn(id) {
      return read().find((r) => r.txn.id === id) || null
    },
    findLatestByEmail(email) {
      const rows = read().filter((r) => same(r.donation.email, email))
      return rows.length ? rows[rows.length - 1] : null
    },
  }
}
