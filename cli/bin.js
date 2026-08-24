#!/usr/bin/env node
// Eigener Einstiegspunkt statt einer Weiche in der index.js: npm legt fuer
// das bin-Feld einen Symlink an, und dessen Name ist nicht index.js. Jede
// Pruefung "laeuft die Datei als Programm?" ist damit falsch - die erste
// Fassung war es und lieferte ueber npx wortlos Exit 0.
import { fuehreAus } from './index.js'

process.exitCode = await fuehreAus(process.argv.slice(2))
