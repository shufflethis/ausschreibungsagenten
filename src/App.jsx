import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollRestoration from './components/ScrollRestoration'
import PartnerHinweis from './components/PartnerHinweis'
import { routes } from './routes'

// `seiten` ordnet Manifest-Schluessel einem Element zu: auf dem Server und
// in Tests src/seiten.jsx (fest eingebunden), im Browser src/seitenLazy.jsx
// (nachgeladen). App selbst importiert keine Seite, sonst landeten wieder
// alle im Startbaustein.
//
// Die Suspense-Grenze steht auf beiden Seiten an derselben Stelle. Beim
// Hydrieren laesst React das vorgerenderte Markup stehen, bis der Baustein
// der Route da ist; beim Seitenwechsel bleibt die alte Seite sichtbar, weil
// React Router den Wechsel als Transition ausfuehrt.
export default function App({ seiten }) {
    return (
        <>
            <ScrollRestoration />
            <Header />
            <main>
                <Suspense fallback={null}>
                    <Routes>
                        {routes.map((route) => (
                            <Route key={route.path} path={route.path} element={seiten[route.component]} />
                        ))}
                    </Routes>
                </Suspense>
            </main>
            <Footer />
            <PartnerHinweis />
        </>
    )
}
