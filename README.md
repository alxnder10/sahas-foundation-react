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

## Where things live

- `src/data.js`: all copy, project text, timeline, team, bank details. Edit content here.
- `src/components/`: one file per section
- `src/styles.css`: design tokens and styles
- `public/images/`: photos

## Important

The checkout is a demo. No payment gateway, database or email service is connected, nothing is sent or saved, and the page says so. The newsletter signup works the same way.

To send the thank-you email for real, do it on a server after the payment gateway confirms the payment (a webhook), not from the browser. Reuse `buildReceiptEmail()` in `src/email.js` for the content and send it with a transactional email service such as Resend, Postmark or Amazon SES. Sending from the browser would let anyone trigger receipts to any address. To take real donations, replace `Checkout.jsx` with a real gateway (for example Razorpay, which handles UPI, cards and net banking for Indian NGOs) behind your own backend, or use Wix Payments / Wix Forms.

The timeline dates come from the live site's story and registration details. "Before 2019" events have no year on the original site, so they are labelled by event, not date.
