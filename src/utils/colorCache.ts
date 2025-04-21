interface ColorLibrary {
  getColors: () => Array<{ name: string; path?: string }>
}

const colorCache: Record<string, boolean> = {}

export function colorExists(library: ColorLibrary, name: string, path?: string): boolean {
  const normalizedName = name.toLowerCase()
  const cacheKey = path ? `${path}/${normalizedName}` : normalizedName
  
  if (colorCache[cacheKey]) {
    return true
  }

  try {
    const colors = library.getColors()

    if (!colors || !Array.isArray(colors)) {
      return false
    }

    const exists = colors.some((color) => {
      if (!color || typeof color.name !== 'string') {
        return false
      }
      
      const nameMatch = color.name.toLowerCase() === normalizedName
      
      if (path && color.path) {
        return nameMatch && color.path === path
      }
      
      return nameMatch
    })

    return exists
  } catch (error) {
    return false
  }
}

export function addToColorCache(name: string, path?: string): void {
  const normalizedName = name.toLowerCase()
  const cacheKey = path ? `${path}/${normalizedName}` : normalizedName
  colorCache[cacheKey] = true
}
