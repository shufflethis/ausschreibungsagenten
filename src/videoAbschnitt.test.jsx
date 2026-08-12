import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import VideoAbschnitt from './components/VideoAbschnitt'
import { SsrKontext } from './components/SsrKontext'

const imServer = (kind) => <SsrKontext.Provider value={true}>{kind}</SsrKontext.Provider>

const TRANSKRIPT = [
    { zeit: '00:00', titel: 'Worum es geht', text: 'Öffentliche Ausschreibungen verteilen sich auf viele Portale.' },
    { zeit: '00:18', titel: 'Der Agent', text: 'Der Agent prüft sie täglich und nennt zu jedem Treffer den Grund.' },
]

function zeige(quelle) {
    return render(<VideoAbschnitt titel="So arbeitet der Agent" quelle={quelle} transkript={TRANSKRIPT} />)
}

describe('Video-Abschnitt', () => {
    it('zeigt das Transkript als lesbaren Text', () => {
        zeige({ art: 'datei', url: '/video/agent.mp4' })
        expect(screen.getByText(/nennt zu jedem Treffer den Grund/)).toBeInTheDocument()
    })

    it('liefert bei einer Videodatei ein video-Element ohne iframe', () => {
        const { container } = zeige({ art: 'datei', url: '/video/agent.mp4', poster: '/video/poster.jpg' })
        const video = container.querySelector('video')
        expect(video).not.toBeNull()
        expect(video.getAttribute('preload')).toBe('none')
        expect(video.getAttribute('poster')).toBe('/video/poster.jpg')
        expect(container.querySelector('iframe')).toBeNull()
    })

    it('nutzt bei YouTube die cookiefreie Adresse und laedt verzoegert', () => {
        const { container } = zeige({ art: 'youtube', id: 'abc123' })
        const rahmen = container.querySelector('iframe')
        expect(rahmen.getAttribute('src')).toContain('youtube-nocookie.com')
        expect(rahmen.getAttribute('loading')).toBe('lazy')
    })

    it('kennzeichnet das Video als VideoObject mit vollem Transkript', () => {
        const markup = renderToString(
            imServer(<VideoAbschnitt
                titel="So arbeitet der Agent"
                quelle={{ art: 'datei', url: '/video/agent.mp4' }}
                transkript={TRANSKRIPT}
            />),
        )
        const roh = markup
            .replace(/^[\s\S]*?<script type="application\/ld\+json">/, '')
            .replace(/<\/script>[\s\S]*$/, '')
        const daten = JSON.parse(roh)
        expect(daten['@type']).toBe('VideoObject')
        expect(daten.transcript).toContain('nennt zu jedem Treffer den Grund')
        expect(daten.contentUrl).toContain('/video/agent.mp4')
    })
})
