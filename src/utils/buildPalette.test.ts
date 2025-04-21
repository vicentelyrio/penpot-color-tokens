import { describe, it, expect } from 'vitest'
import { buildPalette } from './buildPalette'

describe('buildPalette utility', () => {
  it('should generate a palette with tints and shades', () => {
    const color = '#ff0000'
    const steps = 2
    const tints = true
    const shades = true

    const result = buildPalette({ color, steps, tints, shades })

    // Expected result structure: [tint2, tint1, color, shade1, shade2]
    expect(result).toHaveLength(5) // 2 tints + base color + 2 shades
    expect(result).toContain(color) // Should contain the original color

    const colorIndex = result.indexOf(color)
    expect(colorIndex).toBe(2)

    const tintColors = result.slice(0, colorIndex)
    const shadeColors = result.slice(colorIndex + 1)

    expect(tintColors.length).toBe(2)
    expect(shadeColors.length).toBe(2)
  })

  it('should generate a palette with only tints', () => {
    const color = '#ff0000'
    const steps = 2
    const tints = true
    const shades = false

    const result = buildPalette({ color, steps, tints, shades })

    // Expected result structure: [tint2, tint1, color]
    expect(result).toHaveLength(3)
    expect(result).toContain(color)

    const colorIndex = result.indexOf(color)
    expect(colorIndex).toBe(2)
  })

  it('should generate a palette with only shades', () => {
    const color = '#ff0000'
    const steps = 2
    const tints = false
    const shades = true

    const result = buildPalette({ color, steps, tints, shades })

    // Expected result structure: [color, shade1, shade2]
    expect(result).toHaveLength(3)
    expect(result).toContain(color)

    // Base color should be at the beginning
    const colorIndex = result.indexOf(color)
    expect(colorIndex).toBe(0)
  })

  it('should generate a palette with only the base color when no tints or shades', () => {
    const color = '#ff0000'
    const steps = 2
    const tints = false
    const shades = false

    const result = buildPalette({ color, steps, tints, shades })

    // Expected result structure: [color]
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(color)
  })
})
