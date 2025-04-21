import { afterEach, expect, vi } from 'vitest'
import { cleanup } from '@testing-library/preact'
import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock these packages to avoid resolution errors
vi.mock('@penpot/plugin-styles', () => ({
  default: {}
}))

vi.mock('@penpot/plugin-types', () => ({
  default: {}
}))

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver
