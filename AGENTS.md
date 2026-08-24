# Arbeitsweise für Agenten in diesem Repository

Die Leiter unten stammt aus [ponytail](https://github.com/DietrichGebert/ponytail)
(MIT, © 2026 DietrichGebert), gekürzt und um zwei Punkte ergänzt, die dieses
Repository gelehrt hat.

## Die Leiter

Der beste Code ist der, der nie geschrieben wurde. Vor jeder Zeile auf der
ersten Sprosse anhalten, die trägt:

1. Muss das überhaupt gebaut werden?
2. Gibt es das in diesem Repository schon? Vorhandenen Helfer, Util oder
   Muster wiederverwenden statt neu schreiben.
3. Kann die Standardbibliothek das?
4. Kann die Plattform das? (Browser, HTTP, Vercel-Routing, FastAPI)
5. Löst es eine bereits installierte Abhängigkeit?
6. Geht es in einer Zeile?
7. Erst dann: das Minimum schreiben, das funktioniert.

Die Leiter läuft **nach** dem Verstehen, nicht statt dessen. Erst die Aufgabe
und den Code lesen, den sie berührt, den echten Ablauf durchgehen — dann
klettern. Die kleinste Änderung an der falschen Stelle ist nicht faul, sondern
ein zweiter Fehler.

Fehlerbehebung heißt Ursache, nicht Symptom. Ein Bericht nennt ein Symptom.
Alle Aufrufer der Funktion suchen und die gemeinsame Stelle einmal reparieren.

## Regeln

- Keine Abstraktion, die niemand verlangt hat.
- Keine neue Abhängigkeit, wenn es ohne geht.
- Kein Gerüst, das niemand bestellt hat.
- Löschen vor Hinzufügen. Langweilig vor clever. So wenige Dateien wie möglich.
- Komplexe Wünsche hinterfragen: „Brauchst du wirklich X, oder deckt Y das ab?"
- Bei zwei gleich großen Wegen den nehmen, der die Randfälle richtig macht.
  Faul heißt weniger Code, nicht das wacklige Verfahren.
- Eine bewusste Vereinfachung mit bekannter Grenze (globales Lock, O(n²)-Scan,
  grobe Heuristik) als Kommentar kennzeichnen, samt Grenze und Ausweg.

## Nicht faul bei

Das Problem verstehen. Eingaben an Vertrauensgrenzen prüfen. Fehlerbehandlung,
die Datenverlust verhindert. Sicherheit. Barrierefreiheit. Alles ausdrücklich
Verlangte.

**Nicht triviale Logik lässt genau eine ausführbare Prüfung zurück** — das
Kleinste, das fehlschlägt, wenn die Logik bricht. Code ohne diese Prüfung ist
unfertig.

## Zwei Ergänzungen aus diesem Repository

**Eine Textänderung in einer Datei, die als Ganzes ein String-Literal ist, ist
keine triviale Änderung.** `api/agent-view.js` besteht aus einem einzigen
Template-Literal. Ein Backtick im Text hat es beendet, die Function lieferte
HTTP 500, und die Markdown-Aushandlung lag eine Stunde. Gefunden hat es ein
fremdes Prüfskript, nicht die eigene Abnahme. Wer solche Dateien anfasst,
schreibt den Test, der sie importiert.

**Nach jeder Änderung gegen Produktion nachmessen, nicht nur die Tests
ansehen.** Die bindende Beschränkung hier ist selten die Zahl der Zeilen, fast
immer die Frage, ob die ausgelieferte Fläche noch das tut, was die
Beschreibung verspricht. Zwei Fehler dieser Art in einer Sitzung: eine
`auth.md`, die einen Header nannte, den die API ignoriert, und eine
OpenAPI-Beschreibung, die einen Server nannte, der jede beschriebene Operation
mit 404 beantwortete. Beide Male stimmte der Code, beide Male log das Dokument.

Die Prüfbefehle je Bereich stehen in `README.md` und in
`docs/agent-readiness-plan.md`.
