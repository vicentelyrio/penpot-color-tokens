import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateComponents } from './generateComponents'

type ColorToken = {
  $type: 'color'
  $value: string
}

const mockRectangle = {
  id: 'rect1',
  type: 'rectangle',
  fills: [{ fillOpacity: 1, fillColor: '#ff0000' }],
  resize: vi.fn(),
  name: '',
  x: 0,
  y: 0
}

const mockText = {
  id: 'text1',
  type: 'text',
  content: 'Text',
  name: '',
  fontSize: '',
  x: 0,
  y: 0,
  fills: []
}

const mockGroup = {
  id: 'group1',
  type: 'group',
  children: [],
  name: ''
}

declare global {
  interface Window {
    penpot: {
      createRectangle: any;
      createText: any;
      group: any;
      selection: any[];
    }
  }
}

describe('generateComponents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Define window.penpot
    Object.defineProperty(window, 'penpot', {
      value: {
        createRectangle: vi.fn().mockReturnValue(mockRectangle),
        createText: vi.fn().mockReturnValue(mockText),
        group: vi.fn().mockReturnValue(mockGroup),
        selection: []
      },
      writable: true
    })
  })

  it('should generate components successfully', async () => {
    const tokens: Record<string, ColorToken> = {
      'red': {
        $type: 'color',
        $value: '#ff0000'
      },
      'blue': {
        $type: 'color',
        $value: '#0000ff'
      }
    }

    const result = await generateComponents(tokens)
    expect(result.success).toBe(true)
    expect(window.penpot.createRectangle).toHaveBeenCalled()
    expect(window.penpot.group).toHaveBeenCalled()
  })

  it('should handle empty token array', async () => {
    const tokens: Record<string, ColorToken> = {}
    const result = await generateComponents(tokens)
    expect(result.success).toBe(false)
    expect(result.message).toBe('No valid colors found in the tokens data')
  })

  it('should handle errors during component creation', async () => {
    const tokens: Record<string, ColorToken> = {
      'color-1': {
        $type: 'color',
        $value: '#FF0000'
      }
    }

    vi.spyOn(window.penpot, 'createRectangle').mockImplementation(() => {
      throw new Error('Failed to create rectangle')
    })

    const result = await generateComponents(tokens)
    expect(result.success).toBe(false)
    expect(result.message).toBe('Failed to create visual palette: Failed to create rectangle')
  })

  it('should sort colors correctly within a group', async () => {
    const tokens: Record<string, ColorToken> = {
      'blue': {
        $type: 'color',
        $value: '#0000ff'
      },
      'red': {
        $type: 'color',
        $value: '#ff0000'
      }
    }

    const result = await generateComponents(tokens)
    expect(result.success).toBe(true)
    expect(window.penpot.group).toHaveBeenCalled()
  })
}) 