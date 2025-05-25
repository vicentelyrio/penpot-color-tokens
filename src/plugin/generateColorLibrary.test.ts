import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateColorLibrary } from './generateColorLibrary'
import { getLocalLibrary, addColorToLibrary } from './libraryService'
import { LIBRARY_NAME } from '@consts/config'

vi.mock('./libraryService', () => ({
  getLocalLibrary: vi.fn(),
  addColorToLibrary: vi.fn()
}))

describe('generateColorLibrary', () => {
  const mockLibrary = {
    createColor: vi.fn(),
    colors: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(getLocalLibrary as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockLibrary)
    ;(addColorToLibrary as unknown as ReturnType<typeof vi.fn>).mockImplementation((_, name) => ({
      name,
      success: true,
      colorId: `mock-id-${name}`
    }))
  })

  it('should successfully generate colors in the library', async () => {
    const mockTokens = {
      primary: {
        $type: 'color',
        $value: '#FF0000'
      },
      secondary: {
        $type: 'color',
        $value: '#00FF00'
      }
    }

    const result = await generateColorLibrary(mockTokens)

    expect(result.success).toBe(true)
    expect(result.message).toContain('Processed 2 colors')
    expect(addColorToLibrary).toHaveBeenCalledTimes(2)
    expect(addColorToLibrary).toHaveBeenCalledWith(mockLibrary, 'primary', '#FF0000', LIBRARY_NAME)
    expect(addColorToLibrary).toHaveBeenCalledWith(mockLibrary, 'secondary', '#00FF00', LIBRARY_NAME)
  })

  it('should handle nested color tokens', async () => {
    const mockTokens = {
      'colors/primary/base': {
        $type: 'color',
        $value: '#FF0000'
      },
    }

    const result = await generateColorLibrary(mockTokens)

    expect(result.success).toBe(true)
    expect(result.message).toContain('Processed 1 colors')
    expect(addColorToLibrary).toHaveBeenCalledWith(
      mockLibrary,
      'base',
      '#FF0000',
      `${LIBRARY_NAME}/colors/primary`
    )
  })

  it('should handle empty token data', async () => {
    const result = await generateColorLibrary({})

    expect(result.success).toBe(false)
    expect(result.message).toBe('No valid colors found in the tokens data')
    expect(addColorToLibrary).not.toHaveBeenCalled()
  })

  it('should handle non-color tokens', async () => {
    const mockTokens = {
      spacing: {
        $type: 'dimension',
        $value: '16px'
      }
    }

    const result = await generateColorLibrary(mockTokens)

    expect(result.success).toBe(false)
    expect(result.message).toBe('No valid colors found in the tokens data')
    expect(addColorToLibrary).not.toHaveBeenCalled()
  })

  it('should handle library API errors', async () => {
    (getLocalLibrary as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('Library API error')
    })

    const mockTokens = {
      primary: {
        $type: 'color',
        $value: '#FF0000'
      }
    }

    const result = await generateColorLibrary(mockTokens)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Error accessing Penpot API')
    expect(addColorToLibrary).not.toHaveBeenCalled()
  })

  it('should handle processing errors', async () => {
    const mockTokens = {
      primary: {
        $type: 'color',
        $value: '#FF0000'
      }
    }

    ;(addColorToLibrary as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('Processing error')
    })

    const result = await generateColorLibrary(mockTokens)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Error accessing Penpot API')
    expect(addColorToLibrary).toHaveBeenCalledTimes(1)
  })
})
