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
                    ausschreibungsagenten<span className="dot">.</span>de
                    <span className="sub">KI-gestützte Ausschreibungssuche</span>
                </Link>

                <button
                    className="header__mobile-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menü öffnen"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

                <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Hauptnavigation">
                    <a href="/#vergleich" onClick={() => setMenuOpen(false)}>Vergleich</a>
                    <a href="/#funktionen" onClick={() => setMenuOpen(false)}>Funktionen</a>
                    <a href="/#branchen" onClick={() => setMenuOpen(false)}>Branchen</a>
                    <a href="/#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
                    <a href="/#kontakt" className="btn btn--primary header__cta" onClick={() => setMenuOpen(false)}>Jetzt starten</a>
                </nav>
            </div>
        </header>
    )
}
