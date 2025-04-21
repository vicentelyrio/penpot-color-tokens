import { LIBRARY_NAME } from '@consts/config'
import { colorExists, addToColorCache } from '@utils/colorCache'

export interface PenpotLibrary {
  createColor: () => PenpotColor
  getColors: () => PenpotColor[]
}

export interface PenpotColor {
  id: string
  name: string
  color: string
  opacity: number
  path: string
}

export function addColorToLibrary(
  library: PenpotLibrary,
  name: string,
  color: string,
  path: string = LIBRARY_NAME
): ResultItem {
  if (colorExists(library, name, path)) {
    return {
      name,
      success: true,
      skipped: true,
      message: "Color with this name already exists in this path"
    }
  }

  try {
    const newColor = library.createColor()

    newColor.name = name
    newColor.color = color
    newColor.opacity = 1
    newColor.path = path

    addToColorCache(name, path)

    return {
      name,
      success: true,
      colorId: newColor.id
    }
  } catch (error) {
    return {
      name,
      success: false,
      error: (error as Error)?.message
    }
  }
}

export function isLibraryAvailable(): boolean {
  return !!(penpot.library && penpot.library.local)
}

export function getLocalLibrary(): PenpotLibrary {
  if (!isLibraryAvailable()) {
    throw new Error("Library API not available")
  }
  return penpot.library.local as unknown as PenpotLibrary
}
