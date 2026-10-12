# Sahas Foundation: React version

An interactive React rebuild of the Sahas Foundation website. Same palette, fonts and content as the plain-HTML version, with motion and a few interactive pieces added.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the built site
```

Built with Vite, React 19 and Framer Motion. There is no router or backend. The build uses relative paths (`base: './'`), so `dist/` can be hosted in any folder, for example GitHub Pages or a Wix "Embed a site" URL.

## What it does

- Animated hero (word-by-word headline, rotating sun rays, floating captions, parallax photo, marquee)
- Scroll progress bar and active-section highlight in the header
- Count-up stats and scroll-reveal sections
- Our Story as a scroll-driven timeline, with the full narrative behind a toggle
- Projects with Health / Education filters and cards that expand in place
- "What your gift does" amount picker that fills the donation form
- Donation form with the PAN rule: required above ₹2000, format `ABCDE1234F`
- Demo checkout (`src/components/Checkout.jsx`): a valid "Submit Application" opens an in-place checkout with UPI / Card / Net banking tabs, a simulated processing step, and a success or failure result with a demo transaction ID. Payment fields are pre-filled and read-only, so nobody can type real card details into it
- Blog post, newsletter signup, copy-to-clipboard for bank and contact details

- Thank-you email with receipt: after a successful demo payment, `src/email.js` builds the message and `EmailPreview.jsx` shows it on screen. Nothing is sent

## Email bot (`server/`)

A small Node service that sends the thank-you email with the receipt and auto-replies with the bill. The website works without it. Run it next to the site:

```bash
cp .env.example .env     # then edit
npm run server           # http://localhost:8787
```

Then tell the site where it is by creating `.env.local` with `VITE_BOT_URL=http://localhost:8787` and restarting `npm run dev`. The live GitHub Pages build has no bot URL, so it only shows the on-screen preview.

What it does:

- `POST /api/donations`: stores the donation (name, email, amount, masked PAN) and emails the thank-you with the receipt. The site calls this after a successful demo payment. A repeated transaction ID is ignored, so it can't be used to re-send.
- `POST /api/bill`: emails the bill for a transaction, only if the email matches the one on file. The chat bot's "Email me the bill" button uses this.
- `POST /api/inbound`: the reply bot. Point your email provider's inbound webhook here (Resend, Postmark, SendGrid, Mailgun, or a forwarding script) with JSON `{ from, subject, text }`. If someone replies with "bill", "receipt" or "invoice", it emails them their latest bill. Anything else gets a short help reply. Senders with no donation on file are told so.

Safety defaults:

- **Preview mode:** with no `SMTP_HOST`, nothing is delivered. Every email is written to `server/outbox/` as an `.eml` file you can open in a mail client.
- **Demo only:** payments are fake, so every email is marked `[DEMO]`, and even with SMTP set, real delivery goes only to the addresses in `DEMO_ALLOWED_RECIPIENTS`. Everyone else still gets the preview file.
- **Webhook secret:** inbound requests need the `x-webhook-secret` header to match `INBOUND_SECRET`. Without SMTP configured they are accepted for local testing.
- **Loop and abuse guards:** auto-submitted mail, no-reply senders and the bot's own address are ignored; 30 requests per 10 minutes per IP; 5 emails per recipient per day; request bodies capped; CORS limited to `ALLOWED_ORIGINS`.
- **Stored data:** only name, email, amount, masked PAN, payment method and transaction, in `server/data/donations.json` (not committed).

Not included: reading a mailbox over IMAP (use an inbound webhook instead), and verification of real payments. The server trusts the browser's "payment succeeded" call, which is fine for a demo and not acceptable for real money. For real donations, create the donation record from your payment gateway's webhook instead, and remove the demo allow-list.

Tested locally: all endpoints and guards in preview mode, and real SMTP delivery plus the allow-list and secret against a local test mail server. Not tested against a real mail provider or a real inbound webhook.

## Where things live

- `src/data.js`: all copy, project text, timeline, team, bank details. Edit content here.
- `src/components/`: one file per section
- `src/styles.css`: design tokens and styles
- `public/images/`: photos

## Important

The checkout is a demo. No payment gateway, database or email service is connected, nothing is sent or saved, and the page says so. The newsletter signup works the same way.

To send the thank-you email for real, do it on a server after the payment gateway confirms the payment (a webhook), not from the browser. Reuse `buildReceiptEmail()` in `src/email.js` for the content and send it with a transactional email service such as Resend, Postmark or Amazon SES. Sending from the browser would let anyone trigger receipts to any address. To take real donations, replace `Checkout.jsx` with a real gateway (for example Razorpay, which handles UPI, cards and net banking for Indian NGOs) behind your own backend, or use Wix Payments / Wix Forms.

The timeline dates come from the live site's story and registration details. "Before 2019" events have no year on the original site, so they are labelled by event, not date.
