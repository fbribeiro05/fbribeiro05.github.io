# Francisco Borges Ribeiro — Crowdfunding Site Brief
**For build in Claude Code — static site, GitHub Pages deployment**

---

## 1. Project Overview

A single-page, four-language (EN default / FR / DE / PT-PT) personal crowdfunding site to help fund Francisco's BA (Hons) Musical Theatre studies at the **Guildford School of Acting (GSA)**, University of Surrey, UK. Classy, black/dark, editorial tone — not a typical "GoFundMe" look.

- **Deployment:** GitHub Pages (static, no build step, no backend)
- **Default language:** English
- **Tone:** Personal, sincere, understated — never grandiloquent. Let the facts (5 offers out of 8 auditions, 24 places out of ~5,000 applicants at GSA, teacher testimonials) do the persuading rather than salesy crowdfunding language.

---

## 2. Fundraising Numbers & Logic

**Campaign goal: £83,100 GBP**

| Item | Amount |
|---|---|
| 2nd year tuition | £27,800 |
| 3rd year tuition | £27,800 |
| Accommodation (all 3 years) | £27,500 |
| **Total campaign goal** | **£83,100** |

- Progress bar **starts at 0** and tracks *only* this campaign — not the foundation money.
- **Transparency line** (shown near the budget breakdown, not merged into the progress bar): funds already secured through foundations and awards, totaling **CHF 34,400** — Fondation Suisse d'Études (CHF 20,000, non-renewable annual bursary), Stiftung Dr. Hans und Hilde von Lorentz (CHF 13,900, half of first semester's fees), and the Prix Lily Landry from the Conservatoire de Neuchâtel (CHF 500). Names confirmed public.
- Copy should make clear: this campaign covers years 2–3 and accommodation; year 1 and the remaining gap are being covered through savings, family support, and ongoing foundation applications — stated honestly, not glossed over.

**Currency display (tied to language, not a manual toggle):**

| Language | Currency shown |
|---|---|
| EN (default) | GBP (native — this *is* the real cost) |
| FR | CHF |
| DE | CHF |
| PT | EUR |

- GBP is the base/source of truth. Convert to CHF/EUR using **fixed, hardcoded rates** stored as JS constants (not a live API — keeps the static site fast and dependency-free).
- Suggested placeholder rates (⚠️ **verify/update before launch** — these are ballpark, not live):
  - 1 GBP ≈ 1.13 CHF
  - 1 GBP ≈ 1.17 EUR
- Show a small note near the amount: *"Approximate, based on exchange rates as of [Month Year]."*

---

## 3. Design System

### Colors (dark theme, primary)
```css
--bg: #0a0a0a;
--bg-elevated: #141414;
--panel: #141414;
--panel-2: #1c1c1c;
--text: #f5f5f4;
--muted: #9a9a97;
--line: rgba(255,255,255,.12);
--line-strong: rgba(255,255,255,.28);
--accent: #ffffff;       /* inverse buttons */
--accent-ink: #0a0a0a;
```
No color accents beyond monochrome — **photos are the one place color appears**, giving the black/white/gray chrome a warm contrast point. Photos rendered full-color (Francisco will supply B&W ones directly where he wants that treatment — don't force a grayscale CSS filter on all images like the old draft did).

### Typography
```html
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```
- **Bodoni Moda** — hero H1, section H2s (display/structural headings)
- **Cormorant Garamond, italic** — eyebrow/kicker labels, testimonial quotes, pull-quote moments (adds the literary/theatrical texture)
- **Inter** — body copy, nav, buttons, form labels, UI chrome

### Component language (carried from the reference file, refined)
- Hairline borders (`1px solid var(--line)`), not shadows, as the primary separator
- Uppercase, letter-spaced micro-labels for kickers/nav (Inter, 11–12px)
- Square-ish radius (2px) — sharp and editorial, not soft/rounded
- Grid-of-cards sections separated by 1px hairlines (like the old `.testimonials`/`.tiers` grids)
- No drop shadows except a very soft one on the hero card

---

## 4. File / Folder Structure

```
/
├── index.html                 (single page, all sections, data-i18n attributes)
├── css/
│   └── style.css
├── js/
│   ├── translations.js        (all 4 languages' strings + currency logic)
│   └── script.js               (lang switch, progress bar, currency calc,
│                                 FAQ accordion, credits-list expand/collapse,
│                                 IBAN copy-to-clipboard)
├── assets/
│   └── images/
│       ├── hero.jpg             (headshot — Francisco to supply)
│       └── gallery/             (one per show + caption — Francisco to supply)
└── README.md                   (brief deploy note for GitHub Pages)
```

**i18n approach:** every translatable element gets `data-i18n="key.name"` in the HTML; `translations.js` holds one JS object per language (`en`, `fr`, `de`, `pt`) mapping keys → strings; `script.js` swaps `textContent`/`innerHTML` on language switch and persists the choice in `localStorage`. This avoids quadruplicating every sentence inline in the HTML (which is what made the old FR/EN-only file already start to feel heavy).

⚠️ **Translation quality note:** I'll draft FR, DE, and PT-PT (European, not Brazilian) translations in `translations.js`, but German and Portuguese should get a native proofread pass from Francisco or someone fluent before the page goes live — a fundraising page is not the place for an awkward or wrong-register phrase.

---

## 5. Site Structure & Content (English source copy)

### Nav bar
Logo/name mark + section links (Story · Journey · Contribute · Follow) + language switcher (EN / FR / DE / PT) + "Donate" CTA button (jumps to Contribute section).

---

### Section: Hero
**Purpose:** objective, progress, first impression.

- Eyebrow: *"Personal Campaign"*
- H1: *"Help Me Make My Dream Come True"* *(confirmed — translate naturally per language, don't force literal word-for-word translation)*
- Subtitle (draft):
  > My name is Francisco Borges Ribeiro. This September, I'm joining the Guildford School of Acting — one of the UK's most selective musical theatre schools, with 24 places offered out of roughly 5,000 auditionees each year — to complete my BA (Hons) in Musical Theatre. I'm raising the remaining funds for my 2nd and 3rd years of tuition and three years of accommodation.
- Progress bar: 0 / £83,100 (or local currency equivalent), with raised / goal / % stats
- Headshot (vertical, color) — asset from Francisco
- CTA row: "Donate now" (primary) / "Read my story" (ghost, scrolls to Story)

---

### Section: My Story
Four sub-blocks, each short (2–4 sentences), not a wall of text:

**1. Origin**
> I was born in Switzerland and moved to Portugal at three, where my father showed me the Eurovision Song Contest one evening — and I fell in love with the violin I saw being played. I started violin lessons at four. When my family returned to Switzerland in 2014, I joined a youth theatre group in Neuchâtel and, at 13, saw my first musical: *The Lion King*, in London. That night changed everything.

**2. Turning Point**
> During Covid, I couldn't get musical theatre out of my head. I joined Evaprod's "Elite" arts-study programme, and two years later, playing Barnum in *The Greatest Showman*, a close friend came to find me after the show in tears: *"Thank you. This is the best day of my life."* That's when I understood this wasn't just a passion — it was a calling.

**3. The Offers**
> I auditioned for 8 UK musical theatre schools and received offers from 5: Guildford School of Acting, LIPA, The Urdang Academy, Trinity Laban, and Performers College — alongside continuing a Computer Science and Physics degree at the University of Bern and the Pre-College Musical Theatre programme at the Neuchâtel Conservatoire.

**4. Why GSA**
> GSA offers 24 places out of roughly 5,000 auditionees each year. Beyond the numbers, it's where I felt I belonged — from a half-hour bench conversation with a singing teacher during a summer audition camp, to every GSA alumnus I've met at West End stage doors telling me the same thing: this school prepares you not just as a performer, but as a person.

**Expandable credits component** (click to expand, collapsed by default, short teaser visible):
Visible teaser: *Barnum · Hades in Hadestown · Johnny Rockfort in Starmania · Romeo · Nick Carraway in The Great Gatsby*
Expanded, full list (from portfolio):
- Romeo & Juliette — Romeo (2021)
- The Greatest Showman — Barnum (2022)
- Starmania — Johnny Rockfort (2023)
- Small Talk — Tim (2023)
- Le Médecin Malgré Lui — Léandre (2023)
- Singin' in the Rain — Dexter & Jazz Singer (2024)
- West Side Story (excerpts) — Tony, Riff & Ensemble (2024)
- Hadestown — Hades (2025)
- FANVision Song Contest, Malta — represented Switzerland, 2nd place (2025)
- The Great Gatsby — Nick Carraway (2026)

---

### Section: Testimonials
Horizontal scrollable card row, 1–2 trimmed sentences each (real quotes, condensed from the portfolio):

> "His dancing is characterised by a beautiful duality: powerful and imbued with lightness. With a strong stage presence, Francisco knows how to capture the audience's attention and move them."
> **— Claudia Grochain**, Dance teacher, co-founder of Kane Company

> "What stands out most is Francisco's great ability to adapt and his quick grasp of new concepts. I consider him a person of great talent with very strong potential — any company or school that takes him on will count itself lucky."
> **— Nicolas Farine**, Director, Neuchâtel Conservatoire of Music

> "Francisco possesses undeniable artistic qualities: rare sensitivity, an expressive voice and exceptional musicality — and a remarkable spirit of initiative. He is capable not only of shining individually, but of bringing out the best in others."
> **— Florian Iseli**, Founder & co-director, Evaprod School

> "Extremely gifted, Francisco stands out for his great sensitivity, which fuels the accuracy and depth of his performance. He is reliable, committed, and always attentive."
> **— Jacint Margarit**, Theatre teacher, Evaprod School

*(Francisco — confirm these trims feel right / not out of context before publishing.)*

---

### Section: My Work
Short intro line, then two clear buttons/cards linking out:

- **Auditions** → https://linktr.ee/w52pdzc7zy
- **Other work** → https://linktr.ee/w52pdzc7zy8

No embeds — just clean outbound links, per your instruction.

---

### Section: Where Your Money Goes + Transparency & FAQ
**Budget breakdown** (bars, same visual language as old file):

| Item | Amount |
|---|---|
| 2nd year tuition | £27,800 |
| 3rd year tuition | £27,800 |
| Accommodation (3 years) | £27,500 |

**Transparency note** (confirmed):
> Already secured through foundations and awards: **CHF 34,400**
> - Fondation Suisse d'Études — CHF 20,000 (non-renewable annual bursary)
> - Stiftung Dr. Hans und Hilde von Lorentz — CHF 13,900 (half of first semester's fees)
> - Prix Lily Landry (Conservatoire de Neuchâtel end-of-studies award) — CHF 500
>
> Further foundation applications are pending.

**FAQ (draft, expand/collapse accordion):**

- *What exactly will the funds be used for?* → 2nd and 3rd year tuition fees and accommodation across all three years at GSA. Year 1 and the remaining gap are covered through savings, family support, and ongoing foundation applications.
- *What happens if the goal isn't fully reached?* → Every contribution helps directly, even partial funding — it's combined with foundation grants I'm actively pursuing and my own savings.
- *Can I follow the campaign's progress?* → Yes — this page will be updated regularly, and I'll share news on Instagram and TikTok.
- *Is this a registered charity? Is my donation tax-deductible?* → No — this is a personal fundraising campaign, not a registered charity, so donations aren't tax-deductible. Funds go directly to me for tuition and accommodation costs.
- *Can I get a receipt for my donation?* → Yes, on request — email fbribeiro05@gmail.com.

---

### Section: How to Contribute
Three methods, same card layout as old file. **No QR codes** — personal (non-business) TWINT accounts in Switzerland can't generate a merchant-style QR code, so TWINT is phone-number based instead.

1. **TWINT** — display Francisco's phone number as the contact method (with a copy-to-clipboard button, same pattern as the IBAN one). No image asset needed for this method.
2. **Bank transfer (IBAN)** — account holder name + IBAN + reference. Francisco will fill these in **manually, directly in the HTML** — do not invent placeholder values. Mark the exact spot clearly with an HTML comment, e.g.:
   ```html
   <!-- FRANCISCO: replace with real IBAN -->
   <code id="iban">CH00 0000 0000 0000 0000 0</code>
   <!-- FRANCISCO: replace with real account holder name -->
   <span id="account-holder">[Account Holder Name]</span>
   ```
3. **PayPal** — button linking out. Francisco will fill this in manually too:
   ```html
   <!-- FRANCISCO: replace href with real paypal.me link -->
   <a class="btn btn-primary" href="#" target="_blank" rel="noopener">Donate via PayPal</a>
   ```

---

### Section: Follow My Journey
Short line about sharing updates, then:
- Instagram → `instagram.com/francisco.ribeiro05`
- TikTok → `tiktok.com/@francisco_ribeiro05`
- Email → `fbribeiro05@gmail.com`

---

### Footer
Thank-you line + "static page, no third-party cookies" note + © Francisco Borges Ribeiro.

---

## 6. Open Items — Francisco to confirm/supply before build

**Resolved:**
- [x] Campaign goal math confirmed (£83,100)
- [x] Foundation names confirmed public: Fondation Suisse d'Études, Stiftung Dr. Hans und Hilde von Lorentz
- [x] Award name confirmed: Prix Lily Landry
- [x] Testimonial quotes approved as trimmed
- [x] Hero H1 confirmed: "Help Me Make My Dream Come True"
- [x] TWINT method confirmed: phone number, no QR code

**Still needed:**
- [ ] Hero headshot + gallery photos (one per show + caption)
- [ ] Favicon and an Open Graph / social-share image (~1200×630) — not required for launch but recommended
- [ ] Francisco's phone number for the TWINT display
- [ ] Real IBAN + account holder name (Francisco will add these manually into the HTML at the marked comment)
- [ ] Real PayPal.me link (Francisco will add manually at the marked comment)
- [ ] Native proofread of DE and PT-PT translations before launch
- [ ] Confirm/update the GBP→CHF/EUR conversion rates before launch
- [ ] Gallery captions (show name + year, or something more personal)
