import { describe, it, expect, beforeEach, vi } from 'vitest'
import { colorExists, addToColorCache } from './colorCache'
import { PenpotLibrary } from './libraryService'

describe('colorCache', () => {
  beforeEach(() => {
    // Reset module state between tests
    vi.resetModules()
  })

  describe('colorExists', () => {
    const mockLibrary: PenpotLibrary = {
      createColor: vi.fn(),
      colors: [
        { id: '1', name: 'Red', color: '#FF0000', opacity: 1, path: 'Colors' },
        { id: '2', name: 'Blue', color: '#0000FF', opacity: 1, path: 'Colors/Primary' }
      ]
    }

    it('should return true for existing color without path', () => {
      expect(colorExists(mockLibrary, 'Red')).toBe(true)
    })

    it('should return true for existing color with matching path', () => {
      expect(colorExists(mockLibrary, 'Blue', 'Colors/Primary')).toBe(true)
    })

    it('should return false for non-existing color', () => {
      expect(colorExists(mockLibrary, 'Green')).toBe(false)
    })

    it('should return false for existing color with wrong path', () => {
      expect(colorExists(mockLibrary, 'Blue', 'Colors/Secondary')).toBe(false)
    })

    it('should handle case-insensitive color names', () => {
      expect(colorExists(mockLibrary, 'red')).toBe(true)
      expect(colorExists(mockLibrary, 'BLUE', 'Colors/Primary')).toBe(true)
    })

    it('should handle invalid library data', () => {
      const invalidLibrary = { colors: [null, undefined, {}] } as unknown as PenpotLibrary
      expect(colorExists(invalidLibrary, 'Red')).toBe(false)
    })
  })

  describe('addToColorCache', () => {
    const emptyLibrary: PenpotLibrary = {
      createColor: vi.fn(),
      colors: []
    }

    it('should add color to cache without path', () => {
      addToColorCache('Green')
      expect(colorExists(emptyLibrary, 'Green')).toBe(true)
    })

    it('should add color to cache with path', () => {
      addToColorCache('Yellow', 'Colors/Secondary')
      expect(colorExists(emptyLibrary, 'Yellow', 'Colors/Secondary')).toBe(true)
    })

    it('should handle case-insensitive color names', () => {
      addToColorCache('Purple')
      expect(colorExists(emptyLibrary, 'PURPLE')).toBe(true)
      expect(colorExists(emptyLibrary, 'purple')).toBe(true)
    })
  })
}) 