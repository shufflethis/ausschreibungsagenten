import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Ohne "globals: true" registriert Testing Library sein Aufraeumen nicht
// selbst. Die gerenderten Baeume blieben dann ueber Testgrenzen hinweg im
// document stehen, und Abfragen wie getByRole fanden Treffer aus einem
// frueheren Test mit.
afterEach(cleanup)
