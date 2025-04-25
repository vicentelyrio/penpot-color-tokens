import { describe, it, expect, vi } from 'vitest'
import { downloadJsonFile } from './downloadJson'

describe('downloadJson utility', () => {
  let mockLink: HTMLAnchorElement
  let mockURL: typeof URL

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: vi.fn()
    } as unknown as HTMLAnchorElement

    mockURL = {
      createObjectURL: vi.fn().mockReturnValue('mock-url'),
      revokeObjectURL: vi.fn()
    } as unknown as typeof URL

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink)
    vi.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => node)
    vi.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => node)
    
    // @ts-ignore
    global.URL = mockURL
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create and trigger download of JSON file', () => {
    const jsonData = JSON.stringify({ test: 'data' })
    downloadJsonFile(jsonData)

    // Verify Blob creation
    expect(mockURL.createObjectURL).toHaveBeenCalledWith(
      expect.any(Blob)
    )

    // Verify link properties and actions
    expect(mockLink.href).toBe('mock-url')
    expect(mockLink.download).toBe('color-tokens.json')
    expect(mockLink.click).toHaveBeenCalled()

    // Verify DOM operations
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink)

    // Verify URL cleanup
    expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('mock-url')
  })
}) 