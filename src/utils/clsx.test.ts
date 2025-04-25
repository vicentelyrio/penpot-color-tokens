import { describe, it, expect } from 'vitest'
import { clsx } from './clsx'

describe('clsx utility', () => {
  it('should join class names with spaces', () => {
    expect(clsx(['class1', 'class2'])).toBe('class1 class2')
  })

  it('should handle empty array', () => {
    expect(clsx([])).toBe('')
  })

  it('should handle single class name', () => {
    expect(clsx(['class1'])).toBe('class1')
  })

  it('should handle multiple class names', () => {
    expect(clsx(['class1', 'class2', 'class3'])).toBe('class1 class2 class3')
  })
}) 