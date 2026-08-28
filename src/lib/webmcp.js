// WebMCP: Werkzeuge der laufenden Seite fuer Agenten im Browser.
//
// Spec: https://webmachinelearning.github.io/webmcp (W3C Web Machine
// Learning CG). Seit Chrome 149 im Origin Trial, lokal ueber
// chrome://flags/#enable-webmcp-testing, und im In-App-Browser der
// ChatGPT-Desktop-App ohne weitere Schalter.
//
// Der Unterschied zu unserem MCP-Server unter /mcp: dort ruft ein Agent
// das Backend ohne Browser auf. Hier ruft ein Agent *die geoeffnete
// Seite* auf. Ein Werkzeug muss deshalb den sichtbaren Zustand aendern -
// sonst sieht der Mensch vor dem Bildschirm nicht, was der Agent tut, und
// der einzige Vorteil gegenueber DOM-Scraping ist verschenkt.
//
// Drei Regeln, die daraus folgen und die der Rest der Datei durchhaelt:
//
// 1. Alles ist SSR-sicher. scripts/prerender.mjs rendert dieselben
//    Komponenten ohne `document`; ein Zugriff auf Modulebene wuerde den
//    Build brechen.
// 2. Nichts wird ohne Feature-Erkennung angefasst. Auf nahezu alle
//    heutigen Besucher trifft das zu - die Seite darf davon nicht einmal
//    langsamer werden.
// 3. Kein Werkzeug schickt ein Formular ab. Kontakt- und Profilformular
//    loesen echte E-Mails an echte Menschen aus. Agenten duerfen
//    ausfuellen, absenden bleibt der Klick des Menschen.

// Der Entwurf hat die API von `navigator.modelContext` auf
// `document.modelContext` umbenannt (jedes Document hat seinen eigenen
// Kontext). Beide Orte zu pruefen kostet zwei Zeilen und deckt Browser
// ab, die noch auf dem alten Stand sind.
function modellKontext() {
    if (typeof document !== 'undefined' && typeof document.modelContext?.registerTool === 'function') {
        return document.modelContext
    }
    if (typeof navigator !== 'undefined' && typeof navigator.modelContext?.registerTool === 'function') {
        return navigator.modelContext
    }
    return null
}

export function unterstuetztWebMcp() {
    return modellKontext() !== null
}

// Meldet die Werkzeugliste an und gibt die Abmeldung zurueck, passend
// fuer den Rueckgabewert eines useEffect.
//
// Abgemeldet wird ueber ein AbortSignal - so sieht es die Spec vor, ein
// `unregisterTool` gibt es nicht. Ein einzelnes Signal fuer alle
// Werkzeuge genuegt, weil sie gemeinsam kommen und gemeinsam gehen.
//
// `registerTool` liefert ein Promise und lehnt unter anderem ab, wenn der
// Name doppelt vergeben ist, wenn das Dokument nicht origin-isoliert ist
// (siehe `Origin-Agent-Cluster: ?1` in vercel.json) oder wenn die
// Permissions Policy `tools` fehlt. Jede Ablehnung wird einzeln
// aufgefangen: eine Draft-API, die sich anders verhaelt als
// dokumentiert, darf die Seite nicht mitreissen.
export function stelleWerkzeugeBereit(werkzeuge, beiFehler) {
    const kontext = modellKontext()
    if (!kontext || !Array.isArray(werkzeuge) || werkzeuge.length === 0) {
        return () => {}
    }

    const abbruch = new AbortController()
    for (const werkzeug of werkzeuge) {
        try {
            Promise.resolve(kontext.registerTool(werkzeug, { signal: abbruch.signal })).catch((fehler) => {
                beiFehler?.(werkzeug.name, fehler)
            })
        } catch (fehler) {
            beiFehler?.(werkzeug.name, fehler)
        }
    }

    return () => abbruch.abort()
}

// Antwortform von MCP: `content` ist der Text, den das Modell liest,
// `structuredContent` sind die Daten, auf denen es rechnen kann. Beides
// zu liefern ist billig und erspart dem Agenten, Zahlen aus Prosa zu
// parsen.
export function werkzeugAntwort(text, daten) {
    const antwort = { content: [{ type: 'text', text }] }
    if (daten !== undefined) antwort.structuredContent = daten
    return antwort
}

// Fehler sind fuer den Agenten ein Wegweiser, keine Sackgasse: sagen, was
// schiefging *und* welcher Aufruf als naechstes hilft. `isError` ist die
// MCP-Konvention fuer einen fachlichen Fehlschlag innerhalb eines
// erfolgreichen Aufrufs.
export function werkzeugFehler(text) {
    return { content: [{ type: 'text', text }], isError: true }
}

// Wartet, bis `istFertig()` zutrifft. Die Trefferliste laedt asynchron
// nach; ein Werkzeug muss aber erst antworten, wenn auf dem Bildschirm
// steht, was es zurueckmeldet. Nach `grenzeMs` wird aufgegeben, damit ein
// haengender Request den Agenten nicht endlos blockiert.
export function warteAuf(istFertig, { grenzeMs = 12000, taktMs = 100 } = {}) {
    return new Promise((erfuellen) => {
        if (istFertig()) return erfuellen(true)
        const start = Date.now()
        const takt = setInterval(() => {
            if (istFertig()) {
                clearInterval(takt)
                erfuellen(true)
            } else if (Date.now() - start >= grenzeMs) {
                clearInterval(takt)
                erfuellen(false)
            }
        }, taktMs)
    })
}
