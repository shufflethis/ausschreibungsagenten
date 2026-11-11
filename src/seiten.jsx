// Alle Seiten fest eingebunden: fuer das Server-Rendern (renderToString
// wartet nicht auf nachgeladene Bausteine) und fuer die Tests. Der Browser
// nimmt stattdessen seitenLazy.jsx. routes.test.js haelt die Zuordnung
// deckungsgleich mit dem Routen-Manifest.
import { createElement } from 'react'
import { seitenDateien, seitenPfad } from './seitenDateien'

const module = import.meta.glob('./pages/*.jsx', { eager: true })

export const pages = Object.fromEntries(
    Object.entries(seitenDateien).map(([schluessel, { datei, name = 'default', props }]) => [
        schluessel,
        createElement(module[seitenPfad(datei)][name], props),
    ]),
)
