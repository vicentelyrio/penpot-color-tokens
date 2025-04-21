import { describe, it, expect } from 'vitest'
import { tint, shade } from './colors'

describe('color utilities', () => {
  describe('tint function', () => {
    it('should lighten a color by the correct amount', () => {
      // Black to white tinting
      const black = '#000000'
      expect(tint(black, 0, 4)).toMatch(/^#[0-9a-f]{6}$/i) // Should be a valid hex color
      expect(tint(black, 0, 4)).not.toBe(black) // Should not be the same color
      
      // Verify tint progression
      const color = '#ff0000' // Red
      const tint1 = tint(color, 0, 4) // 20% tint
      const tint2 = tint(color, 1, 4) // 40% tint
      const tint3 = tint(color, 2, 4) // 60% tint
      const tint4 = tint(color, 3, 4) // 80% tint
      
      // Each tint should be lighter than the previous one
      expect(tint1.toLowerCase()).toBe('#ff3333')
      expect(tint2.toLowerCase()).toBe('#ff6666')
      expect(tint3.toLowerCase()).toBe('#ff9999')
      expect(tint4.toLowerCase()).toBe('#ffcccc')
    })
  })

  describe('shade function', () => {
    it('should darken a color by the correct amount', () => {
      // White to black shading
      const white = '#ffffff'
      expect(shade(white, 0, 4)).toMatch(/^#[0-9a-f]{6}$/i) // Should be a valid hex color
      expect(shade(white, 0, 4)).not.toBe(white) // Should not be the same color
      
      // Verify shade progression
      const color = '#ff0000' // Red
      const shade1 = shade(color, 0, 4) // 20% shade
      const shade2 = shade(color, 1, 4) // 40% shade
      const shade3 = shade(color, 2, 4) // 60% shade
      const shade4 = shade(color, 3, 4) // 80% shade
      
      // Each shade should be darker than the previous one
      expect(shade1.toLowerCase()).toBe('#cc0000')
      expect(shade2.toLowerCase()).toBe('#990000')
      expect(shade3.toLowerCase()).toBe('#660000')
      expect(shade4.toLowerCase()).toBe('#330000')
    })
  })
}) 