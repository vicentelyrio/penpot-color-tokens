import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateTokens, getTokenSets } from './generateTokens'
import { getTokenCatalog, isTokenApiAvailable } from './tokenService'

vi.mock('./tokenService', () => ({
  getTokenCatalog: vi.fn(),
  isTokenApiAvailable: vi.fn()
}))

type MockToken = { id: string; name: string; type: string; value: string }

function makeSet(id: string, name: string, tokens: MockToken[] = []) {
  const set = {
    id,
    name,
    active: true,
    tokens,
    addToken: vi.fn(({ type, name, value }) => {
      const token = { id: `new-${name}`, type, name, value }
      set.tokens.push(token)
      return token
    })
  }
  return set
}

describe('generateTokens', () => {
  const colors = {
    'primary.pale.100': { $type: 'color', $value: '#112233' },
    'primary.shade.100': { $type: 'color', $value: '#445566' }
  }

  let templateSet: ReturnType<typeof makeSet>
  let otherSet: ReturnType<typeof makeSet>
  let catalog: any

  beforeEach(() => {
    vi.clearAllMocks()

    templateSet = makeSet('set-1', 'color', [
      { id: 't1', name: 'primary.pale.100', type: 'color', value: '#000000' },
      { id: 't2', name: 'spacing.sm', type: 'spacing', value: '4' }
    ])
    otherSet = makeSet('set-2', 'global', [
      { id: 't3', name: 'primary.pale.100', type: 'color', value: '#abcdef' }
    ])

    catalog = {
      sets: [templateSet, otherSet],
      getSetById: vi.fn((id: string) => catalog.sets.find((s: any) => s.id === id)),
      addSet: vi.fn(({ name, active }) => {
        const set = makeSet(`new-set`, name)
        set.active = !!active
        catalog.sets.push(set)
        return set
      })
    }

    ;(getTokenCatalog as any).mockReturnValue(catalog)
    ;(isTokenApiAvailable as any).mockReturnValue(true)
  })

  it('updates existing tokens in place and creates missing ones', async () => {
    const result = await generateTokens(colors, 'set-1')

    expect(result.success).toBe(true)
    expect(templateSet.tokens.find(t => t.id === 't1')?.value).toBe('#112233')
    expect(templateSet.addToken).toHaveBeenCalledTimes(1)
    expect(templateSet.addToken).toHaveBeenCalledWith({
      type: 'color',
      name: 'primary.shade.100',
      value: '#445566'
    })
    expect(result.results?.filter(r => r.updated)).toHaveLength(1)
  })

  it('leaves unrelated tokens and other sets untouched', async () => {
    await generateTokens(colors, 'set-1')

    expect(templateSet.tokens.find(t => t.id === 't2')?.value).toBe('4')
    expect(otherSet.tokens[0].value).toBe('#abcdef')
    expect(otherSet.addToken).not.toHaveBeenCalled()
  })

  it('reports unchanged values as skipped (case-insensitive)', async () => {
    templateSet.tokens[0].value = '#112233'
    const result = await generateTokens(
      { 'primary.pale.100': { $type: 'color', $value: '#112233' } },
      'set-1'
    )

    expect(result.results?.[0]).toMatchObject({ success: true, skipped: true })
  })

  it('fails (without retyping) when an existing token has another type', async () => {
    const result = await generateTokens(
      { 'spacing.sm': { $type: 'color', $value: '#ffffff' } },
      'set-1'
    )

    expect(result.results?.[0].success).toBe(false)
    expect(templateSet.tokens.find(t => t.id === 't2')).toMatchObject({ type: 'spacing', value: '4' })
  })

  it('continues after a single token failure', async () => {
    templateSet.addToken.mockImplementationOnce(() => { throw new Error('boom') })
    const result = await generateTokens(
      {
        a: { $type: 'color', $value: '#000001' },
        b: { $type: 'color', $value: '#000002' }
      },
      'set-1'
    )

    expect(result.results?.map(r => r.success)).toEqual([false, true])
  })

  it('creates a new active set when no setId is given', async () => {
    const result = await generateTokens(colors, null, 'Brand')

    expect(catalog.addSet).toHaveBeenCalledWith({ name: 'Brand', active: true })
    expect(result.success).toBe(true)
    expect(result.results?.every(r => r.success && !r.updated && !r.skipped)).toBe(true)
  })

  it('reuses an existing set with the same name instead of duplicating it', async () => {
    await generateTokens(colors, null, 'global')

    expect(catalog.addSet).not.toHaveBeenCalled()
    expect(otherSet.addToken).toHaveBeenCalled()
  })

  describe('refreshing the set', () => {
    function trackActive(set: ReturnType<typeof makeSet>, initial: boolean) {
      const changes: boolean[] = []
      let value = initial
      Object.defineProperty(set, 'active', {
        get: () => value,
        set: (next: boolean) => { value = next; changes.push(next) }
      })
      return changes
    }

    it('switches an active set off and on again after changes', async () => {
      const changes = trackActive(templateSet, true)

      const result = await generateTokens(colors, 'set-1')

      expect(changes).toEqual([false, true])
      expect(result.message).toContain('re-activated')
    })

    it('leaves an inactive set inactive', async () => {
      const changes = trackActive(templateSet, false)

      await generateTokens(colors, 'set-1')

      expect(changes).toEqual([])
    })

    it('does not toggle when nothing changed', async () => {
      const changes = trackActive(templateSet, true)
      templateSet.tokens[0].value = '#112233'
      templateSet.tokens.push({ id: 't4', name: 'primary.shade.100', type: 'color', value: '#445566' })

      await generateTokens(colors, 'set-1')

      expect(changes).toEqual([])
    })

    it('keeps the run successful if the refresh throws', async () => {
      let value = true
      Object.defineProperty(templateSet, 'active', {
        get: () => value,
        set: (next: boolean) => {
          if (next === false) throw new Error('nope')
          value = next
        }
      })

      const result = await generateTokens(colors, 'set-1')

      expect(result.success).toBe(true)
      expect(value).toBe(true)
    })
  })

  it('fails when the selected set no longer exists', async () => {
    const result = await generateTokens(colors, 'missing')

    expect(result.success).toBe(false)
    expect(result.message).toContain('no longer exists')
  })

  it('fails when there are no color tokens', async () => {
    const result = await generateTokens({ x: { $type: 'spacing', $value: '4' } }, 'set-1')

    expect(result.success).toBe(false)
  })

  it('fails gracefully when the tokens API is missing', async () => {
    ;(getTokenCatalog as any).mockImplementation(() => {
      throw new Error('Tokens API not available (requires Penpot 2.14+)')
    })

    const result = await generateTokens(colors, 'set-1')

    expect(result.success).toBe(false)
    expect(result.message).toContain('2.14')
  })
})

describe('getTokenSets', () => {
  it('returns unavailable when the API is missing', () => {
    ;(isTokenApiAvailable as any).mockReturnValue(false)

    expect(getTokenSets()).toEqual({ available: false, sets: [] })
  })

  it('maps catalog sets to id, name and active', () => {
    ;(isTokenApiAvailable as any).mockReturnValue(true)
    ;(getTokenCatalog as any).mockReturnValue({
      sets: [{ id: 'a', name: 'color', active: true, tokens: [] }]
    })

    expect(getTokenSets()).toEqual({
      available: true,
      sets: [{ id: 'a', name: 'color', active: true }]
    })
  })
})
