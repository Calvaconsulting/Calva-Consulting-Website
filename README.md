# Calva Consulting — website

A fast, single-page marketing site for **Michael Ruiz**, built around his
experience and qualifications. No build step, no dependencies — just three files.

```
index.html    → structure & content
styles.css    → all styling (colors, type, layout)
script.js     → interactions (canvas, cursor, reveals, form)
```

## View it
Double-click `index.html`, or serve the folder:
```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Page structure (person-first)
Hero (name + portrait) → Expertise marquee → **About** (bio) → **Experience**
(career timeline) → **Credentials** (education / certs / recognition / speaking) →
Expertise (services) → Testimonials → Selected work → Contact.

## Customize it (everything you need is marked `[EDIT]`)
Open `index.html` and search for `[EDIT]`. Each one is a placeholder:
- **Hero** — Michael's role/positioning line, the promise sentence, the three
  stats, and the city in the name tag
- **About** — the bio paragraphs and the four fact rows (this bio is the most
  important copy on the page — make it unmistakably his)
- **Experience** — the career timeline entries (years, roles, companies, results)
- **Credentials** — education, certifications, recognition, speaking
- **Expertise** — the three service cards
- **Testimonials** — two client quotes
- **Work** — swap for real case studies / results
- **Contact** — reply time and the real email address (currently `michael@…`)
- **Marquee** — the six rotating expertise keywords near the top

### Brand colors
All colors live at the top of `styles.css` under `:root`:
```
--accent: #d8563a;   /* the vermilion — change this to reshape the whole vibe */
--pine:   #23433c;
--ink / --paper / ...
```

### Michael's photo
Replace the `.hero__photo` placeholder block in `index.html` with an `<img>` of
Michael. It sits in the hero next to his name.

### Wire up the contact form
It currently validates and shows a message but doesn't send. Point it at
[Formspree](https://formspree.io), a serverless function, or a `mailto:` — see the
comment in `script.js`.

## Notes
- Fonts (Fraunces + Inter) load from Google Fonts, so an internet connection is
  needed for the intended typography; there's a system-serif/sans fallback otherwise.
- Fully responsive, keyboard-accessible, and respects `prefers-reduced-motion`.
