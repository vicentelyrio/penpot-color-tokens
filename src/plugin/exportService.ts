import { getLocalLibrary, addColorToLibrary } from '@plugin/libraryService'
import { LIBRARY_NAME } from '@consts/config'

export async function exportAsJson(
  tokenColors: Record<string, ColorToken>
): Promise<ExportResult> {
  try {
    const colors = Object.entries(tokenColors)
      .filter(([_, data]) => data.$type === 'color')
      .map(([name, data]) => ({
        name,
        value: data.$value
      }))

    if (colors.length === 0) {
      return {
        success: false,
        message: "No valid colors found in the tokens data"
      }
    }

    const jsonString = JSON.stringify(tokenColors, null, 2)

    return {
      success: true,
      message: `Successfully exported ${colors.length} colors as JSON.`,
      result: jsonString
    }
  }
  catch (error) {
    return {
      success: false,
      message: "Failed to export as JSON: " + (error as Error).message
    }
  }
}

export async function generateVisualPalette(
  _tokenColors: Record<string, ColorToken>
): Promise<ExportResult> {
  return {
    success: false,
    message: "Visual palette generation not implemented yet."
  }
}

export async function addToLibrary(
  tokenColors: Record<string, ColorToken>
): Promise<GenerationResult> {
  try {
    const colors = Object.entries(tokenColors)
      .filter(([_, data]) => data.$type === 'color')
      .map(([name, data]) => {
        const isNested = name.includes('.') || name.includes('/')
        let tokenName = name
        let tokenPath = LIBRARY_NAME

        if (isNested) {
          const parts = name.split(/[./]/)
          tokenName = parts.pop() || name
          if (parts.length > 0) {
            tokenPath = `${LIBRARY_NAME}/${parts.join('/')}`
          }
        }

        return {
          name: tokenName,
          color: data.$value,
          path: tokenPath
        }
      })

    if (colors.length === 0) {
      return {
        success: false,
        message: "No valid colors found in the tokens data"
      }
    }

    try {
      const localLibrary = getLocalLibrary()
      const results = colors.map(({name, color, path}) => {
        return addColorToLibrary(localLibrary, name, color, path)
      })

      return {
        success: true,
        message: `Processed ${colors.length} colors.`,
        results
      }
    }
    catch (error) {
      return {
        success: false,
        message: "Error accessing Penpot API: " + (error as Error).message
      }
    }
  }
  catch (error) {
    return {
      success: false,
      message: "Failed to process palette: " + (error as Error).message
    }
  }
}
