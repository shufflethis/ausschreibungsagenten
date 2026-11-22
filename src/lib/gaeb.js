// Reiner GAEB-DA-XML-Parser (X81/X82/X83/X84/X86) und CSV-Export.
// Bewusst ohne Fremdabhaengigkeiten und ohne Netzwerkzugriff: die Datei
// verlaesst den Browser nie. Nutzt den Standard-DOMParser und matcht
// Elementnamen ueber localName, damit GAEB-DA-XML 3.1, 3.2 und 3.3
// unabhaengig vom XML-Namespace gelesen werden.

export const BEISPIEL_GAEB_X83 = `<?xml version="1.0" encoding="UTF-8"?>
<GAEB xmlns="http://www.gaeb.de/GAEB_DA_XML/DA83/3.3">
  <GAEBInfo>
    <Version>3.3</Version>
    <Date>2026-11-10</Date>
    <ProgSystem>Ausschreibungsagenten Beispiel-LV</ProgSystem>
  </GAEBInfo>
  <PrjInfo>
    <NamePrj>Neubau Berufsschulzentrum – Los 14 Fassadenarbeiten</NamePrj>
    <LblPrj>BSZ-2026-L14</LblPrj>
    <Cur>EUR</Cur>
  </PrjInfo>
  <Award>
    <AwardInfo>
      <BoQID>LV-14</BoQID>
      <Cur>EUR</Cur>
    </AwardInfo>
    <BoQ>
      <BoQBody>
        <BoQCtgy RNoPart="01">
          <LblTx><p><span>Pfosten-Riegel-Fassade und Verglasung</span></p></LblTx>
          <BoQBody>
            <BoQCtgy RNoPart="02">
              <LblTx><p><span>Aluminium-Fassadenelemente</span></p></LblTx>
              <BoQBody>
                <Itemlist>
                  <Item RNoPart="0010">
                    <Qty>340.000</Qty>
                    <QU>m2</QU>
                    <UP>685.00</UP>
                    <IT>232900.00</IT>
                    <Description>
                      <CompleteText>
                        <OutlineText>
                          <OutlTxt><TextOutlTxt><p><span>Alu-Pfosten-Riegel-Fassade, thermisch getrennt, 3-fach-Isolierglas Ug 0,6</span></p></TextOutlTxt></OutlTxt>
                        </OutlineText>
                      </CompleteText>
                    </Description>
                  </Item>
                  <Item RNoPart="0040">
                    <Qty>18.000</Qty>
                    <QU>Stk</QU>
                    <UP>2450.00</UP>
                    <IT>44100.00</IT>
                    <Description>
                      <CompleteText>
                        <OutlineText>
                          <OutlTxt><TextOutlTxt><p><span>Alu-Brandschutzfenster EI30 inkl. Beschlag, Abdichtung und Montage</span></p></TextOutlTxt></OutlTxt>
                        </OutlineText>
                      </CompleteText>
                    </Description>
                  </Item>
                </Itemlist>
              </BoQBody>
            </BoQCtgy>
            <BoQCtgy RNoPart="03">
              <LblTx><p><span>Sonnenschutz und Steuerung</span></p></LblTx>
              <BoQBody>
                <Itemlist>
                  <Item RNoPart="0020">
                    <Qty>210.000</Qty>
                    <QU>m2</QU>
                    <Description>
                      <CompleteText>
                        <OutlineText>
                          <OutlTxt><TextOutlTxt><p><span>Außenraffstoreanlage motorisch mit Windwächter-Anbindung</span></p></TextOutlTxt></OutlTxt>
                        </OutlineText>
                      </CompleteText>
                    </Description>
                  </Item>
                </Itemlist>
              </BoQBody>
            </BoQCtgy>
          </BoQBody>
        </BoQCtgy>
      </BoQBody>
    </BoQ>
  </Award>
</GAEB>`

function kinderNachName(el, name) {
    return Array.from(el?.children ?? []).filter((kind) => kind.localName === name)
}

function erstesKind(el, name) {
    return kinderNachName(el, name)[0] ?? null
}

function findeNachkomme(el, name) {
    if (!el) return null
    for (const kind of Array.from(el.children ?? [])) {
        if (kind.localName === name) return kind
        const tief = findeNachkomme(kind, name)
        if (tief) return tief
    }
    return null
}

function saubererText(el) {
    return (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function zahlOderNull(rohtext) {
    const bereinigt = String(rohtext ?? '').trim().replace(',', '.')
    if (!bereinigt) return null
    const wert = Number(bereinigt)
    return Number.isFinite(wert) ? wert : null
}

function kurztextAusItem(item) {
    const desc = erstesKind(item, 'Description')
    if (!desc) return ''
    const outl = findeNachkomme(desc, 'OutlineText') || findeNachkomme(desc, 'OutlTxt')
    if (outl) {
        const text = saubererText(outl)
        if (text) return text
    }
    const detail = findeNachkomme(desc, 'DetailTxt') || desc
    return saubererText(detail).slice(0, 240)
}

function phaseAusDokument(doc, dateiname = '') {
    const ns = doc.documentElement?.namespaceURI || ''
    const nsTreffer = ns.match(/DA(8[1-6])/i)
    if (nsTreffer) return `X${nsTreffer[1]}`
    const dateiTreffer = String(dateiname).match(/\.(x8[1-6]|d8[1-6]|p8[1-6])$/i)
    if (dateiTreffer) return dateiTreffer[1].toUpperCase()
    return 'GAEB DA XML'
}

function durchlaufeBoqBody(body, praefix, bereichsPfad, positionen, bereiche) {
    if (!body) return
    for (const kind of Array.from(body.children ?? [])) {
        if (kind.localName === 'BoQCtgy') {
            const teil = kind.getAttribute('RNoPart') || ''
            const neuerPraefix = [...praefix, teil].filter(Boolean)
            const titel = saubererText(erstesKind(kind, 'LblTx')) || `Bereich ${neuerPraefix.join('.')}`
            const oz = neuerPraefix.join('.')
            bereiche.push({ oz, titel, tiefe: neuerPraefix.length })
            const neuerPfad = [...bereichsPfad, titel]
            for (const unterBody of kinderNachName(kind, 'BoQBody')) {
                durchlaufeBoqBody(unterBody, neuerPraefix, neuerPfad, positionen, bereiche)
            }
        } else if (kind.localName === 'Itemlist') {
            for (const item of kinderNachName(kind, 'Item')) {
                const teil = item.getAttribute('RNoPart') || ''
                const oz = [...praefix, teil].filter(Boolean).join('.')
                const menge = zahlOderNull(saubererText(erstesKind(item, 'Qty')))
                const einheit = saubererText(erstesKind(item, 'QU'))
                const ep = zahlOderNull(saubererText(erstesKind(item, 'UP')))
                const gp = zahlOderNull(saubererText(erstesKind(item, 'IT')))
                positionen.push({
                    oz: oz || String(positionen.length + 1),
                    bereich: bereichsPfad[bereichsPfad.length - 1] || '',
                    kurztext: kurztextAusItem(item) || 'Ohne Kurztext',
                    menge,
                    einheit,
                    einheitspreis: ep,
                    gesamtpreis: gp ?? (menge !== null && ep !== null ? Number((menge * ep).toFixed(2)) : null),
                })
            }
        }
    }
}

export function parseGaebXml(xmlText, dateiname = '') {
    const roh = String(xmlText ?? '').trim()
    if (!roh) throw new Error('Die Datei ist leer.')
    if (!roh.startsWith('<')) {
        throw new Error('Nur GAEB DA XML (X81–X86, XML-Format) wird unterstützt. Ältere GAEB-90/2000-Textdateien (D83/P83) bitte vorab als GAEB XML exportieren.')
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(roh, 'application/xml')
    if (doc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Die XML-Datei konnte nicht geparst werden (ungültige XML-Struktur).')
    }
    if (doc.documentElement?.localName !== 'GAEB') {
        throw new Error('Keine gültige GAEB-DA-XML-Datei: Wurzelelement <GAEB> fehlt.')
    }

    const gaebInfo = findeNachkomme(doc.documentElement, 'GAEBInfo')
    const prjInfo = findeNachkomme(doc.documentElement, 'PrjInfo')
    const awardInfo = findeNachkomme(doc.documentElement, 'AwardInfo')

    const meta = {
        dateiname: dateiname || 'Leistungsverzeichnis.x83',
        phase: phaseAusDokument(doc, dateiname),
        version: saubererText(erstesKind(gaebInfo, 'Version')) || 'unbekannt',
        datum: saubererText(erstesKind(gaebInfo, 'Date')) || '',
        projekt: saubererText(erstesKind(prjInfo, 'NamePrj')) || saubererText(erstesKind(prjInfo, 'LblPrj')) || 'Unbenanntes Projekt',
        waehrung: saubererText(erstesKind(prjInfo, 'Cur')) || saubererText(erstesKind(awardInfo, 'Cur')) || 'EUR',
    }

    const positionen = []
    const bereiche = []
    const boq = findeNachkomme(doc.documentElement, 'BoQ')
    const rootBodies = boq ? kinderNachName(boq, 'BoQBody') : []
    for (const body of rootBodies) {
        durchlaufeBoqBody(body, [], [], positionen, bereiche)
    }

    const summe = positionen.reduce((acc, p) => (p.gesamtpreis !== null ? acc + p.gesamtpreis : acc), 0)
    const mitPreis = positionen.filter((p) => p.einheitspreis !== null || p.gesamtpreis !== null).length

    return {
        meta,
        bereiche,
        positionen,
        statistik: {
            positionenGesamt: positionen.length,
            bereicheGesamt: bereiche.length,
            positionenMitPreis: mitPreis,
            gesamtsumme: mitPreis > 0 ? Number(summe.toFixed(2)) : null,
        },
    }
}

// Neutralisiert fuehrende Excel-Formelzeichen (=, +, -, @) beim CSV-Export,
// damit geoeffnete Fremd-GAEB-Dateien keine Tabellenkalkulations-Formeln ausfuehren.
function csvZelle(wert) {
    if (wert === null || wert === undefined) return ''
    let text = String(wert)
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
    if (/[";\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
    return text
}

export function gaebZuCsv(ergebnis) {
    const kopf = ['OZ', 'Bereich', 'Kurztext', 'Menge', 'Einheit', 'Einheitspreis', 'Gesamtpreis', 'Währung']
    const zeilen = ergebnis.positionen.map((p) => [
        p.oz,
        p.bereich,
        p.kurztext,
        p.menge !== null ? String(p.menge).replace('.', ',') : '',
        p.einheit,
        p.einheitspreis !== null ? p.einheitspreis.toFixed(2).replace('.', ',') : '',
        p.gesamtpreis !== null ? p.gesamtpreis.toFixed(2).replace('.', ',') : '',
        ergebnis.meta.waehrung,
    ])
    // UTF-8 BOM + Semikolon fuer direktes Oeffnen im deutschsprachigen Excel.
    return '\uFEFF' + [kopf, ...zeilen].map((z) => z.map(csvZelle).join(';')).join('\r\n')
}
