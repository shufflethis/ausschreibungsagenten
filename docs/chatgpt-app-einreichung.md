# ChatGPT-App: Einreichungsmappe

Stand: 25.08.2026. Alles Technische ist vorbereitet und live. Was fehlt, steht
unter „Offen".

Quelle der Anforderungen: `developers.openai.com/apps-sdk` und die
App-Developer-Guidelines, gelesen am 25.08.2026.

## Was eingereicht wird

| Feld | Wert |
| --- | --- |
| Name | Ausschreibungsagenten Tender Search |
| MCP-Endpunkt | `https://api.ausschreibungsagenten.de/mcp/open-data` |
| Transport | Streamable HTTP |
| Auth | keine erforderlich (anonym, 60 Anfragen/Stunde) |
| Datenschutz | https://www.ausschreibungsagenten.de/datenschutz |
| Support | hi@ausschreibungsagenten.de |
| Anbieter | Yawusa UG (haftungsbeschränkt), Schliemannstraße 23, 10437 Berlin |

**Wichtig: eingereicht wird `/mcp/open-data`, nicht `/mcp`.** Die eingeschränkte
Fläche liefert nur aus Quellen mit einer vom Betreiber dafür bereitgestellten
Schnittstelle. Grund unten unter „Das Risiko".

## Werkzeuge

Sechs, alle read-only, alle mit vollständigen Annotationen
(`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`):

| Werkzeug | Zweck |
| --- | --- |
| `search_tenders` | Suche nach Stichwort, Land, CPV, Frist, Auftragswert |
| `get_tender` | eine Bekanntmachung per id |
| `summarize_tender` | gekennzeichnete KI-Kurzfassung, de/en |
| `source_status` | Datenstand je Portal, optional gefiltert |
| `countries` | Verfahren je Land, optional ab Mindestzahl |
| `fulltext_search` | Volltext (ab Tarif Pro) |

## Anforderungen gegen unseren Stand

| Anforderung | Stand |
| --- | --- |
| Klare, zutreffende Werkzeugnamen | ✅ seit 25.08. — vorher `agentleads.*`, ein interner Codename |
| Beschreibungen entsprechen dem Verhalten | ✅ |
| Korrekte Annotationen | ✅ Karte wird aus der Werkzeugliste erzeugt, kann nicht mehr abweichen |
| Minimale, zweckgebundene Eingaben | ✅ keine personenbezogenen Felder |
| Keine zusätzlichen Login-Schritte | ✅ anonym nutzbar — ihr häufigster Ablehnungsgrund entfällt |
| Testzugang mit Beispieldaten | ✅ nicht nötig; falls verlangt: Free-Key über `POST /api/v1/signup` |
| Veröffentlichte Datenschutzerklärung | ✅ |
| Keine Zahlungsdaten, Gesundheitsdaten, Ausweise, Zugangsdaten | ✅ wir erheben nichts davon |
| Kein Zugriff auf Chatverläufe | ✅ nur die übergebenen Argumente |
| Support-Kontakt | ✅ |
| Entwickler-Verifizierung | ❌ **offen** |

## Das Risiko, das man kennen muss

Die Richtlinie schließt *„unauthorized scraping or unofficial API connectors"*
aus. Von den 17 Quellen des Vollprodukts haben **fünf** eine offizielle
Schnittstelle; **zwölf** werden aus HTML gelesen:

- **Offiziell:** TED (`api.ted.europa.eu`), service.bund.de (RSS),
  Datenservice Öffentlicher Einkauf (`/api/notices`), GB Find a Tender (OCDS),
  GB Contracts Finder (OCDS).
- **HTML-Parsing:** DTVP, Vergabeportal BW, Bremen, Baden-Württemberg, Hessen,
  Rhein-Neckar, Mecklenburg-Vorpommern, Sachsen, Bayern, NRW, Rheinland-Pfalz,
  RIB.

Deshalb die eingeschränkte Fläche. Sie ist kein Rumpf: alle 27 EU-Länder über
TED, der deutsche Bund, deutsche Ober- **und** Unterschwelle über den
Datenservice, dazu UK ober- und unterschwellig.

Die zwölf Landesportale bleiben im bezahlten Produkt, wo die Kundenbeziehung
direkt ist. Ob deren Nutzungsbedingungen das Lesen erlauben, ist eine
rechtliche Frage und in dieser Mappe **nicht** beantwortet.

## Was die App nicht kann

Ihre Handelsregeln erlauben nur physische Waren — **keine digitalen Produkte,
keine Abonnements**, Checkout ausschließlich extern. Die App kann den Pro- oder
Agent-Tarif also nicht verkaufen. Sie ist ein Entdeckungs- und Lead-Kanal.

## Offen

1. **Entwickler-Verifizierung** bei OpenAI als Yawusa UG.
2. **Screenshots**, falls verlangt — müssen die Funktion zutreffend zeigen.
3. **Rechtliche Einordnung** der zwölf HTML-Quellen, falls die App später auf
   das Vollprodukt erweitert werden soll.

## Prüfbefehle

```bash
# Werkzeugliste der eingereichten Fläche
curl -sX POST https://api.ausschreibungsagenten.de/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Nur die fünf offiziellen Quellen
curl -sX POST https://api.ausschreibungsagenten.de/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"source_status","arguments":{}}}'
```
