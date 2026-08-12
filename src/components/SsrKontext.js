import { createContext } from 'react'

// Beim Prerendering sollen Seo, StrukturierteDaten und VideoAbschnitt ihre
// Kopf-Elemente ausgeben; entry-server.jsx holt sie anschliessend aus der
// gerenderten Zeichenkette und setzt sie in den Kopfbereich der Seite.
//
// Im Browser duerfen dieselben Komponenten nichts ausgeben. Sonst erwartet
// React beim Hydrieren an dieser Stelle im Rumpf ein title- oder
// meta-Element, findet dort aber nichts mehr - genau das war React-Fehler
// 418 auf jeder vorgerenderten Seite.
//
// Bewusst ein Kontext statt einer Abfrage auf "typeof document": so bleibt
// das Verhalten in Tests steuerbar und haengt nicht an der Umgebung.
export const SsrKontext = createContext(false)
