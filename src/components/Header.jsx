import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
            <div className="container header__inner">
                <Link to="/" className="header__logo" aria-label="Ausschreibungsagenten Startseite">
                    <svg
                        className="header__logo-mark"
                        viewBox="0 0 200 200"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M100 22 L178 178 L132 178 L100 96 L68 178 L22 178 Z" />
                            <path d="M80 148 L120 148" />
                        </g>
                    </svg>
                    <span className="header__logo-text">
                        ausschreibungsagenten<span className="dot">.</span>de
                        <span className="sub">Erklärbare Ausschreibungssuche</span>
                    </span>
                </Link>

                <button
                    className="header__mobile-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"} aria-expanded={menuOpen}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

                <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Hauptnavigation">
                    <a href="/#suche" onClick={() => setMenuOpen(false)}>Live-Suche</a>
                    <a href="/#gespeichert" onClick={() => setMenuOpen(false)}>Gespeicherte Suchen</a>
                    <a href="/#tafel" onClick={() => setMenuOpen(false)}>Merkliste</a>
                    <a href="/#preise" onClick={() => setMenuOpen(false)}>Pilotphase</a>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                    <a href="/#kontakt" className="btn btn--primary header__cta" onClick={() => setMenuOpen(false)}>Jetzt starten</a>
                </nav>
            </div>
        </header>
    )
}
