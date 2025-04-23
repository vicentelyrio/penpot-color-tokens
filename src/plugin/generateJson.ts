export async function generateJson(tokenColors: Record<string, ColorToken>): Promise<ExportResult> {
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
        message: 'No valid colors found in the tokens data'
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
      message: 'Failed to export as JSON: ' + (error as Error).message
    }
  }
}
