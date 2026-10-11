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
- Blog post, newsletter signup, copy-to-clipboard for bank and contact details

## Where things live

- `src/data.js`: all copy, project text, timeline, team, bank details. Edit content here.
- `src/components/`: one file per section
- `src/styles.css`: design tokens and styles
- `public/images/`: photos

## Important

The donation form and newsletter validate input but are not connected to a payment gateway, database or email service. Nothing is sent, and the page says so. Connect them to Wix Forms / Wix Payments or your own backend before taking real donations.

The timeline dates come from the live site's story and registration details. "Before 2019" events have no year on the original site, so they are labelled by event, not date.
