# Implementierungsplan: Partnerprogramm (Numok)

Abgeleitet aus `PARTNERPROGRAMM-SPEC.md` (2026-08-19). Reihenfolge ist bindend — jeder Schritt setzt die Abnahme des vorigen voraus, außer wo ausdrücklich „parallel" steht.

**Branches:** Website `master`, Backend **`feat/partnerprogramm`, abgezweigt von `feat/account-platform-mvp`** — nicht von `master` (der ist vom April und kennt weder Stripe noch Konten). Commit-Autor auf beiden Repos: `shufflethis <tracktronaut@gmail.com>`, sonst blockt Vercel.

---

## Phase 0 — Entscheidungen

### Schritt 0.1 · Grundsatzentscheidungen — **erledigt am 2026-08-19**

| Frage | Entscheidung |
|---|---|
| Numok-Host | eigener neuer VPS |
| `/admin`-Schutz | IP-Allowlist am nginx |
| Cookie-Einwilligung | Consent-Gate, Cookie erst nach Einwilligung |
| Provisionsbasis | brutto, so dokumentiert |

Offen, aber nicht blockierend: Ablageort der Spec (Frage 1), Klick-Relay (Frage 4, Standard „gesperrt"), provisionsfähige Pläne (Frage 7, Standard „alle drei"). Details in Spec 10.

**Abnahme:** ✅ in Spec 10.1 dokumentiert.

### Schritt 0.2 · Stripe-Testmodus scharf machen

Im AgentLeads-Backend Test-Werte setzen: `STRIPE_API_KEY=sk_test_…`, `STRIPE_WEBHOOK_SECRET=whsec_…` (Testmodus), `STRIPE_PRICE_PRO` / `_AGENT` / `_PROCEDURE`.

> Ohne diesen Schritt ist die gesamte Kette nicht prüfbar: `/api/billing/webhook` antwortet heute **503**, weil `stripe_webhook_secret` leer ist (verifiziert am 2026-08-19).

**Abnahme:** `POST /api/billing/webhook` mit ungültiger Signatur liefert **400** statt 503. Das beweist, dass das Secret gesetzt ist und die Signaturprüfung greift.

---

## Phase 1 — Numok betriebsbereit (parallel zu Phase 2 möglich)

### Schritt 1.1 · VPS, DNS, TLS

**Neuen VPS bereitstellen** (Entscheidung 0.1), Docker + nginx + Certbot installieren, Firewall so, dass von außen nur 22/80/443 offen sind. `partner.ausschreibungsagenten.de` darauf zeigen lassen, nginx-Vhost nach dem Muster von `status.ausschreibungsagenten.de`, Proxy auf `127.0.0.1:8080`.

**Abnahme:** `curl -I https://partner.ausschreibungsagenten.de/login` → 200, gültiges Zertifikat, HTTP → HTTPS-Redirect steht. Ein externer Portscan zeigt außer 22/80/443 nichts.

### Schritt 1.2 · Gehärteter Compose-Stack

Vor dem ersten `docker compose up` in `docker/docker-compose.yml` und `.env`:

- `ports: "33060:3306"` beim `db`-Service **streichen** (oder auf `127.0.0.1:33060:3306`)
- `ports` beim `app`-Service auf `127.0.0.1:8080:80`
- `APP_DEBUG=0`
- `DB_PASS` / `DB_ROOT_PASSWORD` als Zufallswerte
- `RUN_MIGRATIONS=true` nur für den ersten Boot
- `ADMIN_EMAIL` auf eine echte Adresse

**Abnahme (alle vier müssen halten):**
1. `ss -tlnp | grep -E '33060|8080'` zeigt ausschließlich `127.0.0.1`-Bindungen, kein `0.0.0.0`.
2. Von einer **externen** Maschine: `nc -zv <host> 33060` schlägt fehl.
3. Eine absichtlich fehlerhafte URL liefert `500 - Internal Server Error` ohne Stacktrace.
4. `RUN_MIGRATIONS` steht nach dem ersten Boot auf `false`.

### Schritt 1.3 · Erstzugang absichern

Zwei Dinge, beide nötig:

1. Login als `ADMIN_EMAIL` / `admin123`, Passwort sofort ändern.
2. **IP-Allowlist** am nginx (Entscheidung 0.1): `location ^~ /admin { allow <IP>; … deny all; }`.

Die Allowlist ersetzt das Passwort nicht — sie weicht bei jedem Umzug oder IP-Wechsel auf.

**Abnahme:** Login mit `admin123` schlägt fehl. `/admin/login` von einer nicht gelisteten IP → 403 **vor** PHP (nachweisbar daran, dass kein Eintrag in Numoks Apache-Log entsteht).

### Schritt 1.4 · Endpunkte sperren und drosseln

nginx: `location /api/tracking { deny all; }` (bzw. bei „Relay" auf Frage 4: Allowlist + `limit_req`). `limit_req` auf `/register` und `/auth/register`.

**Abnahme:** `curl -X POST https://partner.…/api/tracking/click` → 403. 20 schnelle POSTs auf `/auth/register` → mindestens einer mit 429.

### Schritt 1.5 · Backups und Aufräumjobs

Täglicher verschlüsselter `mysqldump` off-site; zwei Cron-Jobs für `logs` (30 Tage) und `clicks` (`cookie_days + 30`).

**Abnahme:** Ein Restore in eine leere Datenbank läuft durch und enthält alle Tabellen. Beide Cron-Jobs haben mindestens einmal erfolgreich gelaufen (Log-Nachweis). Der Restore ist der Abnahmepunkt, nicht das Dump-File — ein ungeprüftes Backup ist kein Backup.

### Schritt 1.6 · Programm und Testpartner anlegen

Programm anlegen: `commission_type='percentage'`, `commission_value` nach Wahl, **Bezugsgröße brutto** (Entscheidung 0.1 — Numok rechnet ohnehin so, es muss nur in `terms` stehen), `cookie_days`, `is_recurring`, `reward_days`, `terms` (Entwurf aus 5.2). Testpartner mit `tracking_code = TESTPARTNER1`, `status='active'`, Programm zugewiesen.

**Abnahme:** `SELECT tracking_code, status FROM partner_programs` liefert die Zeile mit `active`. Login als Testpartner funktioniert.

> Der Menüpunkt `/tracking` wirft einen 500er — `PartnerTrackingController` ist geroutet, existiert aber nicht (Fund N1). Erwartet, kein Blocker; im Partner-Onboarding nicht verlinken.

---

## Phase 2 — Website (parallel zu Phase 1)

### Schritt 2.1 · `?via=`-Erfassung

`src/lib/partnerCode.js`: Query lesen, gegen `/^[A-Za-z0-9_-]{1,50}$/` validieren, **Code zunächst nur im Speicher halten**. Erst nach erteilter Einwilligung (Entscheidung 0.1) Cookie `aa_partner` mit `Domain=.ausschreibungsagenten.de; Path=/; Max-Age=<cookie_days*86400>; SameSite=Lax; Secure` setzen. **First-Touch**: bestehendes Cookie nie überschreiben. SSR-sicher — `entry-server.jsx` rendert dieselben Komponenten, jeder `document`-Zugriff muss geguardet sein.

### Schritt 2.1a · Einwilligung überhaupt erst ermöglichen

**Es gibt heute keine Consent-Verwaltung auf der Site.** `grep -ri "klaro|consent|einwillig"` trifft nur die Datenschutz-*Textseite*, und `grep document.cookie` über `src/` liefert **gar nichts**: die Seite setzt derzeit **kein einziges Cookie**. Die Entscheidung „Consent-Gate" fügt damit einen Schritt hinzu, den die Spec nicht enthielt.

Genau deshalb ist ein site-weites Banner hier die falsche Größe. Empfehlung:

- **Ein zweckgebundener Hinweis, der nur erscheint, wenn `?via=` in der URL steht.** Besucher ohne Partner-Link sehen nie etwas — die Site bleibt cookiefrei, wie sie es heute ist.
- Text nennt Zweck (Zuordnung zu einem Vertriebspartner), Laufzeit und die Ablehnmöglichkeit. Ablehnen ist der Standard: ohne aktive Zustimmung passiert nichts.
- Die Entscheidung wird in `localStorage` gemerkt, nicht in einem Cookie — sonst bräuchte der Einwilligungsspeicher selbst eine Einwilligung.
- Kein externer Anbieter: das hielte die CSP unverändert. (Zum Vergleich: agentifizierung.de hostet Klaro inzwischen selbst, nachdem der CDN-Bezug Probleme machte. Für einen einzigen Cookie lohnt selbst das nicht.)

Wächst die Site später auf mehrere einwilligungspflichtige Cookies, wird daraus ein richtiges CMP — dann aber als eigenes Vorhaben.

**Abnahme:** Aufruf ohne `?via=` → kein Hinweis, kein Cookie, `document.cookie` leer. Aufruf mit `?via=` → Hinweis erscheint; Ablehnen setzt kein Cookie; Zustimmen setzt `aa_partner`. Die Entscheidung überlebt einen Reload.

**Abnahme:** Unit-Test im Stil von `src/routes.test.js`:
1. gültiger Code **ohne** Einwilligung → **kein** Cookie
2. gültiger Code **mit** Einwilligung → Cookie gesetzt
3. ungültiger Code → verworfen, auch mit Einwilligung
4. zweiter Code → überschreibt nicht

`npm run build` läuft ohne SSR-Fehler durch. Fall 1 ist der, der ohne expliziten Test durchrutscht.

### Schritt 2.2 · Weiterreichung in `api/signup.js`

Cookie aus `req.headers.cookie` lesen (**nicht** aus dem Body), serverseitig erneut validieren, als `partner_tracking_code` in den Upstream-Body legen. Fehlt es, bleibt der Body unverändert.

**Abnahme:** `api/signup.test.js` erweitern: mit Cookie enthält der Upstream-Body das Feld, ohne Cookie nicht, bei manipuliertem Cookie (`<script>`, 80 Zeichen) ebenfalls nicht — und in keinem Fall gibt es einen Fehler an den Nutzer.

### Schritt 2.3 · Canonical bei `?via=`

`src/components/Seo.jsx`: Canonical immer als `SITE_ORIGIN + pathname`, ohne Query.

**Abnahme:** `src/seo.test.jsx` erweitern — Rendern unter `/?via=X` erzeugt `<link rel="canonical" href="https://www.ausschreibungsagenten.de/">`.

### Schritt 2.4 · `/partner`-Landingpage

Route in `src/routes.js` (`prerender: true`, Titel im Haus-Schema), Seite `src/pages/Partner.jsx` nach dem Muster der Vergleichsseiten, Footer-Verlinkung.

**Abnahme:** `npm run build` erzeugt die prerenderte Seite; `src/routes.test.js` und `src/legalBranding.test.jsx` bleiben grün; die Seite ist ohne JavaScript lesbar.

### Schritt 2.5 · Deploy Website

Commit als `shufflethis <tracktronaut@gmail.com>`, Push auf `master`, Vercel-Deploy.

**Abnahme:** `https://www.ausschreibungsagenten.de/partner` → 200. `?via=TESTPARTNER1` setzt das Cookie in einem echten Browser **nach** Einwilligung und **nicht** davor. CSP unverändert — Konsole ohne CSP-Verstöße.

---

## Phase 3 — Backend (Reihenfolge gegenüber Phase 2 frei)

> **Zur Deploy-Reihenfolge, geprüft:** Nach dem Website-Deploy (2.5) schickt `api/signup.js` das Feld `partner_tracking_code` an ein Backend, das es noch nicht kennt. Das ist **unkritisch**: `SignupIn` in `schemas.py:145` hat kein `model_config`, Pydantic v2 verwirft unbekannte Felder daher still (`extra="ignore"`). Stünde dort `extra="forbid"`, würde **jede** Anmeldung im Fenster zwischen beiden Deploys mit 422 scheitern — dann müsste Phase 3 zuerst. Wer `SignupIn` später auf `forbid` umstellt, muss diese Reihenfolge umdrehen.

### Schritt 3.1 · Migration und Modell

Branch `feat/partnerprogramm` von `feat/account-platform-mvp`.

- `User` um `partner_tracking_code` (String(50), nullable, Index) und `partner_attributed_at`
- `Organization` um dieselben zwei Spalten plus `partner_attribution_source`

Alembic-Revision nach dem Muster von `9e12c4a7b001_add_account_platform.py`. Der zweistufige Ablageort ist kein Luxus: `profiles.py:147` legt bedingungslos neue Organisationen an, ein Code allein an der Organisation wäre bei manchen Nutzern verwaist (Spec 4.1).

**Abnahme:** `alembic upgrade head` und `alembic downgrade -1` laufen beide durch. `tests/test_postgres_migrations.py` bleibt grün.

### Schritt 3.2 · Erfassung im Signup-Router

`SignupIn` um `partner_tracking_code: str | None` (max. 50, Pattern) erweitern; in `signup()` nach dem Flush den Code am **`User`** setzen, sofern dort noch keiner steht. **Keine** Organisation anlegen.

**Abnahme:** Tests 1–4 aus Spec 4.5 grün — insbesondere Test 1: es entsteht keine Organisation.

### Schritt 3.3 · Durchreichen an Stripe

An allen drei Einstiegen `metadata["numok_tracking_code"]` ergänzen. Codeherkunft in der Reihenfolge Organisation → Cookie `aa_partner` → User, mit Festschreibung an der Organisation. Überschreibungsregel aus Spec 4.4 anwenden.

**Zusätzlich, und das ist der Teil, der leicht untergeht:** `create_checkout_session` so anpassen, dass `numok_tracking_code` **nicht** in `subscription_data.metadata` kopiert wird (Spec 4.3a (B3a)). Andernfalls entsteht auf jede Erstzahlung eine doppelte Provision. `payment_intent_data.metadata` bleibt ungesetzt.

**Abnahme:** Tests 5–9 aus Spec 4.5 grün. **Test 9 ist der kritische** — er beweist, dass der Code in der Session-`metadata` steht und in `subscription_data.metadata` fehlt.

### Schritt 3.4 · Deploy Backend

Deploy des Branches auf die Instanz hinter `api.`/`app.ausschreibungsagenten.de`, Migration ausführen.

**Abnahme:** `POST /api/billing/checkout` → weiterhin 422 bei leerem Body (Route intakt). Ein Free-Signup über die Website mit `?via=TESTPARTNER1` erzeugt eine Organisation mit gesetztem `partner_tracking_code`.

---

## Phase 4 — Stripe verbinden (Testmodus)

### Schritt 4.1 · Numok-Schlüssel

In Numok unter `/admin/settings`: `stripe_webhook_secret` (Testmodus) und `stripe_secret_key` als **Restricted Key mit ausschließlich `Subscriptions: write`** (Begründung: Spec 6.3).

> Dieser Key ist tragend: seit Spec 4.3a (B3a) entstehen wiederkehrende Provisionen ausschließlich dadurch, dass Numok den Code selbst auf die Subscription schreibt. Fehlt der Key oder ist er zu eng, fällt die Folgeprovision **still** aus.

**Abnahme:** `SELECT name FROM settings` enthält beide Einträge; `/admin/settings/test-connection` meldet Erfolg.

### Schritt 4.2 · Zweiter Webhook-Endpunkt

In Stripe (Testmodus) `https://partner.ausschreibungsagenten.de/webhook/stripe` anlegen, Events `checkout.session.completed`, `payment_intent.succeeded`, `invoice.paid`. Der bestehende AgentLeads-Endpunkt bleibt unverändert.

**Abnahme:** Stripes „Send test webhook" liefert 200; in Numoks `logs` steht ein `webhook_received`-Eintrag.

### Schritt 4.3 · Durchstich-Abnahme

Die achtstufige Abnahme aus Spec 6.5 vollständig durchlaufen — **einschließlich Schritt 4 als Zählung (`COUNT(*) = 1`), Schritt 6 (Folgeprovision) und Schritt 8 (Negativtest ohne `?via=`)**. Genau diese drei werden gern übersprungen, und genau sie decken die Fehler auf, die sonst erst in der Provisionsabrechnung auffallen.

**Abnahme:** Alle acht Zeilen der Tabelle nachweislich erfüllt, mit SQL-Ausgabe oder Screenshot je Zeile. Für Schritt 4 zählt ausschließlich die Zählabfrage — „es gibt eine Conversion" ist bei doppelter Erstprovision ebenfalls wahr.

---

## Phase 5 — Recht und Kommunikation (parallel ab Phase 2, Veröffentlichung blockiert)

### Schritt 5.1 · Datenschutzerklärung ergänzen

`src/pages/Datenschutz.jsx` um das Cookie `aa_partner` erweitern (Inhalt, Laufzeit, Zweck, Rechtsgrundlage), Löschfristen aus Spec 5.5 spiegeln. Absatz zu IP-Speicherung nur bei „Relay" auf Frage 4.

**Abnahme:** Entwurf liegt vor. **Veröffentlichung blockiert (E-B2)** bis zur anwaltlichen Prüfung.

### Schritt 5.2 · Teilnahmebedingungen

Text nach Spec 7.2 verfassen, in `programs.terms` einpflegen. Die Zustimmung wird automatisch in `partner_programs.terms_accepted` + `terms_accepted_ip` protokolliert.

**Abnahme:** Entwurf deckt alle acht Punkte aus 7.2 ab. Ein Testpartner-Beitritt schreibt `terms_accepted`. **Veröffentlichung blockiert (E-B1).**

### Schritt 5.3 · Steuer- und Auszahlungsprozess

Klären: Gutschrift oder Partnerrechnung, Umgang mit Kleinunternehmern und EU-Ausland, Erhebung der Stammdaten **außerhalb** von Numok (Spec 7.3 — Numok hat die Felder nicht, ein Fork dafür lohnt nicht).

**Abnahme:** Ein schriftlicher Ablauf existiert, inklusive Auszahlungsschwelle und Formular für die Stammdaten. **Erste Auszahlung blockiert (D-B4).**

### Schritt 5.4 · Resend-Absender

Eigener Absender `partner@ausschreibungsagenten.de` auf der bereits verifizierten Domain, **eigener API-Key** — damit Zustellprobleme des Partnerprogramms die Transaktionsmails des Produkts nicht mitreißen.

**Abnahme:** Eine Testmail aus Numok (Passwort-Reset) kommt an und besteht SPF/DKIM.

---

## Phase 6 — Livegang

**Vollständig blockiert bis zur Stripe-Live-Freischaltung.**

| Schritt | Inhalt | Abnahme |
|---|---|---|
| 6.1 (D-B3) | Live-Preis-IDs im Backend setzen | `stripe_price_*` zeigen auf Live-Preise |
| 6.2 (D-B2) | Live-`STRIPE_WEBHOOK_SECRET` setzen | Webhook mit ungültiger Signatur → 400, nicht 503 |
| 6.3 (D-B1) | Live-Webhook-Endpunkt für Numok anlegen | Testzustellung aus Stripe → 200 |
| 6.4 | Durchstich (Spec 6.5) im Livemodus mit echter Karte und Kleinbetrag, danach erstattet | Conversion-Zeile entsteht, Erstattung setzt sie auf `rejected` |
| 6.5 (E-B1/E-B2) | Teilnahmebedingungen und Datenschutz veröffentlichen | beide Seiten live, `/partner` verlinkt sie |
| 6.6 (D-B5) | Programm bewerben, erste echte Partner aufnehmen | mindestens ein Partner auf `status='active'` |
| 6.7 (D-B4) | Erste Auszahlung nach dem Ablauf aus 5.3 | `conversions.status='paid'`, Beleg erzeugt |

---

## Was bewusst **nicht** in diesem Plan steht

- **Numok-Fork für Partner-Stammdaten** (Adresse, USt-IdNr., IBAN). Empfehlung: außerhalb erheben — die Auszahlung ist ohnehin manuell, ein Fork wäre dauerhafte Wartungslast ohne Gegenwert.
- **Eindeutschung der Numok-Oberfläche.** Für Scheibe 1 trägt die deutschsprachige Erklärung auf `/partner`; Numok bleibt das Werkzeug hinter dem Login.
- **Numoks Klick-Tracking-JS.** Verworfen mit Begründung in Spec 2.2 — der Endpunkt ist aus dem Browser nicht erreichbar (fehlende CORS-Header, kein `OPTIONS`-Routing).
- **Behebung der Numok-Funde N5–N7.** Tote Codepfade ohne Wirkung; dokumentiert, nicht angefasst.
