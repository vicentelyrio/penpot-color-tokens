import { describe, it, expect } from 'vitest'
import { parseColors } from './parseColors'

describe('parseColors', () => {
  it('should parse colors with both tints and shades enabled', () => {
    const palettes = [{
      name: 'blue',
      color: '#0000FF',
      colors: ['#CCCCFF', '#0000FF', '#000099']
    }]

    const result = parseColors(palettes, true, true)

    expect(result).toEqual({
      'blue-pale-100': { $type: 'color', $value: '#CCCCFF' },
      'blue-pale-200': { $type: 'color', $value: '#0000FF' },
      'blue-shade-100': { $type: 'color', $value: '#0000FF' },
      'blue-shade-200': { $type: 'color', $value: '#000099' }
    })
  })

  it('should parse colors without tints and shades', () => {
    const palettes = [{
      name: 'red',
      color: '#FF0000',
      colors: ['#FFCCCC', '#FF0000', '#990000']
    }]

    const result = parseColors(palettes, false, false)

    expect(result).toEqual({
      'red-100': { $type: 'color', $value: '#FFCCCC' },
      'red-200': { $type: 'color', $value: '#FF0000' },
      'red-300': { $type: 'color', $value: '#990000' }
    })
  })

  it('should handle multiple palettes', () => {
    const palettes = [
      {
        name: 'blue',
        color: '#0000FF',
        colors: ['#CCCCFF', '#0000FF', '#000099']
      },
      {
        name: 'red',
        color: '#FF0000',
        colors: ['#FFCCCC', '#FF0000', '#990000']
      }
    ]

    const result = parseColors(palettes, true, true)

    expect(result).toEqual({
      'blue-pale-100': { $type: 'color', $value: '#CCCCFF' },
      'blue-pale-200': { $type: 'color', $value: '#0000FF' },
      'blue-shade-100': { $type: 'color', $value: '#0000FF' },
      'blue-shade-200': { $type: 'color', $value: '#000099' },
      'red-pale-100': { $type: 'color', $value: '#FFCCCC' },
      'red-pale-200': { $type: 'color', $value: '#FF0000' },
      'red-shade-100': { $type: 'color', $value: '#FF0000' },
      'red-shade-200': { $type: 'color', $value: '#990000' }
    })
  })

  it('should handle empty palettes array', () => {
    const result = parseColors([], true, true)
    expect(result).toEqual({})
  })

  it('should handle palette with single color', () => {
    const palettes = [{
      name: 'gray',
      color: '#808080',
      colors: ['#808080']
    }]

    const result = parseColors(palettes, true, true)

    expect(result).toEqual({
      'gray-pale-100': { $type: 'color', $value: '#808080' },
      'gray-shade-100': { $type: 'color', $value: '#808080' }
    })
  })
}) 