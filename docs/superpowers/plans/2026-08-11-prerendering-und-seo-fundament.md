# Prerendering und SEO-Fundament — Umsetzungsplan (Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Jede öffentliche Route von ausschreibungsagenten.de liefert ohne JavaScript eigenen HTML-Inhalt, eigenen Title und eigene Description.

**Architecture:** Nach dem regulären Client-Build erzeugt ein zweiter Vite-Build ein SSR-Bündel. Ein Node-Skript rendert damit jede öffentliche Route über `renderToString` mit `StaticRouter` und `HelmetProvider`, setzt das Ergebnis in die gebaute `index.html` ein und schreibt `dist/<pfad>/index.html`. Ein Routen-Manifest ist die gemeinsame Quelle für Routing, Prerendering, Meta-Daten und Sitemap. Ein Prüfskript bricht den Build ab, wenn eine Route leer oder ohne eigenen Title ausgeliefert würde.

**Tech Stack:** React 19.2.4, react-router-dom 7.18.1, react-helmet-async 3, Vite 7.3.1, Vitest 4, Vercel.

## Global Constraints

- Repo: `/home/admin/ausschreibungsagenten-site`, Branch `feat/seo-geo-architektur`. **Nicht** nach `master` mergen oder pushen — Vercel deployt aus `master` live.
- Keine neue Laufzeit-Abhängigkeit. `StaticRouter` (react-router-dom 7.18.1) und `react-helmet-async` sind bereits installiert.
- `vite-react-ssg` ist ausgeschlossen: Peer hängt bei `react-router-dom ^6.14.1`, das Projekt läuft auf 7.18.1.
- Alle Texte, Kommentare und Commit-Nachrichten auf Deutsch. Commit-Nachrichten ohne Umlaute.
- Bestehende Vitest-Suite muss grün bleiben: `npm test`.
- Nur öffentliche Inhaltsseiten werden vorgerendert. Login-, Handoff- und Weiterleitungsrouten (`/login`, `/login/postfach`, `/login/abgelaufen`, `/anmeldung-bestaetigen`, `/konto`, `/abrechnung`, `/checkout-erfolg`) bleiben reine Client-Routen und bekommen `noindex`.
- Kanonische Domain ist `https://www.ausschreibungsagenten.de` (mit `www`).

---

### Task 1: Routen-Manifest als gemeinsame Quelle

Heute steht die Routenliste nur in `src/App.jsx`, die Sitemap wird von Hand gepflegt und listet acht URLs. Ohne eine gemeinsame Quelle laufen Routing, Prerendering und Sitemap auseinander.

**Files:**
- Create: `src/routes.js`
- Modify: `src/App.jsx`
- Test: `src/routes.test.js`

**Interfaces:**
- Consumes: nichts
- Produces: `routes` — Array von `{ path: string, component: string, title: string, description: string, prerender: boolean, index: boolean }`. `component` ist der Schlüssel in der Komponenten-Zuordnung in `App.jsx`. Alle folgenden Tasks lesen `routes` aus `src/routes.js`; das ist bewusst reines JavaScript ohne JSX, damit Node-Skripte es direkt importieren können.

- [ ] **Step 1: Test schreiben, der Manifest und App-Routing gegeneinander prüft**

```js
// src/routes.test.js
import { describe, expect, it } from 'vitest'
import { routes } from './routes'
import { pages } from './App'

describe('Routen-Manifest', () => {
    it('hat zu jedem Eintrag eine Komponente', () => {
        for (const route of routes) {
            expect(pages[route.component], `Komponente fehlt fuer ${route.path}`).toBeDefined()
        }
    })

    it('nutzt jede Komponente aus der Zuordnung', () => {
        const benutzt = new Set(routes.map((r) => r.component))
        for (const name of Object.keys(pages)) {
            expect(benutzt.has(name), `Komponente ${name} ist in keiner Route`).toBe(true)
        }
    })

    it('gibt jeder vorgerenderten Route eigenen Title und eigene Description', () => {
        const vorgerendert = routes.filter((r) => r.prerender)
        expect(vorgerendert.length).toBeGreaterThan(1)
        const titel = vorgerendert.map((r) => r.title)
        expect(new Set(titel).size, 'Titles sind nicht eindeutig').toBe(titel.length)
        for (const route of vorgerendert) {
            expect(route.description.length).toBeGreaterThan(50)
        }
    })

    it('rendert keine Konto- oder Login-Route vor und indexiert sie nicht', () => {
        const geschuetzt = ['/login', '/login/postfach', '/login/abgelaufen', '/anmeldung-bestaetigen', '/konto', '/abrechnung', '/checkout-erfolg']
        for (const pfad of geschuetzt) {
            const route = routes.find((r) => r.path === pfad)
            expect(route, `Route ${pfad} fehlt im Manifest`).toBeDefined()
            expect(route.prerender).toBe(false)
            expect(route.index).toBe(false)
        }
    })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/routes.test.js`
Expected: FAIL, `Failed to resolve import "./routes"`

- [ ] **Step 3: Manifest anlegen**

```js
// src/routes.js
// Gemeinsame Quelle fuer Routing, Prerendering, Meta-Daten und Sitemap.
// Bewusst reines JavaScript ohne JSX, damit die Build-Skripte es direkt
// importieren koennen.

export const SITE_ORIGIN = 'https://www.ausschreibungsagenten.de'

export const routes = [
    {
        path: '/',
        component: 'LandingPage',
        title: 'Ausschreibungsagenten.de – KI-Agenten für öffentliche Ausschreibungen',
        description:
            'Öffentliche Ausschreibungen aus 17 Live-Quellen finden und nachvollziehbar filtern: TED, oeffentlichevergabe.de, service.bund.de, DTVP, RIB und die Landesportale.',
        prerender: true,
        index: true,
    },
    {
        path: '/ueber-uns',
        component: 'UeberUns',
        title: 'Über uns – die Menschen hinter den Ausschreibungsagenten',
        description:
            'Wer hinter Ausschreibungsagenten.de steht: Team, Haltung und warum Entscheidungen über Ausschreibungen nachvollziehbar bleiben müssen.',
        prerender: true,
        index: true,
    },
    {
        path: '/entwickler',
        component: 'Entwickler',
        title: 'Entwickler – Agent API, A2A und MCP für Ausschreibungsdaten',
        description:
            'Schnittstellen für Entwickler: Agent API, A2A Agent Card und MCP-Anbindung an die Ausschreibungssuche über 17 Quellen.',
        prerender: true,
        index: true,
    },
    {
        path: '/status',
        component: 'Status',
        title: 'Systemstatus – Datenstand aller 17 Ausschreibungsquellen',
        description:
            'Live-Status jeder angebundenen Quelle mit letztem erfolgreichem Abruf: TED, oeffentlichevergabe.de, service.bund.de, DTVP, RIB und die Landesportale.',
        prerender: true,
        index: true,
    },
    {
        path: '/impressum',
        component: 'Impressum',
        title: 'Impressum – Yawusa UG (haftungsbeschränkt) i.G.',
        description:
            'Anbieterkennzeichnung nach § 5 DDG für Ausschreibungsagenten.de, betrieben von der Yawusa UG (haftungsbeschränkt) i.G. in Berlin.',
        prerender: true,
        index: true,
    },
    {
        path: '/agb',
        component: 'AGB',
        title: 'Allgemeine Geschäftsbedingungen',
        description:
            'Die Geschäftsbedingungen für die Nutzung von Ausschreibungsagenten.de: Leistungsumfang, Laufzeit, Vergütung und Pflichten beider Seiten.',
        prerender: true,
        index: true,
    },
    {
        path: '/datenschutz',
        component: 'Datenschutz',
        title: 'Datenschutzerklärung',
        description:
            'Welche Daten Ausschreibungsagenten.de verarbeitet, auf welcher Rechtsgrundlage, wie lange sie gespeichert werden und welche Rechte Ihnen zustehen.',
        prerender: true,
        index: true,
    },
    {
        path: '/disclaimer',
        component: 'Disclaimer',
        title: 'Haftungsausschluss',
        description:
            'Grenzen der Angaben auf Ausschreibungsagenten.de: Bekanntmachungsdaten stammen aus fremden Quellen und ersetzen keine Rechtsberatung.',
        prerender: true,
        index: true,
    },
    { path: '/checkout-erfolg', component: 'CheckoutSuccess', title: 'Zahlung abgeschlossen', description: 'Bestätigung nach abgeschlossener Zahlung.', prerender: false, index: false },
    { path: '/login', component: 'Login', title: 'Anmelden', description: 'Anmeldung über einen geschützten Magic-Link.', prerender: false, index: false },
    { path: '/login/postfach', component: 'CheckEmail', title: 'Postfach prüfen', description: 'Hinweis auf die versendete Anmelde-E-Mail.', prerender: false, index: false },
    { path: '/login/abgelaufen', component: 'MagicHandoffExpired', title: 'Link abgelaufen', description: 'Der Anmeldelink ist abgelaufen.', prerender: false, index: false },
    { path: '/anmeldung-bestaetigen', component: 'MagicHandoff', title: 'Anmeldung bestätigen', description: 'Übergabe der Anmeldung an den geschützten Bereich.', prerender: false, index: false },
    { path: '/konto', component: 'KontoRedirect', title: 'Kundenkonto öffnen', description: 'Weiterleitung in den geschützten Bereich.', prerender: false, index: false },
    { path: '/abrechnung', component: 'AbrechnungRedirect', title: 'Abrechnung öffnen', description: 'Weiterleitung zur Abrechnung im geschützten Bereich.', prerender: false, index: false },
]

export const prerenderRoutes = routes.filter((route) => route.prerender)
export const indexableRoutes = routes.filter((route) => route.index)

export function routeByPath(path) {
    return routes.find((route) => route.path === path)
}
```

- [ ] **Step 4: `App.jsx` auf das Manifest umstellen**

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import Impressum from './pages/Impressum'
import AGB from './pages/AGB'
import Datenschutz from './pages/Datenschutz'
import Disclaimer from './pages/Disclaimer'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Login from './pages/Login'
import CheckEmail from './pages/CheckEmail'
import MagicHandoff from './pages/MagicHandoff'
import AppRedirect from './pages/AppRedirect'
import UeberUns from './pages/UeberUns'
import Entwickler from './pages/Entwickler'
import Status from './pages/Status'
import { routes } from './routes'

// Zuordnung Manifest-Schluessel auf Komponente. Der Test in routes.test.js
// haelt beide Seiten deckungsgleich.
export const pages = {
    LandingPage: <LandingPage />,
    UeberUns: <UeberUns />,
    Entwickler: <Entwickler />,
    Status: <Status />,
    Impressum: <Impressum />,
    AGB: <AGB />,
    Datenschutz: <Datenschutz />,
    Disclaimer: <Disclaimer />,
    CheckoutSuccess: <CheckoutSuccess />,
    Login: <Login />,
    CheckEmail: <CheckEmail />,
    MagicHandoffExpired: <MagicHandoff expired />,
    MagicHandoff: <MagicHandoff />,
    KontoRedirect: <AppRedirect path="/app" title="Kundenkonto öffnen" />,
    AbrechnungRedirect: <AppRedirect path="/app/billing" title="Abrechnung öffnen" />,
}

export default function App() {
    return (
        <>
            <Header />
            <main>
                <Routes>
                    {routes.map((route) => (
                        <Route key={route.path} path={route.path} element={pages[route.component]} />
                    ))}
                </Routes>
            </main>
            <Footer />
        </>
    )
}
```

- [ ] **Step 5: Tests laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && npm test`
Expected: PASS, alle bestehenden Tests plus `src/routes.test.js`

- [ ] **Step 6: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add src/routes.js src/routes.test.js src/App.jsx
git commit -m "feat(seo): Routen-Manifest als gemeinsame Quelle fuer Routing und Meta-Daten"
```

---

### Task 2: SSR-Bündel und Prerender-Skript

**Files:**
- Create: `src/entry-server.jsx`
- Create: `scripts/prerender.mjs`
- Modify: `package.json` (Skripte `build:client`, `build:server`, `build`)
- Modify: `index.html` (Marker für den Kopfbereich)
- Test: `src/entryServer.test.jsx`

**Interfaces:**
- Consumes: `routes`, `prerenderRoutes` aus `src/routes.js` (Task 1)
- Produces: `render(url)` aus `src/entry-server.jsx`, liefert `{ html: string, head: string }`. `html` ist der Rumpf für `<div id="root">`, `head` sind die von Helmet erzeugten Kopf-Tags als String.

- [ ] **Step 1: Test für den Server-Renderer schreiben**

```jsx
// src/entryServer.test.jsx
import { describe, expect, it } from 'vitest'
import { render } from './entry-server'

describe('Server-Renderer', () => {
    it('liefert sichtbaren Text fuer die Startseite', async () => {
        const { html } = await render('/')
        expect(html.length).toBeGreaterThan(1000)
        expect(html).toContain('Ausschreibung')
    })

    it('liefert fuer die Ueber-uns-Seite anderen Inhalt als fuer die Startseite', async () => {
        const start = await render('/')
        const ueberUns = await render('/ueber-uns')
        expect(ueberUns.html).not.toEqual(start.html)
        expect(ueberUns.html).toContain('Gorden Wübbe')
    })

    it('liefert Kopf-Tags mit Titel', async () => {
        const { head } = await render('/ueber-uns')
        expect(head).toContain('<title')
        expect(head).toContain('Über uns')
    })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/entryServer.test.jsx`
Expected: FAIL, `Failed to resolve import "./entry-server"`

- [ ] **Step 3: Server-Einstiegspunkt schreiben**

```jsx
// src/entry-server.jsx
// Rendert eine Route ohne Browser. Aufgerufen vom Prerender-Skript nach
// dem Vite-Build und von den Tests.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { routeByPath, SITE_ORIGIN } from './routes'

export async function render(url) {
    const helmetContext = {}
    const html = renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={url}>
                <App />
            </StaticRouter>
        </HelmetProvider>,
    )

    const route = routeByPath(url)
    const { helmet } = helmetContext
    const teile = [
        helmet?.title?.toString() ?? '',
        helmet?.meta?.toString() ?? '',
        helmet?.link?.toString() ?? '',
        helmet?.script?.toString() ?? '',
    ]

    // Kanonische Adresse und Indexierbarkeit stehen im Manifest und werden
    // hier ergaenzt, damit keine Seite sie vergessen kann.
    if (route) {
        teile.push(`<link rel="canonical" href="${SITE_ORIGIN}${route.path === '/' ? '/' : route.path}" />`)
        if (!route.index) teile.push('<meta name="robots" content="noindex, follow" />')
    }

    return { html, head: teile.filter(Boolean).join('\n    ') }
}
```

- [ ] **Step 4: Test laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/entryServer.test.jsx`
Expected: PASS

- [ ] **Step 5: Marker in `index.html` setzen**

Ersetze im `<head>` von `index.html` die drei statischen Zeilen für `<title>`, `<meta name="description">` und `<link rel="canonical">` durch einen Marker. Die restlichen Kopf-Angaben (Favicons, Open Graph, JSON-LD) bleiben unverändert stehen.

```html
    <!-- Titel, Description und Canonical setzt der Prerender-Schritt je Route.
         Im Entwicklungsmodus setzt sie react-helmet-async im Browser. -->
    <title>Ausschreibungsagenten.de – KI-Agenten für öffentliche Ausschreibungen</title>
    <!--ssg-head-->
```

- [ ] **Step 6: Prerender-Skript schreiben**

```js
// scripts/prerender.mjs
// Schreibt fuer jede vorgerenderte Route eine eigene index.html mit
// echtem Inhalt. Laeuft nach dem Client- und dem Server-Build.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const distVerzeichnis = join(wurzel, 'dist')

const { render } = await import(join(distVerzeichnis, 'server', 'entry-server.js'))
const { prerenderRoutes } = await import(join(wurzel, 'src', 'routes.js'))

const vorlage = await readFile(join(distVerzeichnis, 'index.html'), 'utf8')
if (!vorlage.includes('<!--ssg-head-->')) {
    throw new Error('Marker <!--ssg-head--> fehlt in dist/index.html')
}

for (const route of prerenderRoutes) {
    const { html, head } = await render(route.path)

    const seite = vorlage
        .replace(/<title>[\s\S]*?<\/title>/, '')
        .replace('<!--ssg-head-->', head)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

    const zielVerzeichnis = route.path === '/' ? distVerzeichnis : join(distVerzeichnis, route.path)
    await mkdir(zielVerzeichnis, { recursive: true })
    await writeFile(join(zielVerzeichnis, 'index.html'), seite, 'utf8')
    console.log(`vorgerendert: ${route.path}`)
}

console.log(`${prerenderRoutes.length} Routen vorgerendert.`)
```

- [ ] **Step 7: Build-Kette in `package.json` eintragen**

```json
  "scripts": {
    "dev": "vite",
    "build:client": "vite build",
    "build:server": "vite build --ssr src/entry-server.jsx --outDir dist/server",
    "build": "npm run build:client && npm run build:server && node scripts/prerender.mjs",
    "preview": "vite preview",
    "test": "vitest run"
  },
```

- [ ] **Step 8: Build laufen lassen und Ergebnis prüfen**

Run:
```bash
cd /home/admin/ausschreibungsagenten-site && npm run build
grep -c "Gorden" dist/ueber-uns/index.html
grep -o "<title>[^<]*</title>" dist/ueber-uns/index.html dist/index.html
```
Expected: Build läuft durch, `dist/ueber-uns/index.html` enthält den Namen, und beide Dateien zeigen **unterschiedliche** Titles.

- [ ] **Step 9: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add src/entry-server.jsx src/entryServer.test.jsx scripts/prerender.mjs package.json index.html
git commit -m "feat(seo): Routen beim Build zu statischem HTML vorrendern"
```

---

### Task 3: Build bricht ab, wenn eine Route leer bleibt

Ohne diese Absicherung fällt eine kaputte Route erst in der Search Console auf — Wochen später.

**Files:**
- Create: `scripts/check-prerender.mjs`
- Modify: `package.json` (`build` erweitern)

**Interfaces:**
- Consumes: `prerenderRoutes` aus `src/routes.js`, die von `scripts/prerender.mjs` geschriebenen Dateien
- Produces: Exit-Code 1 bei Verstoß

- [ ] **Step 1: Prüfskript schreiben**

```js
// scripts/check-prerender.mjs
// Bricht den Build ab, wenn eine Route ohne eigenen Titel oder ohne
// sichtbaren Text ausgeliefert wuerde. Genau dieser Zustand war der
// Ausgangspunkt: alle Routen lieferten dasselbe leere Geruest.
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const { prerenderRoutes } = await import(join(wurzel, 'src', 'routes.js'))

// Die Pruefung waechst mit den Zusagen: hier nur Vorhandensein und
// Textinhalt. Eindeutige Titel und Descriptions kommen in Task 4 dazu,
// weil erst dort jede Seite eigene Meta-Daten bekommt.
const MINDEST_TEXTLAENGE = 500
const fehler = []

for (const route of prerenderRoutes) {
    const pfad = join(wurzel, 'dist', route.path === '/' ? '' : route.path, 'index.html')
    let inhalt
    try {
        inhalt = await readFile(pfad, 'utf8')
    } catch {
        fehler.push(`${route.path}: Datei fehlt (${pfad})`)
        continue
    }

    const rumpf = inhalt.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/)?.[1] ?? ''
    const text = rumpf.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (text.length < MINDEST_TEXTLAENGE) {
        fehler.push(`${route.path}: nur ${text.length} Zeichen sichtbarer Text (mindestens ${MINDEST_TEXTLAENGE})`)
    }
}

if (fehler.length) {
    console.error('Prerender-Pruefung fehlgeschlagen:')
    for (const zeile of fehler) console.error(`  - ${zeile}`)
    process.exit(1)
}

console.log(`Prerender-Pruefung bestanden: ${prerenderRoutes.length} Routen mit Textinhalt.`)
```

- [ ] **Step 2: Skript gegen den bestehenden Build laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && node scripts/check-prerender.mjs`
Expected: PASS mit Zeilenausgabe je Route. Schlägt es fehl, ist Task 2 unvollständig — dort beheben, nicht die Schwelle senken.

- [ ] **Step 3: Absichtlich brechen, um die Prüfung zu prüfen**

Run:
```bash
cd /home/admin/ausschreibungsagenten-site
cp dist/index.html /tmp/start-backup.html
printf '<html><head><title>x</title></head><body><div id="root"></div><script></script></body></html>' > dist/index.html
node scripts/check-prerender.mjs; echo "Exit-Code: $?"
cp /tmp/start-backup.html dist/index.html
```
Expected: Ausgabe meldet zu wenig sichtbaren Text für `/`, Exit-Code 1.

- [ ] **Step 4: In die Build-Kette einhängen**

```json
    "build": "npm run build:client && npm run build:server && node scripts/prerender.mjs && node scripts/check-prerender.mjs",
```

- [ ] **Step 5: Vollständigen Build laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && npm run build`
Expected: Build endet mit „Prerender-Pruefung bestanden"

- [ ] **Step 6: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add scripts/check-prerender.mjs package.json
git commit -m "feat(seo): Build bricht ab, wenn eine Route ohne Titel oder Text ausgeliefert wuerde"
```

---

### Task 4: Meta-Daten je Seite aus dem Manifest

Heute setzen nur `Impressum`, `UeberUns` und `AppRedirect` einen eigenen Title. Die übrigen Seiten erben den der Startseite.

**Files:**
- Create: `src/components/Seo.jsx`
- Modify: `src/pages/LandingPage.jsx`, `src/pages/Entwickler.jsx`, `src/pages/Status.jsx`, `src/pages/AGB.jsx`, `src/pages/Datenschutz.jsx`, `src/pages/Disclaimer.jsx`, `src/pages/Impressum.jsx`, `src/pages/UeberUns.jsx`
- Test: `src/seo.test.jsx`

**Interfaces:**
- Consumes: `routeByPath`, `SITE_ORIGIN` aus `src/routes.js`
- Produces: `<Seo path="/pfad" />` — setzt Title, Description und Open-Graph-Angaben aus dem Manifest. Optionales Attribut `title` überschreibt den Manifest-Titel.

- [ ] **Step 1: Test schreiben**

```jsx
// src/seo.test.jsx
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import Seo from './components/Seo'

function kopfDaten(pfad) {
    const context = {}
    render(
        <HelmetProvider context={context}>
            <Seo path={pfad} />
        </HelmetProvider>,
    )
    return context.helmet
}

describe('Seo-Komponente', () => {
    it('setzt Titel und Description aus dem Manifest', () => {
        const helmet = kopfDaten('/entwickler')
        expect(helmet.title.toString()).toContain('Entwickler')
        expect(helmet.meta.toString()).toContain('Agent API')
    })

    it('setzt Open-Graph-Angaben', () => {
        const helmet = kopfDaten('/agb')
        const meta = helmet.meta.toString()
        expect(meta).toContain('og:title')
        expect(meta).toContain('og:url')
    })

    it('wirft bei unbekanntem Pfad', () => {
        expect(() => kopfDaten('/gibt-es-nicht')).toThrow(/gibt-es-nicht/)
    })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/seo.test.jsx`
Expected: FAIL, `Failed to resolve import "./components/Seo"`

- [ ] **Step 3: Komponente schreiben**

```jsx
// src/components/Seo.jsx
import { Helmet } from 'react-helmet-async'
import { routeByPath, SITE_ORIGIN } from '../routes'

export default function Seo({ path, title, description }) {
    const route = routeByPath(path)
    if (!route) throw new Error(`Kein Manifest-Eintrag fuer ${path}`)

    const seitenTitel = title ?? route.title
    const seitenText = description ?? route.description
    const adresse = `${SITE_ORIGIN}${route.path}`

    return (
        <Helmet>
            <title>{seitenTitel}</title>
            <meta name="description" content={seitenText} />
            <meta property="og:title" content={seitenTitel} />
            <meta property="og:description" content={seitenText} />
            <meta property="og:url" content={adresse} />
            <meta property="og:type" content="website" />
        </Helmet>
    )
}
```

- [ ] **Step 4: Test laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/seo.test.jsx`
Expected: PASS

- [ ] **Step 5: `<Seo>` in jede vorgerenderte Seite einsetzen**

In jeder der acht Dateien aus **Files** als erstes Element im zurückgegebenen Baum einfügen und einen eventuell vorhandenen eigenen `<Helmet>`-Block mit Title/Description entfernen. Beispiel für `src/pages/Entwickler.jsx`:

```jsx
import Seo from '../components/Seo'

export default function Entwickler() {
    return (
        <>
            <Seo path="/entwickler" />
            {/* bisheriger Inhalt unveraendert */}
        </>
    )
}
```

- [ ] **Step 6: Prüfskript um eindeutige Titel und Descriptions erweitern**

Ab jetzt hat jede Seite eigene Meta-Daten, also darf der Wächter das auch verlangen. In `scripts/check-prerender.mjs` oberhalb der Schleife ergänzen:

```js
const gesehenerTitel = new Map()
```

und innerhalb der Schleife, direkt nach dem erfolgreichen `readFile`:

```js
    const titel = inhalt.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim()
    if (!titel) {
        fehler.push(`${route.path}: kein <title>`)
    } else if (gesehenerTitel.has(titel)) {
        fehler.push(`${route.path}: gleicher <title> wie ${gesehenerTitel.get(titel)}`)
    } else {
        gesehenerTitel.set(titel, route.path)
    }

    if (!/<meta name="description"/.test(inhalt)) {
        fehler.push(`${route.path}: keine Description`)
    }
```

Den Kommentar oberhalb von `MINDEST_TEXTLAENGE` entsprechend anpassen und die Schlusszeile auf `Routen mit eigenem Titel und Textinhalt` zurückstellen.

- [ ] **Step 7: Tests und Build laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && npm test && npm run build`
Expected: Alle Tests grün, Prerender-Prüfung bestanden — sie erzwingt jetzt acht verschiedene Titles. Meldet sie doppelte Titel, fehlt auf einer Seite noch der `<Seo>`-Aufruf aus Step 5.

- [ ] **Step 8: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add src/components/Seo.jsx src/seo.test.jsx src/pages scripts/check-prerender.mjs
git commit -m "feat(seo): eigener Titel und eigene Description je Seite"
```

---

### Task 5: Sitemap aus dem Manifest erzeugen

**Files:**
- Create: `scripts/sitemap.mjs`
- Delete: `public/sitemap.xml`
- Modify: `package.json` (`build` erweitern)

**Interfaces:**
- Consumes: `indexableRoutes`, `SITE_ORIGIN` aus `src/routes.js`
- Produces: `dist/sitemap.xml`

- [ ] **Step 1: Skript schreiben**

```js
// scripts/sitemap.mjs
// Erzeugt die Sitemap aus dem Routen-Manifest. Vorher war sie von Hand
// gepflegt und lief mit dem Routing auseinander.
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const { indexableRoutes, SITE_ORIGIN } = await import(join(wurzel, 'src', 'routes.js'))

const eintraege = indexableRoutes
    .map((route) => `  <url><loc>${SITE_ORIGIN}${route.path}</loc></url>`)
    .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${eintraege}
</urlset>
`

await writeFile(join(wurzel, 'dist', 'sitemap.xml'), xml, 'utf8')
console.log(`Sitemap mit ${indexableRoutes.length} Adressen geschrieben.`)
```

- [ ] **Step 2: Handgepflegte Sitemap entfernen und Build erweitern**

```bash
cd /home/admin/ausschreibungsagenten-site && git rm public/sitemap.xml
```

```json
    "build": "npm run build:client && npm run build:server && node scripts/prerender.mjs && node scripts/sitemap.mjs && node scripts/check-prerender.mjs",
```

- [ ] **Step 3: Build laufen lassen und Sitemap prüfen**

Run:
```bash
cd /home/admin/ausschreibungsagenten-site && npm run build && cat dist/sitemap.xml
```
Expected: Acht indexierbare Adressen, **keine** Login-, Konto- oder Abrechnungsadresse.

- [ ] **Step 4: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add scripts/sitemap.mjs package.json public/sitemap.xml
git commit -m "feat(seo): Sitemap aus dem Routen-Manifest erzeugen"
```

---

### Task 6: Strukturierte Daten je Seite

`index.html` trägt heute einen festen JSON-LD-Block mit einer Brotkrumenspur, die nur die Startseite kennt. Er wird durch eine Komponente ersetzt, die je Seite passende Angaben erzeugt.

**Files:**
- Create: `src/components/StrukturierteDaten.jsx`
- Modify: `src/components/Seo.jsx`
- Test: `src/strukturierteDaten.test.jsx`

**Interfaces:**
- Consumes: `routeByPath`, `SITE_ORIGIN` aus `src/routes.js`
- Produces: `<StrukturierteDaten path="..." faq={[{ frage, antwort }]} />`; wird von `<Seo>` mitgerendert, sodass jede Seite sie automatisch erhält.

- [ ] **Step 1: Test schreiben**

```jsx
// src/strukturierteDaten.test.jsx
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import StrukturierteDaten from './components/StrukturierteDaten'

function jsonLd(pfad, faq) {
    const context = {}
    render(
        <HelmetProvider context={context}>
            <StrukturierteDaten path={pfad} faq={faq} />
        </HelmetProvider>,
    )
    const roh = context.helmet.script.toString()
    return JSON.parse(roh.replace(/^[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, ''))
}

describe('Strukturierte Daten', () => {
    it('nennt die Brotkrumenspur der jeweiligen Seite', () => {
        const daten = jsonLd('/ueber-uns')
        const spur = daten['@graph'].find((k) => k['@type'] === 'BreadcrumbList')
        expect(spur.itemListElement).toHaveLength(2)
        expect(spur.itemListElement[1].item).toContain('/ueber-uns')
    })

    it('laesst die Brotkrumenspur der Startseite einstufig', () => {
        const daten = jsonLd('/')
        const spur = daten['@graph'].find((k) => k['@type'] === 'BreadcrumbList')
        expect(spur.itemListElement).toHaveLength(1)
    })

    it('ergaenzt eine FAQ, wenn Fragen uebergeben werden', () => {
        const daten = jsonLd('/', [{ frage: 'Was kostet es?', antwort: 'Pro kostet 149 Euro pro Monat.' }])
        const faq = daten['@graph'].find((k) => k['@type'] === 'FAQPage')
        expect(faq.mainEntity[0].name).toBe('Was kostet es?')
        expect(faq.mainEntity[0].acceptedAnswer.text).toContain('149')
    })

    it('laesst die FAQ weg, wenn keine Fragen uebergeben werden', () => {
        const daten = jsonLd('/agb')
        expect(daten['@graph'].some((k) => k['@type'] === 'FAQPage')).toBe(false)
    })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/strukturierteDaten.test.jsx`
Expected: FAIL, `Failed to resolve import "./components/StrukturierteDaten"`

- [ ] **Step 3: Komponente schreiben**

```jsx
// src/components/StrukturierteDaten.jsx
import { Helmet } from 'react-helmet-async'
import { routeByPath, SITE_ORIGIN } from '../routes'

const ORGANISATION = {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organisation`,
    name: 'Ausschreibungsagenten.de',
    legalName: 'Yawusa UG (haftungsbeschränkt) i.G.',
    url: `${SITE_ORIGIN}/`,
    email: 'hi@ausschreibungsagenten.de',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Schliemannstraße 23',
        postalCode: '10437',
        addressLocality: 'Berlin',
        addressCountry: 'DE',
    },
}

export default function StrukturierteDaten({ path, faq }) {
    const route = routeByPath(path)
    if (!route) throw new Error(`Kein Manifest-Eintrag fuer ${path}`)

    const spur = [{ '@type': 'ListItem', position: 1, name: 'Start', item: `${SITE_ORIGIN}/` }]
    if (route.path !== '/') {
        spur.push({ '@type': 'ListItem', position: 2, name: route.title, item: `${SITE_ORIGIN}${route.path}` })
    }

    const graph = [
        ORGANISATION,
        { '@type': 'BreadcrumbList', itemListElement: spur },
        {
            '@type': 'WebPage',
            '@id': `${SITE_ORIGIN}${route.path}#seite`,
            url: `${SITE_ORIGIN}${route.path}`,
            name: route.title,
            description: route.description,
            isPartOf: { '@id': `${SITE_ORIGIN}/#organisation` },
        },
    ]

    if (faq?.length) {
        graph.push({
            '@type': 'FAQPage',
            mainEntity: faq.map((eintrag) => ({
                '@type': 'Question',
                name: eintrag.frage,
                acceptedAnswer: { '@type': 'Answer', text: eintrag.antwort },
            })),
        })
    }

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}
            </script>
        </Helmet>
    )
}
```

- [ ] **Step 4: In `Seo.jsx` einhängen**

```jsx
// src/components/Seo.jsx — Rueckgabe erweitern
import StrukturierteDaten from './StrukturierteDaten'

// ... innerhalb der Komponente, statt eines einzelnen <Helmet>:
    return (
        <>
            <Helmet>
                <title>{seitenTitel}</title>
                <meta name="description" content={seitenText} />
                <meta property="og:title" content={seitenTitel} />
                <meta property="og:description" content={seitenText} />
                <meta property="og:url" content={adresse} />
                <meta property="og:type" content="website" />
            </Helmet>
            <StrukturierteDaten path={path} faq={faq} />
        </>
    )
```

Die Signatur wird zu `Seo({ path, title, description, faq })`.

- [ ] **Step 5: Festen JSON-LD-Block aus `index.html` entfernen**

Den kompletten `<script type="application/ld+json">`-Block aus `index.html` löschen. Er beschreibt eine einstufige Brotkrumenspur, die auf jeder Unterseite falsch wäre.

- [ ] **Step 6: Tests und Build laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && npm test && npm run build`
Expected: Alle Tests grün, Build bestanden

- [ ] **Step 7: Erzeugtes JSON-LD stichprobenartig prüfen**

Run: `cd /home/admin/ausschreibungsagenten-site && grep -o '"@type":"BreadcrumbList"[^]]*]' dist/ueber-uns/index.html | head -c 400`
Expected: Zweistufige Spur mit `/ueber-uns`

- [ ] **Step 8: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add src/components/StrukturierteDaten.jsx src/strukturierteDaten.test.jsx src/components/Seo.jsx index.html
git commit -m "feat(seo): strukturierte Daten je Seite statt festem Block in der index.html"
```

---

### Task 7: Video-Abschnitt mit Transkript

Das Video liegt noch nicht vor, ein zweites folgt. Die Komponente wird deshalb quellenunabhängig gebaut und mit Platzhalterdaten getestet; eingebunden wird sie, sobald die Datei da ist.

**Files:**
- Create: `src/components/VideoAbschnitt.jsx`
- Modify: `vercel.json` (nur falls YouTube gewählt wird, siehe Step 5)
- Test: `src/videoAbschnitt.test.jsx`

**Interfaces:**
- Consumes: nichts aus vorherigen Tasks
- Produces: `<VideoAbschnitt titel quelle transkript />` mit `quelle` als `{ art: 'datei', url }` oder `{ art: 'youtube', id }` und `transkript` als Array von `{ zeit, text }`.

- [ ] **Step 1: Test schreiben**

```jsx
// src/videoAbschnitt.test.jsx
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import VideoAbschnitt from './components/VideoAbschnitt'

const TRANSKRIPT = [
    { zeit: '00:00', text: 'Öffentliche Ausschreibungen verteilen sich auf viele Portale.' },
    { zeit: '00:18', text: 'Der Agent prüft sie täglich und nennt zu jedem Treffer den Grund.' },
]

function zeige(quelle) {
    return render(
        <HelmetProvider>
            <VideoAbschnitt titel="So arbeitet der Agent" quelle={quelle} transkript={TRANSKRIPT} />
        </HelmetProvider>,
    )
}

describe('Video-Abschnitt', () => {
    it('zeigt das Transkript als lesbaren Text', () => {
        zeige({ art: 'datei', url: '/video/agent.mp4' })
        expect(screen.getByText(/nennt zu jedem Treffer den Grund/)).toBeInTheDocument()
    })

    it('liefert bei einer Videodatei ein video-Element ohne iframe', () => {
        const { container } = zeige({ art: 'datei', url: '/video/agent.mp4' })
        expect(container.querySelector('video')).not.toBeNull()
        expect(container.querySelector('iframe')).toBeNull()
    })

    it('nutzt bei YouTube die cookiefreie Adresse', () => {
        const { container } = zeige({ art: 'youtube', id: 'abc123' })
        expect(container.querySelector('iframe').getAttribute('src')).toContain('youtube-nocookie.com')
    })

    it('kennzeichnet das Video als VideoObject mit Transkript', () => {
        const context = {}
        render(
            <HelmetProvider context={context}>
                <VideoAbschnitt titel="So arbeitet der Agent" quelle={{ art: 'datei', url: '/video/agent.mp4' }} transkript={TRANSKRIPT} />
            </HelmetProvider>,
        )
        const daten = JSON.parse(context.helmet.script.toString().replace(/^[\s\S]*?>/, '').replace(/<\/script>[\s\S]*$/, ''))
        expect(daten['@type']).toBe('VideoObject')
        expect(daten.transcript).toContain('nennt zu jedem Treffer den Grund')
    })
})
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/videoAbschnitt.test.jsx`
Expected: FAIL, `Failed to resolve import "./components/VideoAbschnitt"`

- [ ] **Step 3: Komponente schreiben**

```jsx
// src/components/VideoAbschnitt.jsx
// Das Transkript steht bewusst als sichtbarer Text auf der Seite:
// KI-Crawler werten kein Bewegtbild aus, fuer sie ist das Transkript die
// einzige verwertbare Fassung des Videos.
import { Helmet } from 'react-helmet-async'

export default function VideoAbschnitt({ titel, quelle, transkript, beschreibung }) {
    const volltext = transkript.map((eintrag) => eintrag.text).join(' ')

    const daten = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: titel,
        description: beschreibung ?? volltext.slice(0, 200),
        transcript: volltext,
        ...(quelle.art === 'datei'
            ? { contentUrl: quelle.url }
            : { embedUrl: `https://www.youtube-nocookie.com/embed/${quelle.id}` }),
    }

    return (
        <section className="section video-abschnitt">
            <div className="container">
                <Helmet>
                    <script type="application/ld+json">{JSON.stringify(daten)}</script>
                </Helmet>
                <h2 className="section__title">{titel}</h2>

                {quelle.art === 'datei' ? (
                    <video controls preload="metadata" playsInline className="video-abschnitt__player">
                        <source src={quelle.url} type="video/mp4" />
                        Ihr Browser kann dieses Video nicht abspielen. Das vollständige Transkript steht darunter.
                    </video>
                ) : (
                    <iframe
                        className="video-abschnitt__player"
                        src={`https://www.youtube-nocookie.com/embed/${quelle.id}`}
                        title={titel}
                        loading="lazy"
                        allowFullScreen
                    />
                )}

                <details className="video-abschnitt__transkript" open>
                    <summary>Transkript</summary>
                    <dl>
                        {transkript.map((eintrag) => (
                            <div key={eintrag.zeit}>
                                <dt>{eintrag.zeit}</dt>
                                <dd>{eintrag.text}</dd>
                            </div>
                        ))}
                    </dl>
                </details>
            </div>
        </section>
    )
}
```

- [ ] **Step 4: Test laufen lassen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vitest run src/videoAbschnitt.test.jsx`
Expected: PASS

- [ ] **Step 5: Nur bei YouTube — Content-Security-Policy erweitern**

Die aktuelle Richtlinie setzt `default-src 'self'` und definiert kein `frame-src`; ein YouTube-Rahmen würde blockiert. Bei eigener Videodatei ist **keine** Änderung nötig. Bei YouTube in `vercel.json` innerhalb des `Content-Security-Policy`-Werts ergänzen:

```
frame-src https://www.youtube-nocookie.com;
```

- [ ] **Step 6: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add src/components/VideoAbschnitt.jsx src/videoAbschnitt.test.jsx
git commit -m "feat(seo): Video-Abschnitt mit sichtbarem Transkript und VideoObject-Auszeichnung"
```

---

### Task 8: Auslieferung auf einer Vercel-Vorschau prüfen

`vercel.json` enthält den Auffang-Rewrite `/((?!.*\..*).*)` → `/index.html`. Wäre er stärker als das Dateisystem, liefen alle Routen weiter gegen die Startseiten-Datei und die gesamte Phase wäre wirkungslos.

**Stand 2026-08-12 — aus der Dokumentation beantwortet.** Vercel schreibt zu `rewrites`:

> „The `source` property should **NOT** be a file because precedence is given to the filesystem prior to rewrites being applied."

und zur veralteten `routes`-Eigenschaft:

> „`handle`: A special route type (e.g. `"handle": "filesystem"`) … Use `rewrites` instead, which **checks the filesystem by default**."

Der Auffang-Rewrite greift damit nur für Pfade ohne passende Datei. `dist/ueber-uns/index.html` gewinnt. Ein lokaler Server mit Verzeichnis-Index bestätigt das für die erzeugten Dateien: `/ueber-uns/` liefert „Über uns | Ausschreibungsagenten.de", `/` liefert den Startseiten-Titel.

**Offen bleibt die Messung an der echten Auslieferung.** Die Vercel-CLI ist hier als `shufflethis` (Team „Tracky's projects") angemeldet; dieses Projekt liegt unter einem anderen Konto und ist lokal nicht verknüpft. `vercel deploy` würde ein neues, fremdes Projekt anlegen statt eine Vorschau des richtigen zu bauen. Die Schritte unten sind deshalb von der Person auszuführen, die Zugriff auf das Konto hat — vor dem Merge nach `master`.

Ein Hinweis zur Auswertung: `vite preview` taugt für diese Prüfung **nicht**. Sein SPA-Rückfall liefert für jede Route die Startseiten-Datei und erzeugt damit genau das Fehlerbild, das hier ausgeschlossen werden soll.

**Files:**
- Modify: `docs/superpowers/plans/2026-08-11-prerendering-und-seo-fundament.md` (Ergebnis eintragen)

**Interfaces:**
- Consumes: den vollständigen Build aus Task 2 bis 7
- Produces: bestätigte Auslieferung oder eine korrigierte `vercel.json`

- [ ] **Step 1: Vorschau-Deployment erzeugen**

Run: `cd /home/admin/ausschreibungsagenten-site && npx vercel deploy --yes`
Expected: Adresse einer Vorschau-Auslieferung. Die Zieladresse aus der Ausgabe als `$VORSCHAU` verwenden.

- [ ] **Step 2: Titel und Textinhalt je Route ohne JavaScript abrufen**

Run:
```bash
for pfad in / /ueber-uns /entwickler /status /agb /datenschutz /impressum /disclaimer; do
  printf "%-16s " "$pfad"
  curl -s "$VORSCHAU$pfad" | grep -o "<title>[^<]*</title>" | head -1
done
```
Expected: Acht **verschiedene** Titel. Achtmal derselbe Titel bedeutet, dass der Auffang-Rewrite vor dem Dateisystem greift.

- [ ] **Step 3: Nur falls Step 2 überall denselben Titel liefert — Rewrite einschränken**

```json
        {
            "source": "/((?!.*\\..*).*)",
            "destination": "/index.html",
            "has": [{ "type": "header", "key": "x-nie-zutreffend" }]
        }
```

Wirksamer und einfacher: den Auffang-Rewrite streichen und stattdessen `"cleanUrls": true` setzen, damit Vercel die vorgerenderten Verzeichnisse direkt ausliefert. Danach Step 1 und 2 wiederholen.

- [ ] **Step 4: Sichtbaren Text stichprobenartig prüfen**

Run: `curl -s "$VORSCHAU/ueber-uns" | grep -c "Gorden"`
Expected: mindestens 1

- [ ] **Step 5: Ergebnis im Plan festhalten**

Unter diesem Task notieren: Vorschau-Adresse, Datum und ob die acht Titel unterschiedlich waren. Diese Notiz ist die Freigabegrundlage für den späteren Merge nach `master`.

- [ ] **Step 6: Commit**

```bash
cd /home/admin/ausschreibungsagenten-site
git add docs/superpowers/plans/2026-08-11-prerendering-und-seo-fundament.md vercel.json
git commit -m "test(seo): Auslieferung der vorgerenderten Routen auf der Vorschau geprueft"
```

---

## Nach Phase 1

Der Merge nach `master` ist eine eigene, ausdrückliche Entscheidung und **nicht** Teil dieses Plans — Vercel deployt aus `master` live. Erst nach bestandener Prüfung aus Task 8 und ausdrücklicher Freigabe.

Danach folgt Phase 2 aus der Spec: `/ausschreibungssuche-automatisieren` (~900 Impressionen), `/ki-angebot-ausschreibung` (~600) und `/semantische-suche-ausschreibungen` (292). Die Inhaltsseiten setzen auf dem Manifest, `<Seo>` und `<StrukturierteDaten>` aus diesem Plan auf.
