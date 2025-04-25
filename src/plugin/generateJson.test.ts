import { describe, it, expect } from 'vitest'
import { generateJson } from './generateJson'

describe('generateJson', () => {
  it('should successfully generate JSON for valid color tokens', async () => {
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

    const result = await generateJson(mockTokens)
    expect(result.success).toBe(true)
    expect(result.message).toContain('Successfully exported 2 colors')
    expect(result.result).toBe(JSON.stringify(mockTokens, null, 2))
  })

  it('should handle empty token data', async () => {
    const result = await generateJson({})
    expect(result.success).toBe(false)
    expect(result.message).toBe('No valid colors found in the tokens data')
  })

  it('should handle non-color tokens', async () => {
    const mockTokens = {
      spacing: {
        $type: 'dimension',
        $value: '16px'
      }
    }

    const result = await generateJson(mockTokens)
    expect(result.success).toBe(false)
    expect(result.message).toBe('No valid colors found in the tokens data')
  })

  it('should handle invalid token data', async () => {
    const result = await generateJson(null as any)
    expect(result.success).toBe(false)
    expect(result.message).toContain('Failed to export as JSON')
  })
}) 