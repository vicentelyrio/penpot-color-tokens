import { describe, it, expect } from 'vitest'
import { getBrightness } from './colorBrightness'

describe('colorBrightness utility', () => {
  it('should calculate brightness correctly for white', () => {
    expect(getBrightness('#FFFFFF')).toBe(255)
    expect(getBrightness('FFFFFF')).toBe(255)
  })

  it('should calculate brightness correctly for black', () => {
    expect(getBrightness('#000000')).toBe(0)
    expect(getBrightness('000000')).toBe(0)
  })

  it('should calculate brightness correctly for primary colors', () => {
    expect(getBrightness('#FF0000')).toBe(76.245) // Red
    expect(getBrightness('#00FF00')).toBe(149.685) // Green
    expect(getBrightness('#0000FF')).toBe(29.07) // Blue
  })

  it('should calculate brightness correctly for mixed colors', () => {
    expect(getBrightness('#808080')).toBe(128) // Gray
    expect(getBrightness('#FFD700')).toBe(202.45) // Gold
    expect(getBrightness('#800080')).toBe(52.864) // Purple
  })
}) 