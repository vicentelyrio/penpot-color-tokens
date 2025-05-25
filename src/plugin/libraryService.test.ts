import { describe, it, expect, beforeEach, vi } from 'vitest'
import { addColorToLibrary, isLibraryAvailable, getLocalLibrary, PenpotLibrary } from './libraryService'
import { LIBRARY_NAME } from '@consts/config'

// Extend globalThis with penpot property
const globalThisWithPenpot = globalThis as typeof globalThis & {
  penpot: {
    library?: {
      local?: PenpotLibrary
    }
  }
}

vi.mock('@plugin/colorCache', () => ({
  colorExists: vi.fn(),
  addToColorCache: vi.fn()
}))

import { colorExists, addToColorCache } from '@plugin/colorCache'

describe('libraryService', () => {
  const mockColor = {
    id: 'test-id',
    name: '',
    color: '',
    opacity: 1,
    path: ''
  }

  const mockLibrary: PenpotLibrary = {
    createColor: vi.fn(() => ({ ...mockColor })),
    colors: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(colorExists as unknown as ReturnType<typeof vi.fn>).mockReset()
    ;(addToColorCache as unknown as ReturnType<typeof vi.fn>).mockReset()
    globalThisWithPenpot.penpot = {
      library: {
        local: mockLibrary
      }
    }
  })

  describe('addColorToLibrary', () => {
    it('should add a new color to the library', () => {
      (colorExists as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false)

      const result = addColorToLibrary(mockLibrary, 'Red', '#FF0000')

      expect(result.success).toBe(true)
      expect(result.colorId).toBe('test-id')
      expect(mockLibrary.createColor).toHaveBeenCalled()
      expect(addToColorCache).toHaveBeenCalledWith('Red', LIBRARY_NAME)
    })

    it('should skip adding existing color', () => {
      (colorExists as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true)

      const result = addColorToLibrary(mockLibrary, 'Red', '#FF0000')

      expect(result.success).toBe(true)
      expect(result.skipped).toBe(true)
      expect(mockLibrary.createColor).not.toHaveBeenCalled()
    })

    it('should handle custom path', () => {
      (colorExists as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false)

      const customPath = 'Colors/Primary'
      const result = addColorToLibrary(mockLibrary, 'Blue', '#0000FF', customPath)

      expect(result.success).toBe(true)
      expect(addToColorCache).toHaveBeenCalledWith('Blue', customPath)
    })

    it('should handle errors', () => {
      (colorExists as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false)
      ;(mockLibrary.createColor as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      const result = addColorToLibrary(mockLibrary, 'Red', '#FF0000')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Test error')
    })
  })

  describe('isLibraryAvailable', () => {
    it('should return true when library is available', () => {
      expect(isLibraryAvailable()).toBe(true)
    })

    it('should return false when library is not available', () => {
      globalThisWithPenpot.penpot = {}
      expect(isLibraryAvailable()).toBe(false)

      globalThisWithPenpot.penpot = { library: {} }
      expect(isLibraryAvailable()).toBe(false)
    })
  })

  describe('getLocalLibrary', () => {
    it('should return local library when available', () => {
      const library = getLocalLibrary()
      expect(library).toBe(mockLibrary)
    })

    it('should throw error when library is not available', () => {
      globalThisWithPenpot.penpot = {}
      expect(() => getLocalLibrary()).toThrow('Library API not available')
    })
  })
})
