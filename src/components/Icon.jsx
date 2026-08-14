// Schlichte SVG-Line-Icons im Neon-Look statt Emojis.
// Alle Icons nutzen currentColor, die Farbe kommt aus dem umgebenden CSS
// (z.B. .glass-card__icon mit accent-Farbe).
const paths = {
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
        </>
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
        </>
    ),
    doc: (
        <>
            <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6M9 17h6" />
        </>
    ),
    dashboard: (
        <>
            <rect x="3" y="3" width="8" height="8" rx="1.5" />
            <rect x="13" y="3" width="8" height="4" rx="1.5" />
            <rect x="13" y="9" width="8" height="12" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" />
        </>
    ),
    export: (
        <>
            <path d="M12 3v12" />
            <path d="M7 8l5-5 5 5" />
            <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        </>
    ),
    crane: (
        <>
            <path d="M4 21h16" />
            <path d="M8 21V8l8-4v4" />
            <path d="M8 8h13" />
            <path d="M17 8v5" />
            <rect x="14.5" y="13" width="5" height="4" rx="0.5" />
        </>
    ),
    megaphone: (
        <>
            <path d="M3 11v3l4 1 2 5h2l-1.5-5.5" />
            <path d="M11 5l10-2v14l-10-2z" />
            <path d="M11 5v10" />
        </>
    ),
    compass: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </>
    ),
    phone: (
        <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />
    ),
    pin: (
        <>
            <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    zap: (
        <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
    ),
}

export default function Icon({ name, size = 24 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {paths[name] || null}
        </svg>
    )
}
