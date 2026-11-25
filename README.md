# The Social Circle

A one-page static website for a University of Waterloo PSYCH 253 group project. It helps Canadian teens (13–19) take a first step toward mental health support by removing small practical barriers (**channel factors**): whom to contact, how to contact them, what to say, what happens next, and putting it off.

Plain HTML, CSS and a small amount of vanilla JavaScript. No build step, backend, tracking, cookies or storage.

```
index.html          page content (all resource information lives here)
styles.css          styles; palette variables at the top (:root)
script.js           copy buttons + optional plan form (progressive enhancement)
tools/make_qr.py    QR generator (internal utility, not part of the site)
tools/requirements.txt
```

## 1. Preview locally

```sh
python3 -m http.server 8000
```
Open http://localhost:8000. Opening `index.html` directly also works, but copy buttons behave more reliably over `http://localhost`.

## 2. Deploy (GitHub Pages)

1. Push this repository to GitHub.
2. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, choose `main` and `/ (root)`, then save.
3. After a minute the site is live at `https://cynthiacxzhang.github.io/psych253-the-social-circle/`. All paths are relative, so it works in that subdirectory.

Any static host (Netlify Drop, Cloudflare Pages) also works: upload the folder as-is. Only `index.html`, `styles.css` and `script.js` need to be public.

## 3. Generate the QR code (after the final URL is known)

Only run this with the **final deployed HTTPS URL**. The script refuses `http://` and localhost addresses.

```sh
python3 -m venv .venv
.venv/bin/pip install -r tools/requirements.txt
.venv/bin/python tools/make_qr.py https://cynthiacxzhang.github.io/psych253-the-social-circle/
```

This writes `tools/qr-output/social-circle-qr.svg` (vector, preferred for print) and `social-circle-qr.png` (600 dpi). The output is plain black on white with the standard 4-module quiet zone. Don't recolour it, add a logo or crop the white border. Print the URL as text beside the code, then test-scan a **printed** copy with a few different phones (iPhone and Android) before printing in bulk.

## 4. Editing resource information

All teen-facing resource details are written directly in `index.html`:

- **Kids Help Phone**: the `data-tone="service"` article in the "Choose who to contact" section, plus the third item in the `#urgent` section.
- **911 / 988**: the `#urgent` section.
- **Verification date and sources**: the `<footer>`. Update the "Resource information checked" date by hand **only after re-checking the official sites**, and update the table below at the same time.

Colours and fonts: edit the variables at the top of `styles.css`. Each pastel has one fixed role (documented there) so the page stays consistent.

## 5. Resource verification

| Service | Official source | Claims checked | Date checked |
|---|---|---|---|
| Kids Help Phone | https://kidshelpphone.ca/ , /call , /text , /privacy-policy/ | Phone 1-800-668-6868, 24/7, professional counsellor, English/French plus other languages via interpreters; text CONNECT to 686868, 24/7, free, English/French, volunteer crisis responder; first texts are automated; text STOP to end; call starts with a welcome message and menu, may wait in a queue; services for young people in Canada; described as confidential; texting is "confidential (but not anonymous)"; may share information if someone is at risk of serious harm | 2026-11-25 |
| 9-8-8: Suicide Crisis Helpline | https://988.ca/ , /get-help/what-to-expect , /get-help/help-right-now , /terms | Call or text 9-8-8, 24/7, anywhere in Canada, English and French; for people thinking about suicide or worried about someone; "no one … will be turned away"; responders may involve emergency services if someone is at risk of dying or serious harm | 2026-11-25 |
| 9-1-1 | https://988.ca/get-help/help-right-now | Call 9-1-1 or go to the nearest emergency department in an emergency / when police, firefighters or an ambulance are needed, or if safety is at risk | 2026-11-25 |

Notes from verification:
- The Government of Canada 911 page (crtc.gc.ca) refused automated access, so the 911 wording follows 988.ca's official guidance. Text-with-911 is intentionally **not** mentioned because its requirements were not verified.
- Kids Help Phone Live Chat is **not** listed: the site showed conflicting hours (7 p.m.–midnight ET vs. midnight–7 a.m.). Re-check before adding it.
- School procedures are intentionally generic. No school name, contact or confidentiality policy is stated.

## 6. Features → channel-factor barriers

| Barrier | Website feature |
|---|---|
| Not knowing whom to contact | Three plainly described options (school, youth service, trusted adult), with "Good if…" guidance |
| Not knowing how to contact them | Explicit "How to start" steps; phone and text details shown as text and as tap-to-call/text links |
| Not knowing what to say | "Not sure what to say?" starter messages with one-tap copy |
| Not knowing what happens next | "What happens next" and "Privacy" notes for every option |
| Putting it off | Optional implementation-intention plan ("If I decide I need support, I will contact ___ by ___"); QR/URL access from a pocket card or locker sticker |

This is a student prototype with a proposed evaluation. No user testing has been done, and there is no evidence yet about effects on help-seeking.

## 7. Final checklist

- [ ] All `tel:` and `sms:` links open the dialler/messages app correctly on iPhone and Android
- [ ] Official source links (kidshelpphone.ca, 988.ca) load
- [ ] Resource details re-checked against official sites; footer date and table above updated
- [ ] Page readable at ~375 px width with no sideways scrolling; buttons are easy to tap
- [ ] Copy buttons work on a real phone (iOS Safari, Android Chrome)
- [ ] Keyboard: Tab reaches every link/button with a visible focus outline
- [ ] QR generated from the **final** URL, printed at actual card/sticker size, and scanned successfully on several phones
- [ ] Printed URL beside the QR code matches the deployed site
