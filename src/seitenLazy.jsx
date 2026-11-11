// Jede Seite als eigener Baustein, den der Browser erst bei Bedarf laedt.
// Vorher steckten alle 26 Seiten in einer Datei; wer eine Inhaltsseite
// oeffnete, lud die komplette Suchlogik der Startseite mit.
import { createElement, lazy } from 'react'
import { seitenDateien, seitenPfad } from './seitenDateien'

const module = import.meta.glob('./pages/*.jsx')

export const pages = Object.fromEntries(
    Object.entries(seitenDateien).map(([schluessel, { datei, name = 'default', props }]) => [
        schluessel,
        createElement(
            lazy(() => module[seitenPfad(datei)]().then((geladen) => ({ default: geladen[name] }))),
            props,
        ),
    ]),
)
