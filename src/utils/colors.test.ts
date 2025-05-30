import { describe, it, expect } from 'vitest'
import { tint, shade } from './colors'

describe('color utilities', () => {
  describe('tint function', () => {
    it('should lighten a color by the correct amount', () => {
      const black = '#000000'
      expect(tint(black, 0, 4)).toMatch(/^#[0-9a-f]{6}$/i)
      expect(tint(black, 0, 4)).not.toBe(black)

      const color = '#ff0000' // Red
      const tint1 = tint(color, 0, 4) // 20% tint
      const tint2 = tint(color, 1, 4) // 40% tint
      const tint3 = tint(color, 2, 4) // 60% tint
      const tint4 = tint(color, 3, 4) // 80% tint

      expect(tint1.toLowerCase()).toBe('#fd3a3b')
      expect(tint2.toLowerCase()).toBe('#fc6666')
      expect(tint3.toLowerCase()).toBe('#fb8d8d')
      expect(tint4.toLowerCase()).toBe('#fab1b2')
    })
  })

  describe('shade function', () => {
    it('should darken a color by the correct amount', () => {
      const white = '#ffffff'
      expect(shade(white, 0, 4)).toMatch(/^#[0-9a-f]{6}$/i)
      expect(shade(white, 0, 4)).not.toBe(white)

      const color = '#ff0000'
      const shade1 = shade(color, 0, 4) // 20% shade
      const shade2 = shade(color, 1, 4) // 40% shade
      const shade3 = shade(color, 2, 4) // 60% shade
      const shade4 = shade(color, 3, 4) // 80% shade

      expect(shade1.toLowerCase()).toBe('#d20000')
      expect(shade2.toLowerCase()).toBe('#ab0000')
      expect(shade3.toLowerCase()).toBe('#860000')
      expect(shade4.toLowerCase()).toBe('#630000')
    })
  })
})
