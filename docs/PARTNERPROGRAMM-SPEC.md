# Spec: Partnerprogramm (Numok) für ausschreibungsagenten.de

Stand: 2026-08-19 · Autor: Claude (gelesen, nicht aus dem Gedächtnis)

---

## 0. Grundlagen dieser Spec

### 0.1 Gelesene Quellen

Alle Aussagen unten stammen aus tatsächlich gelesenen Dateien, nicht aus Erinnerung.

| System | Repo / Ort | Branch | Gelesen |
|---|---|---|---|
| Website | `shufflethis/ausschreibungsagenten` | `master` | `api/signup.js`, `src/routes.js`, `vercel.json`, `.env.example`, `src/config/appOrigin.js` |
| AgentLeads-Backend | `shufflethis/ausschreibungsagent` | **`feat/account-platform-mvp`** | `routers/signup.py`, `routers/billing.py`, `billing/stripe_client.py`, `models.py`, `config.py`, `main.py` |
| Numok | `dfg-ar/numok` | `main` | `WebhookController.php`, `TrackingController.php`, `PartnerAuthController.php`, `ProgramScriptGenerator.php`, `public/index.php`, `database/*.sql`, `docker/*` |
| Produktion | live | — | `openapi.json` + Statuscodes von `app.ausschreibungsagenten.de` |

### 0.2 Zwei Befunde vorweg, die den Zuschnitt ändern

**Befund 1 — die lokalen Repos existierten nicht mehr.** Beide Projektordner waren beim Disk-Cleanup gelöscht worden (61 synchrone Repos, 17 GB). Sie wurden für diese Spec frisch aus GitHub geklont. Nichts ging verloren, aber: die Arbeitsstände lagen vollständig auf GitHub, nicht lokal.

**Befund 2 — `master` des Backends ist tot.** `master` ist vom 18.04.2026 und enthält *kein* Stripe, *kein* Signup, *keine* Konten. Der reale Stand liegt auf `feat/account-platform-mvp` (14.08.2026, 201 Commits vor `master`, enthält `feat/nachweisarchiv` und `feat/agent-native-monetization-mvp` vollständig). **Diese Spec basiert durchgehend auf `feat/account-platform-mvp`.** Der Produktionsdienst läuft ebenfalls auf diesem Stand — verifiziert über Live-Statuscodes (siehe 1.4), nicht über `openapi.json`, die diese Routen ausblendet.

---

## 1. Ist-Stand (verifiziert)

### 1.1 Website (`ausschreibungsagenten`, Vite/React SPA auf Vercel)

- **Default-Branch ist `master`**, nicht `main`. Gilt für beide Repos.
- Routen liegen zentral in `src/routes.js` (aktuell 229 Zeilen, Objekte mit `path`, `title`, `prerender`). Inhaltsseiten sind `prerender: true`, Konto-/Login-Seiten `prerender: false`.
- `vercel.json` setzt eine strikte CSP:
  `script-src 'self' 'unsafe-inline'; connect-src 'self'; form-action 'self' https://app.ausschreibungsagenten.de`
- `api/signup.js` ist ein dünner Proxy auf `${AGENTLEADS_API_BASE}/api/signup` mit **hart kodiertem `tier: 'free'`**, Honeypot-Feld `website`, E-Mail-Validierung, sonst keine Felder.
- `src/config/appOrigin.js` zeigt auf `https://app.ausschreibungsagenten.de`.

**Konsequenz:** Über die Website wird nie bezahlt. Der Kauf passiert später in der App. Der Partner-Code muss diesen Sprung überleben.

### 1.2 AgentLeads-Backend (FastAPI, `feat/account-platform-mvp`)

Es gibt **drei** Checkout-Einstiege und **zwei** parallele Kontenmodelle:

| Einstieg | Datei:Zeile | Kontext | Metadata heute |
|---|---|---|---|
| `POST /api/signup` (`tier != free`) | `routers/signup.py:53` | anonym, Legacy-Pfad | `user_id`, `tier` |
| `POST /api/billing/checkout` | `routers/billing.py:127` | anonym, „website" | `user_id`, `organization_id`, `tier`, `plan_code`, `source` |
| `POST /api/account/billing/checkout` | `routers/billing.py:182` | eingeloggter Owner + CSRF | `organization_id`, `user_id`, `plan_code`, `tier`, `source` |

Kontenmodelle:
- **Legacy:** `User.tier` / `User.stripe_customer_id` / `User.stripe_subscription_id` (`models.py:141`)
- **Aktuell:** `Organization` ← `Membership` → `User`, Abo in `Subscription` mit `organization_id` UNIQUE (`models.py:174-299`)

`_legacy_user_organization()` (`billing.py:50`) legt für Website-Käufer automatisch eine Organisation an. Der Webhook-Handler bedient beide Modelle nacheinander (`billing.py:492-493`).

**Organisationen entstehen an fünf Stellen** (`admin.py:181`, `admin.py:686`, `agents.py:351`, `billing.py:67`, `profiles.py:147`), und `profiles.py:147` — hinter `POST /api/public/company-profiles` — legt **ohne jede Prüfung auf eine bestehende Organisation** eine neue an. Ein Nutzer kann damit mehrere Organisationen haben. Das ist der Grund für den zweistufigen Ablageort in B1.

`create_checkout_session()` (`billing/stripe_client.py`) kopiert bei `mode="subscription"` das `metadata`-Dict **zusätzlich nach `subscription_data.metadata`**. Das sieht wie der bequeme Weg aus, ist aber die zentrale Stolperfalle des ganzen Vorhabens — siehe B3a (4.3a).

Der Webhook `/api/billing/webhook` ist bereits sauber gebaut: Signaturprüfung, Idempotenz über `stripe_webhook_events` mit UNIQUE `stripe_event_id`, 5-Minuten-In-Progress-Fenster, Status `processing → processed/failed`.

Relevante Settings (`config.py:71-80`): `stripe_api_key`, `stripe_webhook_secret`, `stripe_price_pro`, `stripe_price_agent`, `stripe_price_procedure`, `stripe_success_url`, `stripe_cancel_url`, `stripe_portal_return_url`, `stripe_past_due_grace_days`, `stripe_test_stub_enabled`.

### 1.3 Numok (`dfg-ar/numok`, Plain-PHP 8.2 + Apache + MySQL 8)

Der Vertrag zur Außenwelt ist **eine einzige Zeichenkette**: `metadata.numok_tracking_code` auf dem Stripe-Objekt.

- `checkout.session.completed` → `handleCheckoutCompleted()` liest `$session->metadata->numok_tracking_code`, sucht `partner_programs.tracking_code`, legt `conversions`-Zeile an. Bei `mode=subscription` schreibt Numok den Code anschließend selbst per `\Stripe\Subscription::update()` in die Subscription-Metadaten.
- `payment_intent.succeeded` → analog über `$paymentIntent->metadata`.
- `invoice.paid` → Folgezahlungen über `$invoice->subscription_details->metadata`; erste Zahlung nach Trial aktualisiert die bestehende Conversion.

Schema (`database/0001-basic-schema.sql`):
- `partners`: `email`, `password`, `company_name`, `contact_name`, `status(pending|active|rejected|suspended)`, **`payment_email`** — mehr nicht.
- `programs`: `commission_type(percentage|fixed)`, `commission_value`, `cookie_days`, `is_recurring`, `reward_days`, `terms`, `is_private`
- `partner_programs`: `tracking_code` UNIQUE varchar(50), `terms_accepted`, `terms_accepted_ip`
- `conversions`: `stripe_payment_id` UNIQUE, `amount`, `commission_amount`, `status(pending|payable|rejected|paid)`, `customer_email`
- `clicks`: `ip_address`, `user_agent`, `referer`, `sub_ids`
- `logs`: `type`, `message`, `context`

**Es gibt keine `payouts`-Tabelle.** Auszahlung ist vollständig manuell; `payment_email` ist das einzige Auszahlungsfeld. Keine Adresse, keine Steuernummer, keine Schwelle, keine Belegerzeugung. Ebenso keine Währungsspalte — `amount decimal(10,2)` unterstellt eine einzige Währung.

### 1.4 Produktion — was heute wirklich läuft

`openapi.json` von `app.ausschreibungsagenten.de` listet 32 Pfade und **keine** Billing-Routen. Das ist irreführend: die Routen sind ausgeblendet, nicht abwesend. Direkte Probe:

| Route | HTTP | Bedeutung |
|---|---|---|
| `POST /api/billing/checkout` | 422 | Route existiert, Body ungültig |
| `POST /api/billing/webhook` | **503** | Route existiert, `STRIPE_WEBHOOK_SECRET` **nicht gesetzt** |
| `POST /api/account/billing/checkout` | 401 | Route existiert, Auth nötig |

Der 503 kommt exakt aus `billing.py:443-447`. **Stripe ist in Produktion heute nicht scharfgeschaltet.** `api.` und `app.ausschreibungsagenten.de` zeigen auf dieselbe Instanz (identische `openapi.json`, Titel `agentleads 0.1.0`). Diese Instanz läuft nicht auf diesem Host (`/root`) — in `/etc/nginx/sites-enabled` gibt es nur `status.ausschreibungsagenten.de` als Uptime-Kuma-Proxy.

---

## 2. Architekturentscheidung: Erfassung first-party, nicht per Numok-JS

### 2.1 Empfehlung

**Die `?via=`-Erfassung wird selbst gebaut (First-Party-Cookie auf `.ausschreibungsagenten.de`). Numoks `program-N.js` wird nicht eingebunden.** Numok bleibt Partner-Verwaltung, Provisionsrechnung und Stripe-Webhook-Konsument.

### 2.2 Warum — zwei belegte Gründe, nicht Geschmack

**Grund 1: Numoks Klick-Endpunkt ist aus dem Browser nicht erreichbar.**
`ProgramScriptGenerator.php:50` schickt `fetch(POST /api/tracking/click)` mit `Content-Type: application/json`. Das erzwingt einen CORS-Preflight. `TrackingController::click()` (Zeile 74-118) setzt **keine** `Access-Control-*`-Header, und `public/index.php` registriert **keine** `OPTIONS`-Behandlung — der Preflight endet im 404-Zweig. Der Klick würde in jedem Browser scheitern. Das ist ein Fehler in Numok, kein Konfigurationsproblem.

**Grund 2: CSP-Kosten und Datenschutz-Kosten.**
Die Einbindung verlangte `script-src` **und** `connect-src` für den Partner-Host. Damit dürfte fremder Code auf allen Seiten laufen und nach außen senden — für einen reinen Klickzähler zu teuer. Der Numok-Cookie wäre zudem clientseitig gesetzt (kein `HttpOnly`, kein `SameSite`, kein `Secure`) und enthielte ein JSON mit Referrer.

### 2.3 Verworfene Variante, mit Grund

*Numok-JS einbinden:* verworfen wegen 2.2. Falls sie später doch gewünscht ist, wären drei Patches an Numok nötig — CORS-Header auf `click`, eine `OPTIONS`-Route, `Secure`/`SameSite` am Cookie. Das ist eine Fork-Entscheidung und gehört nicht in Scheibe 1.

### 2.4 Was daraus folgt

- Numoks `clicks`-Tabelle bleibt leer. **Für die Provision ist das folgenlos** — der Webhook löst ausschließlich über `tracking_code` auf und rührt `clicks` nie an. Es fehlt nur die Klick-Statistik im Partner-Dashboard.
- Optional (offene Frage 4): ein **Server-zu-Server-Relay** aus der Vercel-Function an `/api/tracking/click`. Kein CORS-Problem, und wir können IP/User-Agent bewusst *weglassen* — dann fällt der halbe Datenschutz-Absatz in E weg.

---

## 3. Fläche A — Website-Repo (`ausschreibungsagenten`)

### A1 · `?via=`-Erfassung

Neues Modul `src/lib/partnerCode.js`, aufgerufen im App-Mount (SSR-sicher — `entry-server.jsx` rendert dieselben Komponenten, also muss jeder `document`-Zugriff geguardet sein).

- Liest `via`, `sid`, `sid2`, `sid3` aus `window.location.search`.
- Validiert `via` gegen `/^[A-Za-z0-9_-]{1,50}$/` — die Länge folgt `partner_programs.tracking_code varchar(50)`. Ungültiges wird verworfen, nicht gespeichert.
- **Consent-Gate (entschieden, siehe 10.1):** der Code wird nach der Validierung zunächst nur im Speicher gehalten. Das Cookie entsteht **erst nach erteilter Einwilligung**. Verlässt der Besucher die Seite vorher, ist der Code weg — das ist die bewusst in Kauf genommene Folge.
- Setzt danach Cookie `aa_partner`:
  `Domain=.ausschreibungsagenten.de; Path=/; Max-Age=<cookie_days*86400>; SameSite=Lax; Secure`
- **`Domain=.ausschreibungsagenten.de` ist der Kern des Entwurfs.** Nur so sendet der Browser den Code auch an `app.ausschreibungsagenten.de` — damit ist der Fall „Code kommt erst beim Checkout an" gelöst, ohne Server-State zwischen Website und App zu teilen.
- **First-Touch gewinnt:** existiert das Cookie schon, wird es *nicht* überschrieben. Begründung in 4.2.

### A2 · Weiterreichung an das Backend

`api/signup.js` erweitern:
- Cookie `aa_partner` aus `req.headers.cookie` lesen (nicht aus dem Body — der Body kommt vom Client und ist manipulierbar; das Cookie ist es auch, aber wir kopieren wenigstens keinen frei wählbaren Body-Wert).
- Serverseitig erneut gegen dasselbe Muster validieren. **Defensiv parsen** — hier gilt dieselbe Regel wie bei den Vercel-Env-Vars: nie dem gepasteten/übertragenen Wert trauen.
- Als `partner_tracking_code` in den Upstream-Body an `/api/signup` legen.
- Bleibt still, wenn das Feld fehlt: kein Fehler, nur kein Code.

### A3 · `/partner`-Landingpage

Neue Route in `src/routes.js`, gebaut nach dem Muster der Vergleichsseiten (`/vergabepilot-alternative` etc.):

- `path: '/partner'`, `prerender: true`, Titel im Haus-Schema `… | Ausschreibungsagenten.de`
- Inhalt: Provisionsmodell, Cookie-Laufzeit, was erlaubt und was verboten ist, Auszahlungsweg, Link auf die Teilnahmebedingungen, CTA auf `https://partner.ausschreibungsagenten.de/register`
- Footer-Verlinkung in `src/components/Footer.jsx`
- `form-action` der CSP muss **nicht** erweitert werden, solange der CTA ein Link und kein Formular ist. Wird stattdessen ein Bewerbungsformular auf der Seite gewünscht, kommt `https://partner.ausschreibungsagenten.de` in `form-action` — das ist dann eine bewusste Änderung, keine Nebenwirkung.

### A4 · Canonical bei `?via=`-URLs

Partner verlinken auf `/?via=abc`, `/preise?via=abc` usw. Ohne Gegenmaßnahme entstehen beliebig viele indexierbare Duplikate.

- `src/components/Seo.jsx` muss den Canonical **immer ohne Query-String** ausgeben (`SITE_ORIGIN + pathname`).
- Zusätzlich in `vercel.json` ein `Link: <…>; rel="canonical"`-Header zu setzen ist nicht nötig und wäre bei einer SPA fehleranfällig — der Canonical im Head reicht, weil die Seiten prerendered ausgeliefert werden.
- **Kein** `noindex` auf `?via=`-URLs: das würde den Prerender-Pfad mitnehmen.

### A5 · CSP-Delta

Bei der empfohlenen Variante (2.1): **kein Delta.** Das ist der Hauptgewinn. Nur falls Offene Frage 4 mit „Relay" beantwortet wird, ändert sich ebenfalls nichts an der CSP — das Relay läuft serverseitig in der Vercel-Function.

---

## 4. Fläche B — AgentLeads-Backend (`ausschreibungsagent`)

> Basis-Branch: `feat/account-platform-mvp`. Ein neuer Branch `feat/partnerprogramm` zweigt davon ab, **nicht** von `master`.

### B1 · Feld für den Partner-Code — an **beiden** Objekten

Der naheliegende Ablageort wäre allein die `Organization`, weil der bezahlte Checkout organisationsbezogen ist. **Das trägt nicht.** `create_organization()` wird an fünf Stellen aufgerufen, und `POST /api/public/company-profiles` (`routers/profiles.py:147`) legt **bedingungslos eine neue Organisation** an — ohne Suche nach einer bestehenden für dieselbe E-Mail. Wer sich anmeldet und danach ein Suchprofil anlegt, hat zwei Organisationen; ein Code an der ersten wäre verwaist, während der spätere Checkout gegen die zweite liefe.

Daher zweistufig.

**`users`** — Erfassung beim Signup:

| Spalte | Typ | Zweck |
|---|---|---|
| `partner_tracking_code` | `String(50)`, nullable, indiziert | der Code, so wie er hereinkam |
| `partner_attributed_at` | `DateTime(timezone=True)`, nullable | wann |

**`organizations`** — Festschreibung beim Checkout:

| Spalte | Typ | Zweck |
|---|---|---|
| `partner_tracking_code` | `String(50)`, nullable, indiziert | der abrechnungsrelevante Code |
| `partner_attributed_at` | `DateTime(timezone=True)`, nullable | wann |
| `partner_attribution_source` | `String(24)`, nullable | `signup` / `checkout_cookie` / `user` |

Der Code am `User` ist die Aufzeichnung, der Code an der `Organization` ist die Abrechnungswahrheit. Nur letzterer entscheidet über Provision, und nur er unterliegt der Überschreibungssperre aus B4.

Alembic-Migration analog `9e12c4a7b001_add_account_platform.py`. Reines `ADD COLUMN`, nullable, kein Backfill — nicht sperrend.

### B2 · Erfassung im Signup-Router

`routers/signup.py`:
- `SignupIn` (in `schemas.py`) um `partner_tracking_code: str | None` erweitern, mit `max_length=50` und Pattern-Validierung im Schema selbst.
- Nach `session.flush()`: Code am **`User`** setzen, sofern dort noch `None` (First-Touch).
- **Keine** Organisation an dieser Stelle anlegen oder verändern — sonst entsteht genau die Dublette, die B1 vermeidet.

### B3 · Durchreichen in `create_checkout_session`

An allen **drei** Einstiegen (siehe 1.2) wird das `metadata`-Dict der Checkout-Session um einen Schlüssel ergänzt:

```
metadata["numok_tracking_code"] = <code>   # nur wenn vorhanden
```

Der Schlüsselname ist nicht verhandelbar — `WebhookController.php:69` liest exakt `numok_tracking_code`.

Codeherkunft, in dieser Reihenfolge: (1) `organization.partner_tracking_code`, (2) Cookie `aa_partner` aus `request.cookies`, (3) `user.partner_tracking_code`. Der gefundene Wert wird zugleich an der Organisation festgeschrieben, mit passender `partner_attribution_source`. Stufe 2 ist der Fall „Code kommt erst beim Checkout an" — möglich nur durch die Domain-Cookie-Entscheidung in A1.

### B3a · Der Code darf **nicht** in `subscription_data.metadata`

Das ist die Stelle, an der eine naheliegende Annahme in eine doppelte Provision kippt.

`stripe_client.py` kopiert bei `mode="subscription"` das gesamte `metadata`-Dict zusätzlich nach `subscription_data.metadata`. Klingt gut — die Subscription trüge den Code, und Folgezahlungen wären abgedeckt. Der Ablauf bei der **ersten** Zahlung sieht dann aber so aus:

1. Die Subscription entsteht mit `numok_tracking_code` in den Metadaten.
2. Die erste Rechnung wird gemeinsam mit der Subscription erzeugt und übernimmt deren Metadaten als Momentaufnahme in `invoice.subscription_details.metadata`.
3. `checkout.session.completed` → Numok legt Conversion #1 an, `stripe_payment_id = sub_…`.
4. `invoice.paid` → `handleInvoicePaid()` findet Conversion #1, deren `amount` ist **nicht** 0 (kein Trial) → Zweig `createRecurringConversion()` → Code ist in der Momentaufnahme vorhanden, `is_recurring = 1` → **Conversion #2**, `stripe_payment_id = pi_…`.

`stripe_payment_id` ist UNIQUE, aber `sub_…` ≠ `pi_…` — der Index greift nicht. **Ergebnis: doppelte Provision auf jede Erstzahlung.** Die Reihenfolge der Events ändert daran nichts; treffen sie umgekehrt ein, entstehen dieselben zwei Zeilen.

Numok im Auslieferungszustand hat dieses Problem nicht, und zwar aus einem präzisen Grund: dort landet der Code erst **nach** dem Checkout auf der Subscription (per `Subscription::update`, `WebhookController.php:131`). Die Momentaufnahme der ersten Rechnung ist deshalb leer, `createRecurringConversion()` steigt aus — und ab der zweiten Rechnung ist der Code da.

**Festlegung:** `numok_tracking_code` kommt ausschließlich in die `metadata` der Checkout-Session, **nicht** in `subscription_data.metadata`. Umsetzung: entweder ein zusätzlicher Parameter an `create_checkout_session` (`subscription_metadata: dict | None`), oder der Schlüssel wird vor der Kopie nach `subscription_data` entfernt. Ersteres ist sauberer, weil es die bestehende Kopiersemantik für alle anderen Schlüssel unangetastet lässt.

**Folge für D3:** Numoks eigenes `Subscription::update()` ist damit **nicht redundant, sondern tragend** — es ist der einzige Weg, auf dem wiederkehrende Provisionen entstehen. Der Restricted Key mit `Subscriptions: write` ist deshalb Pflicht, nicht Kür, und sein Funktionieren gehört in die Abnahme (D5, Schritt 4).

**Gleiche Falle beim Einmalkauf (`procedure`, `mode="payment"`):** `payment_intent_data.metadata` darf ebenfalls **nicht** gesetzt werden. Sonst feuern `checkout.session.completed` und `payment_intent.succeeded` beide mit demselben `pi_…`; die zweite Einfügung verletzt den UNIQUE-Index, `Database::insert` wirft, `WebhookController` reicht die Exception durch → HTTP 500 → Stripe wiederholt den Event dauerhaft. Heute wird `payment_intent_data` nicht gesetzt; das muss so bleiben.

### B4 · Bestandsnutzer und Überschreibungsregel

Eine Regel, drei Fälle:

| Fall | Verhalten |
|---|---|
| Organisation hat noch keinen Code | Code wird gesetzt, `attributed_at = now` |
| Organisation hat einen Code, **kein** aktives Abo | Code wird **nicht** überschrieben (First-Touch) |
| Organisation hat einen Code **und** ein Abo mit `status in (active, past_due, trialing)` | Code wird **nicht** überschrieben, und beim Checkout **nicht** erneut mitgegeben |

Der dritte Fall ist die eigentliche Missbrauchsbremse: sonst könnte ein Partner einen Bestandskunden über einen `?via=`-Link schicken und Provision auf einen Umsatz kassieren, den er nicht gebracht hat. Zusätzlich: liegt `organization.created_at` **vor** dem Startdatum des Partnerprogramms, wird nie zugeschrieben. Das Startdatum kommt als Setting `partner_program_start_at`.

> Anmerkung, ausdrücklich als Empfehlung und nicht als Entscheidung: die Grenze hängt hier an der Organisation — einem Objekt, das der Käufer selbst erzeugen kann. Wer ein zweites Konto anlegt, ist wieder Neukunde. Das ist bei einem Partnerprogramm hinnehmbar (der Partner bekommt Provision auf echten Umsatz), aber es sollte bewusst so entschieden sein.

### B5 · Tests

Neue Datei `tests/test_partner_attribution.py`, Stil wie `tests/test_billing.py` / `test_signup.py`:

1. Signup mit gültigem Code → **`User`** trägt Code; es entsteht **keine** Organisation
2. Signup mit ungültigem Code (Sonderzeichen, 80 Zeichen) → 422, kein Schreibvorgang
3. Signup ohne Code → `partner_tracking_code is None`, kein Fehler
4. Zweites Signup mit anderem Code → First-Touch bleibt stehen
5. `create_account_checkout` mit Code an der Organisation → `numok_tracking_code` im übergebenen `metadata` (Stripe-Aufruf gemockt)
6. Dito über den Cookie-Fallback → Code landet in `metadata` **und** wird an der Organisation persistiert
7. Dito über `user.partner_tracking_code`, wenn Organisation und Cookie leer sind
8. Organisation mit aktivem Abo → Code wird **nicht** in `metadata` gelegt
9. `mode="subscription"` → Code liegt in `metadata`, **aber nicht** in `subscription_data.metadata`

**Test 9 ist der wichtigste.** Er verhindert die doppelte Erstprovision aus B3a — ein Fehler, der in der Testabnahme wie ein Erfolg aussieht und erst in der Provisionsabrechnung auffällt.

---

## 5. Fläche C — VPS und Betrieb

### C1 · Ziel-Setup

`partner.ausschreibungsagenten.de` → nginx (TLS-Terminierung, Let's Encrypt) → `127.0.0.1:8080` → Numok-Container.

**Die vorhandene Landschaft, gemessen am 20.08.2026** (per DNS-Auflösung, nicht aus Erinnerung):

| Dienst | Adresse | Wo |
|---|---|---|
| Website `www.` | `216.150.1.x` | **Vercel** — gar kein eigener Server |
| Backend `api.` + `app.` | `159.195.43.209` | eigener VPS |
| Statusseite `status.` | `5.175.245.50` | der Arbeitshost `vm21182` |

Es gibt also bereits zwei Maschinen plus Vercel. Numok ist klein — PHP plus MySQL, geschätzt 1 GB RAM und 5 GB Platte. **Ressourcen sind kein Argument für eine dritte Maschine**, es bleibt allein das Sicherheitsargument:

- **Der Arbeitshost `vm21182` scheidet aus.** Dort liegen rund 30 Repos, der agent-hub mit `hub.db`, `.mcp.json` mit einem GitHub-Token im Klartext, die Scraper mit ihren VPN-Konfigurationen und ein Dutzend Docker-Netze. Numok bringt einen `admin123`-Seed und keine Framework-Härtung mit — der Einbruchsradius wäre dort am größten. Dazu: 87 % Plattenbelegung und ein wiederkehrendes Volllaufen durch Cron-Klone nach `/tmp`.
- **Der Backend-VPS** ist der pragmatische Kompromiss: ein nginx, ein Certbot, eine Backup-Routine statt drei. Preis ist die Nachbarschaft zur Kundendatenbank.
- **Ein dritter kleiner VPS** (~5 €/Monat) trennt sauber und bleibt die Empfehlung.

### C2 · Härtung des Compose-Stacks — Ist und Soll

Verifiziert aus `docker/docker-compose.yml` und `docker/.env_example`:

| Fund | Datei | Ist | Soll |
|---|---|---|---|
| MySQL im Internet | `docker-compose.yml`, `ports: "33060:3306"` | auf **0.0.0.0:33060** veröffentlicht | Mapping **ersatzlos streichen**. Der App-Container erreicht `db:3306` über das Compose-Netz. Wenn ein Host-Zugang gebraucht wird: `127.0.0.1:33060:3306`. |
| App im Klartext | `ports: "${VIRTUAL_PORT}:80"` | 0.0.0.0:8080, HTTP | `127.0.0.1:8080:80`, TLS am nginx |
| Debug an | `APP_DEBUG: ${APP_DEBUG-1}` | Default **1** | `0`. Bei `1` wirft `public/index.php:122` Exceptions ins Antwortdokument. |
| Default-Admin | `docker/entrypoint.sh` | `admin@numok.com` / **`admin123`** (fester bcrypt-Hash im Skript) | vor der ersten Erreichbarkeit ändern; besser: `ADMIN_EMAIL` setzen und Passwort direkt nach dem ersten Login rotieren |
| Migrations-Flag | `RUN_MIGRATIONS: ${RUN_MIGRATIONS-true}` | Default **true** | nach dem ersten Boot auf `false` |
| DB-Passwörter | `.env_example` | `change_me_app_2025` / `change_me_root_2025` | erzeugte Zufallswerte |
| MySQL ohne TLS | `command: --skip-ssl` | aus | im reinen Compose-Netz vertretbar, sobald 33060 zu ist — sonst nicht |

### C3 · Offene Endpunkte und Missbrauch

- `POST /api/tracking/click` ist **unauthentifiziert und ungedrosselt** (`TrackingController.php:74`). Jeder kann beliebig viele Zeilen in `clicks` schreiben. Bei der empfohlenen Architektur wird der Endpunkt gar nicht genutzt → **am Reverse Proxy sperren** (`location /api/tracking { deny all; }`), oder bei aktivem Relay auf die Vercel-Ausgangs-IPs beschränken plus `limit_req`.
- **`/register` erlaubt Selbstregistrierung — und zwar sofort wirksam.** Eine frühere Fassung dieser Spec behauptete, neue Konten starteten auf `pending`. Das ist **falsch**: die Aussage stammte aus dem Datenbank-Standard, aber `PartnerAuthController::store()` überschreibt ihn mit `'status' => 'active'  // Automatically activate partners`. Wer sich registriert, kann sich sofort anmelden.

  Damit war die Kette bis zur Provision offen, solange das Programm `is_private = 0` trug: registrieren → aktiv → öffentliches Programm sehen (`PartnerProgramsController::index` zeigt alles mit `is_private = 0`) → selbst beitreten (`join` verlangt ebenfalls nur `is_private = 0`) → eigener `tracking_code` mit `status='active'` → 20 % wiederkehrend. Ohne jede Prüfung.

  Der teure Fall ist **Selbstempfehlung**: wer das bemerkt, kauft über den eigenen Link und bekommt dauerhaft ein Fünftel zurück.

  **Gegenmaßnahme, umgesetzt am 20.08.2026:** `programs.is_private = 1`. Registrieren kann sich weiterhin jeder, aber niemand sieht das Programm oder tritt bei — die Zuordnung passiert ausschließlich in der Verwaltung. Geprüft mit einer echten Fremdregistrierung: kein Treffer in der Programmliste, kein `tracking_code` nach dem Beitrittsversuch. Zusätzlich `limit_req` auf `/register` und `/auth/register`.

  **Wer das Programm je wieder auf `is_private = 0` setzt, öffnet die Kette erneut.**
- `/admin` bekommt eine **IP-Allowlist am nginx** (entschieden, 10.1): `location ^~ /admin { allow <IPs>; deny all; … }`. Der Schutz greift vor PHP. Er ersetzt **nicht** das Rotieren des `admin123`-Seeds — beides ist nötig, weil die Allowlist bei einem Umzug oder wechselnder IP schnell wieder aufgeweicht wird.

### C4 · Backups

- Täglicher `mysqldump` des Numok-Schemas, verschlüsselt, **off-site**. Das Backup enthält `conversions.customer_email` und `clicks.ip_address` — es ist personenbezogen und gehört nicht unverschlüsselt neben den Server.
- Aufbewahrung passend zur Widerspruchsfrist der Provisionsabrechnung (Vorschlag: 12 Monate rollierend).
- Volumes `numok_db_data`, `numok_tracking_data`, `numok_uploads_data` sind benannte Docker-Volumes — beim Host-Umzug mit umziehen.

### C5 · Aufräumjobs (nicht optional)

`WebhookController::stripeWebhook()` protokolliert in **Zeile 12-15 den kompletten rohen Stripe-Payload** in `logs`, vor jeder Prüfung. Darin stecken Kunden-E-Mail, Beträge, Stripe-IDs. Ohne Gegenmaßnahme wächst diese Tabelle unbegrenzt mit personenbezogenen Daten. Zwei Maßnahmen:

1. Cron: `DELETE FROM logs WHERE created_at < NOW() - INTERVAL 30 DAY`
2. Cron: `DELETE FROM clicks WHERE created_at < NOW() - INTERVAL <cookie_days + 30> DAY`

Das ist zugleich Disk-Hygiene — der Host hier läuft chronisch voll.

### C6 · Monitoring

Uptime Kuma läuft bereits auf `status.ausschreibungsagenten.de` (nginx-Proxy auf `127.0.0.1:3003`). Dort aufnehmen: `partner.ausschreibungsagenten.de` (HTTP 200) und ein Keyword-Monitor auf `/login`. Ein Monitor auf `/webhook/stripe` ist sinnlos — der Endpunkt akzeptiert nur signierte POSTs.

---

## 6. Fläche D — Stripe

### D1 · Zielbild

Ein Stripe-Account, **zwei** Webhook-Endpunkte:

| Endpunkt | Ziel | Events |
|---|---|---|
| bestehend | `https://api.ausschreibungsagenten.de/api/billing/webhook` | Abo-Lebenszyklus (heute **503**, siehe 1.4) |
| neu | `https://partner.ausschreibungsagenten.de/webhook/stripe` | `checkout.session.completed`, `payment_intent.succeeded`, `invoice.paid` |

Stripe liefert an beide unabhängig aus, mit getrennten Signing-Secrets und getrennten Retries. Kein Fan-out, kein Reihenfolgeproblem — die Systeme kennen einander nicht.

### D2 · Zuerst vollständig im Testmodus

Alles unten läuft mit `sk_test_…` und Test-Preisen, in Numok wie in AgentLeads. Erst wenn D5 grün ist, wird über Live gesprochen.

### D3 · Schlüssel in Numok

Numok braucht in `settings` `stripe_webhook_secret` (Signaturprüfung) und `stripe_secret_key` (für `Subscription::update`, `WebhookController.php:128`).

**Empfehlung: ein Restricted Key mit ausschließlich `Subscriptions: write`.** Numok ist die schwächste Box in der Kette (Plain-PHP, kein Framework, Default-Admin, Debug an). Ein voller Secret Key dort ist ein unnötiger Hebel.

**Dieser Key ist tragend, nicht optional.** Nach B3a schreiben wir den Code bewusst *nicht* in `subscription_data.metadata` — wiederkehrende Provisionen entstehen also ausschließlich dadurch, dass Numok den Code nach dem Checkout selbst auf die Subscription schreibt. Ein fehlender oder zu eng geschnittener Key lässt die Folgeprovision **still** ausfallen: keine Fehlermeldung, nur ausbleibende Zeilen. Deshalb prüft D5 in Schritt 4 ausdrücklich den Log-Eintrag `subscription_metadata_updated`.

### D4 · Was heute blockiert ist

**🔒 BLOCKIERT bis zur Stripe-Live-Freischaltung:**

- **D-B1** Live-Webhook-Endpunkt für Numok anlegen — Testmodus-Endpunkt geht sofort.
- **D-B2** Live-`STRIPE_WEBHOOK_SECRET` im AgentLeads-Backend setzen. **Heute nicht gesetzt** (503, verifiziert). Bis dahin verarbeitet AgentLeads *keine* Stripe-Events — auch nicht im Testmodus, solange kein Test-Secret gesetzt ist.
- **D-B3** Live-Preis-IDs für `stripe_price_pro` / `_agent` / `_procedure`.
- **D-B4** Erste echte Auszahlung an einen Partner (setzt E3 und E4 voraus).
- **D-B5** Öffentliche Bewerbung des Programms — ohne Live-Zahlung entstehen keine Provisionen, das Versprechen wäre unhaltbar.

Nicht blockiert und sofort machbar: A1–A5, B1–B5, C1–C6, D5 im Testmodus, E1–E5 als Entwurf.

### D5 · Abnahme — ein Testkauf, der die ganze Kette beweist

**Vorbedingungen:** Numok läuft unter `partner.…` mit Test-Keys; AgentLeads hat Test-`stripe_api_key`, Test-`stripe_webhook_secret` und Test-Preis-IDs; in Numok existieren ein Programm (`is_recurring = 1`, `reward_days = 0`, 20 % `percentage`, `cookie_days = 60`) und ein aktiver Testpartner mit `tracking_code = TESTPARTNER1`.

| # | Schritt | Handlung | Nachweis |
|---|---|---|---|
| 1 | Klick | `https://www.ausschreibungsagenten.de/?via=TESTPARTNER1` aufrufen, Einwilligung erteilen | **Vor** der Einwilligung: kein Cookie. Danach: `aa_partner=TESTPARTNER1` mit `Domain=.ausschreibungsagenten.de`, `Secure`, `SameSite=Lax` in den DevTools |
| 2 | Signup | Free-Signup auf der Website | `users.partner_tracking_code='TESTPARTNER1'` in AgentLeads |
| 3 | Checkout | einloggen, in `/app/billing` auf „pro" upgraden | Checkout-Session hat `metadata.numok_tracking_code='TESTPARTNER1'`, **`subscription_data.metadata` enthält den Schlüssel nicht**; Organisation trägt jetzt den Code |
| 4 | Conversion | Testkauf mit `4242 4242 4242 4242` abschließen | Numok: **genau eine** `conversions`-Zeile — `SELECT COUNT(*) … = 1`. `commission_amount` = 20 %, `status='payable'` (weil `reward_days=0`). Zusätzlich Log-Eintrag `subscription_metadata_updated` |
| 5 | AgentLeads | — | `subscriptions.status='active'`, `organizations.status='active'`, `stripe_webhook_events.processing_status='processed'` |
| 6 | Folgeprovision | in Stripe die Test-Subscription eine Rechnung vorziehen lassen | Numok: **zweite** `conversions`-Zeile aus `invoice.paid` (`createRecurringConversion`) |
| 7 | Idempotenz | denselben Event in Stripe erneut zustellen | Numok: keine dritte Zeile (UNIQUE `stripe_payment_id`); AgentLeads: Antwort `{"ok":true,"duplicate":true}` |
| 8 | Negativtest | zweiter Kauf **ohne** `?via=` | Numok: **keine** neue Conversion, Log-Eintrag `checkout_completed_no_tracking` |

Drei Schritte tragen die eigentliche Beweislast:

- **Schritt 4** ist als Zählung formuliert, nicht als „es gibt eine Zeile". Bei doppelter Erstprovision (B3a) entstehen zwei Zeilen, und eine Prüfung auf Vorhandensein wäre grün.
- **Schritt 6** beweist die Folgeprovision — und mit ihr, dass Numoks Restricted Key funktioniert.
- **Schritt 8** beweist, dass nicht jeder Umsatz einem Partner zugeschrieben wird.

---

### D6 · Die Steuerfalle: `amount_total` ist heute netto, morgen vielleicht brutto

Zugesagt sind **20 % vom Nettoumsatz**. Numok rechnet aber stur mit `$session->amount_total` (`WebhookController.php:115-116`) — und ob das ein Netto- oder ein Bruttobetrag ist, entscheidet allein die Stripe-Konfiguration.

**Heute passt es zufällig.** Im Backend ist weder `automatic_tax` noch `tax_rates` noch `tax_behavior` gesetzt (geprüft am 20.08.2026, kein einziger Treffer in `src/`). Stripe berechnet also keine Steuer, `amount_total` ist der reine Preis, und 20 % davon sind exakt die zugesagten 29,80 €.

**Sobald Steuer dazukommt, kippt es still.** Ein deutsches Unternehmen muss deutschen Kunden Umsatzsteuer berechnen. Spätestens beim Livegang wird also `automatic_tax` eingeschaltet oder ein Steuersatz hinterlegt. In dem Moment wird `amount_total` zum Bruttobetrag, und Numok zahlt 20 % von 177,31 € = **35,46 € statt 29,80 €** — ein Fünftel zu viel, ohne dass jemand etwas am Partnerprogramm geändert hätte. Es gibt keine Fehlermeldung; die Zahlen sind einfach falsch.

Drei Wege, wenn es soweit ist:

| Weg | Bewertung |
|---|---|
| **`commission_value` auf 16,807 setzen** | 16,807 % von brutto ≈ 20 % von netto. Kein Fork, aber undurchsichtig und nur bei genau einem Steuersatz richtig — bei Kunden im EU-Ausland mit Reverse Charge falsch. |
| **`calculateCommission()` patchen**, damit es aus `amount_subtotal` statt `amount_total` rechnet | Sauber und für alle Steuersätze richtig. Preis: ein Fork von Numok mit dauerhafter Wartungslast. **Empfehlung, wenn es mehr als eine Handvoll Partner werden.** |
| **Bezugsgröße auf brutto ändern** | Kein Code, aber die öffentliche Zusage auf `/partner` müsste geändert werden — nachträglich zulasten der Partner. Nur vor dem ersten Partner vertretbar. |

**Bis zur Entscheidung gilt:** Der Testmodus in Phase 4 muss ohne Steuer laufen, sonst prüft die Abnahme etwas anderes als die Produktion. Und wer in Stripe die Steuer einschaltet, muss zwingend zuerst hier nachsehen.

---

## 7. Fläche E — Recht und Kommunikation (deutscher Markt)

> Kein Rechtsrat. Das sind die Punkte, die geregelt sein müssen, mit dem konkreten technischen Bezug — die Formulierungen gehören zur anwaltlichen Prüfung.

### E1 · Datenschutzerklärung

`src/pages/Datenschutz.jsx` muss ergänzt werden. Konkret zu benennen ist, **was tatsächlich passiert**:

- **First-Party-Cookie `aa_partner`** auf `.ausschreibungsagenten.de`: Inhalt (Partnerkennung, ggf. Sub-IDs), Laufzeit (= `cookie_days`), Zweck (Zuordnung einer Anmeldung zu einem Vertriebspartner).
- **Einwilligung — entschieden (10.1):** das Cookie wird erst nach Einwilligung gesetzt (§ 25 TDDDG). **Eine Consent-Verwaltung existiert heute nicht**, und die Site setzt derzeit überhaupt kein Cookie (`grep document.cookie` über `src/` ist leer) — `aa_partner` wäre das erste. Sie muss also mitgebaut werden; Zuschnitt in Plan-Schritt 2.1a: ein zweckgebundener Hinweis, der nur bei vorhandenem `?via=` erscheint, statt eines site-weiten Banners.
- **Numoks `clicks`-Tabelle** (IP + User-Agent) nur nennen, **wenn** Offene Frage 4 mit „Relay" beantwortet wird. Bei der empfohlenen Variante bleibt sie leer und gehört nicht in die Erklärung.
- **Auftragsverarbeitung:** Numok läuft auf eigenem VPS unter eigener Kontrolle → kein AVV mit Dritten nötig, aber der Hoster braucht einen. Die Datenweitergabe an Stripe ist bereits geregelt und ändert sich nicht.
- **Löschfristen** aus C5 hier spiegeln.

### E2 · Teilnahmebedingungen für Partner

Numok hat dafür ein Feld: `programs.terms` (TEXT), und die Zustimmung wird in `partner_programs.terms_accepted` + `terms_accepted_ip` protokolliert (Migration `0002`). Das ist die richtige Ablage. Inhaltlich zu regeln:

- Provisionshöhe und -art: **20 % vom Nettoumsatz** (entschieden, 10.1). Die Tarifpreise sind Nettopreise — 149 € im Pro-Tarif ergeben 29,80 € Provision, 499 € im Agent-Tarif 99,80 €. Zuordnung 60 Tage, Sperrfrist 30 Tage. Die Bedingungen müssen wörtlich „20 % vom Nettoumsatz, also ohne Umsatzsteuer" sagen; „vom Umsatz" allein ist der klassische Streitfall. Siehe die Steuerfalle in 6.6 — sie entscheidet, ob Numoks Rechnung dazu passt.
- **Hinweis auf das Consent-Gate** (entschieden, 10.1): die Zuordnung setzt die Einwilligung des Besuchers voraus. Partner müssen wissen, dass nicht jeder Klick zuordenbar wird — sonst rechnen sie mit ihren eigenen Klickzahlen gegen eure Conversion-Zahlen.
- Wiederkehrend ja/nein (`is_recurring`) und für wie lange
- Sperrfrist bis zur Auszahlbarkeit (`reward_days` → `status='pending'` statt `'payable'`)
- Cookie-Laufzeit (`cookie_days`), Attributionsmodell: **First-Touch** (B4), und dass Bestandskunden nicht zugeschrieben werden
- Auszahlungsschwelle — **in Numok nicht abgebildet**, rein organisatorisch
- Verbotene Methoden: Brand-Bidding auf „ausschreibungsagenten", Gutschein-/Cashback-Spam, unaufgeforderte E-Mail-Werbung, Selbstzuschreibung eigener Käufe, Cookie-Stuffing
- Sanktion: `partner_programs.status='inactive'` bzw. `partners.status='suspended'`, Verfall offener Provisionen bei Verstoß
- Kündigung beidseitig, Umgang mit laufenden wiederkehrenden Provisionen danach

### E3 · Umsatzsteuer und Rechnungsstellung

Die Provision ist ein Entgelt für eine Vermittlungsleistung des Partners an euch. Zu klären, **bevor** die erste Auszahlung läuft:

- Gutschriftverfahren (§ 14 Abs. 2 S. 2 UStG) oder Rechnung durch den Partner? Bei Gutschrift müsst ihr das Dokument erzeugen — **Numok kann das nicht**, es hat weder Adresse noch Steuernummer des Partners.
- Kleinunternehmer (§ 19 UStG) vs. Regelbesteuerung → unterschiedliche Provisionsauszahlung bei gleichem Prozentsatz
- Partner im EU-Ausland → Reverse Charge, USt-IdNr. nötig
- Partner als Privatperson → in der Regel ausschließen; das gehört in E2

**Fehlende Felder in Numok** (`partners` hat nur `email`, `password`, `company_name`, `contact_name`, `status`, `payment_email`): Rechnungsanschrift, USt-IdNr./Steuernummer, Kleinunternehmer-Kennzeichen, IBAN, Rechtsform. Zwei Wege: eigene Migration `0005-add-partner-billing-fields.sql` (dann seid ihr vom Upstream weg), oder die Daten außerhalb erheben und in Numok nur die Provisionsrechnung führen. **Empfehlung: außerhalb erheben.** Die Auszahlung ist ohnehin manuell, und ein Fork von Numok für Stammdatenfelder ist Wartungslast ohne Gegenwert.

### E4 · Auszahlungsweg

Numok kennt nur `partners.payment_email` und `conversions.status`. Es gibt **keine `payouts`-Tabelle, keine Auszahlungsautomatik, keinen Zahlungsanbieter-Anschluss**. Der Ablauf ist damit zwangsläufig manuell:

1. In `/admin/conversions` nach `status='payable'` filtern (Export vorhanden: `admin/conversions/export`)
2. Je Partner summieren, gegen die Auszahlungsschwelle prüfen
3. Überweisen, Beleg nach E3 erzeugen
4. Zeilen auf `status='paid'` setzen (`admin/conversions/update-status`)

Das trägt bis in den zweistelligen Partnerbereich. Wichtig ist nur, dass niemand eine Automatik erwartet, die es nicht gibt.

### E5 · Kommunikation und Oberfläche

- **Numoks Oberfläche ist durchgehend englisch** — „Account not found", „Your account is pending approval", „Partner Login" (`PartnerAuthController.php:29-66`). Für ein deutsches Partnerprogramm ist das ein Bruch. Optionen: hinnehmen, die Views eindeutschen (Fork), oder die deutschsprachige Erklärung vollständig auf `/partner` legen und Numok nur als Werkzeug hinter dem Login führen. **Empfehlung: dritte Option** für Scheibe 1.
- **E-Mail:** Numok nutzt `resend/resend-php` (`composer.json`), ihr nutzt Resend bereits (`RESEND_API_KEY`, `RESEND_FROM` in `.env.example`). **Dieselbe verifizierte Domain wiederverwenden**, aber einen eigenen Absender (z. B. `partner@ausschreibungsagenten.de`) und einen eigenen API-Key — damit Zustellprobleme des Partnerprogramms nicht die Transaktionsmails des Produkts mitreißen.
- **Berichte an Partner als URL, nicht als PDF** — konsistent zur Haus-Regel für Lead-Funnel-Reports. Numoks Partner-Dashboard ist bereits eine URL; keine PDF-Abrechnungen per Mail bauen.

---

## 8. Numok — Fundstellen, die vor dem Livegang bewertet gehören

Beim Lesen gefunden, unabhängig von der Integration:

| # | Fund | Ort | Wirkung |
|---|---|---|---|
| N1 | `PartnerTrackingController` ist in `$routes` registriert, die **Klasse existiert nicht** | `public/index.php:41` | Partner-Menüpunkt `/tracking` → Fatal Error / 500 |
| N2 | Roher Stripe-Payload wird vor jeder Prüfung in `logs` geschrieben | `WebhookController.php:12-15` | unbegrenzt wachsende Tabelle mit Kunden-PII → C5 |
| N3 | `/api/tracking/click` ohne Auth, ohne Rate-Limit, `$data['tracking_code']` ohne `isset` | `TrackingController.php:74-86` | freie Schreiblast auf `clicks`, PHP-Warning bei leerem Body → C3 |
| N4 | `click()` sendet keine CORS-Header, `OPTIONS` nicht geroutet | `TrackingController.php` + `index.php` | Klick-Tracking aus dem Browser funktioniert nicht → Grund für 2.1 |
| N5 | `impression()` schreibt in Tabelle `impressions`, die im Schema **nicht existiert** | `TrackingController.php:135` | tote Methode; nicht geroutet, daher heute folgenlos |
| N6 | `TrackingController::script()` liest `$settings['app_url']` — Variable ist in der Methode nie definiert | `TrackingController.php:42` | leerer `NUMOK_BASE_URL`; nicht geroutet, daher folgenlos |
| N7 | `conversions.amount` ohne Währungsspalte | `0001-basic-schema.sql` | stillschweigend eine Währung; bei EUR-only unkritisch, aber festhalten |
| N10 | **Selbstregistrierung setzt sofort `active`** — `'status' => 'active'` in `PartnerAuthController::store()` überschreibt den Datenbank-Standard `pending` | `PartnerAuthController.php` | Zusammen mit `is_private = 0` kann sich jeder selbst einen Empfehlungscode holen. Entschärft über `is_private = 1`; siehe C3 |
| N9 | **`APP_DEBUG` lässt sich über die Umgebung nicht abschalten** — `getenv('APP_DEBUG') ?: true`; `"0"` ist in PHP falsy, der Ausdruck fällt auf `true` zurück. Es gibt **keinen** Wert, der Debug ausschaltet (auch `"false"` nicht, das ist eine nicht-leere Zeichenkette) | `config/config.example.php:25` | `public/index.php:122` wirft Ausnahmen weiter statt einer schlichten 500. Behoben durch eine korrigierte `config.php`, die schreibgeschützt in den Container gehängt wird — das Repo bleibt unverändert |
| N8 | **Kein Handler für Erstattungen oder Rückbuchungen** — verarbeitet werden ausschließlich `checkout.session.completed`, `payment_intent.succeeded`, `invoice.paid` | `WebhookController.php:33-45` | Eine Erstattung storniert die Provision **nicht automatisch**. Auffangmechanismus ist die Sperrfrist (`reward_days`) plus manuelles Setzen auf `rejected` in `/admin/conversions` vor der Auszahlung. Gehört in E2, damit die Zusage „bei Rückerstattung entfällt die Provision" gedeckt ist |

N1–N4 gehören adressiert (N3/N4 durch Sperre am Reverse Proxy, wenn wir Numoks Tracking nicht nutzen). N5–N7 nur dokumentieren. **N8 ist kein Fehler, sondern eine Lücke im Funktionsumfang** — sie wird organisatorisch geschlossen (Sperrfrist plus Sichtprüfung vor der Auszahlung), nicht durch Code.

---

## 9. Blockierte Punkte, gesammelt

| ID | Punkt | Blockiert durch |
|---|---|---|
| D-B1 | Live-Webhook-Endpunkt für Numok | Stripe-Live-Freischaltung |
| D-B2 | Live-`STRIPE_WEBHOOK_SECRET` in AgentLeads (heute 503) | Stripe-Live-Freischaltung |
| D-B3 | Live-Preis-IDs | Stripe-Live-Freischaltung |
| D-B4 | Erste Auszahlung an einen Partner | Stripe-Live + E3 + E4 |
| D-B5 | Öffentliche Bewerbung des Programms | D-B1…D-B4 |
| E-B1 | Veröffentlichung der Teilnahmebedingungen | anwaltliche Prüfung |
| E-B2 | Veröffentlichung der ergänzten Datenschutzerklärung | anwaltliche Prüfung |

Alles andere (A, B, C, D5 im Testmodus, E als Entwurf) ist sofort umsetzbar.

---

## 10. Entscheidungen und offene Fragen

### 10.1 Entschieden am 2026-08-19

| # | Frage | Entscheidung | Folge |
|---|---|---|---|
| 2 | Wo läuft Numok? | **Der Arbeitshost `vm21182`** (entschieden 20.08.2026, gegen meine Empfehlung; zuvor stand hier ein eigener neuer VPS) | Aufgesetzt unter `/opt/numok`, Port 8090. Weil der Einbruchsradius hier am größten ist, wurde enger gefasst als geplant: MySQL wird **gar nicht** veröffentlicht, die Anwendung hört nur auf `127.0.0.1`, Speichergrenzen begrenzen die Wirkung auf Nachbardienste, `/admin` liegt hinter einer IP-Allowlist, `/api/tracking` ist gesperrt. Betriebsdoku: `/opt/numok/README.md`. |
| 3 | Schutz für `/admin`? | **Ja, IP-Allowlist am nginx** | `/admin` und `/admin/*` nur von den Büro-/VPN-IPs. Der Schutz greift **vor** PHP. Das Rotieren des `admin123`-Seeds bleibt trotzdem Pflicht (Schritt 1.3) — Allowlist ersetzt kein Passwort. |
| 5 | Cookie einwilligungspflichtig? | **Ja, Consent-Gate einbauen** | A1 setzt das Cookie erst nach Einwilligung; bis dahin lebt der Code nur im Speicher. Senkt die Zuschreibungsquote spürbar — **das gehört in die Teilnahmebedingungen** (E2), sonst rechnen Partner mit Klickzahlen, die nie zu Conversions werden. |
| 6 | Provisionssatz und Bezugsgröße? | **20 % vom Nettoumsatz** (Stand 20.08.2026; zwischenzeitlich standen 25 % brutto und 25 % netto in dieser Zeile) | Die Tarifpreise sind Nettopreise. Kein Eingriff in `calculateCommission()` nötig, **solange Stripe keine Steuer berechnet** — siehe die Steuerfalle in 6.6. E2 muss „20 % vom Nettoumsatz, ohne Umsatzsteuer" sagen. |

### 10.2 Weiterhin offen — blockieren den Start nicht

| # | Frage | Warum sie die Umsetzung ändert |
|---|---|---|
| 1 | **Wo soll die Spec liegen?** Der Kopf der Anfrage kam abgeschnitten an. Vorläufig: `docs/` im Website-Repo. | Nur Ablageort. |
| 4 | **Klick-Statistik: gewünscht?** Ohne Numok-JS bleibt `clicks` leer. Optional: Server-zu-Server-Relay aus der Vercel-Function, dann bewusst ohne IP/UA. | Bestimmt, ob `/api/tracking` am Proxy gesperrt oder auf die Vercel-IPs freigegeben wird, und ob E1 einen Absatz zu IP-Speicherung braucht. Standard bis auf Widerruf: **gesperrt**. |
| 7 | **Welche Pläne sind provisionsfähig?** `pro`, `agent`, `procedure` (Einmalzahlung) — alle drei oder nur Abos? | Bestimmt, an welchen der drei Checkout-Einstiege in B3 der Code angehängt wird. Standard bis auf Widerruf: **alle drei**, mit der Einmalzahlungs-Vorsichtsregel aus B3a. |
