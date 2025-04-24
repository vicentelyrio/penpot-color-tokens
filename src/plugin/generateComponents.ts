import { getBrightness } from '@utils/colorBrightness'

function createColorRectangle(
  name: string,
  color: string,
  x: number,
  y: number,
  width: number,
  height: number) {

  const elements = []

  const rectangle = penpot.createRectangle()

  const padding = 10

  if (rectangle) {
    rectangle.resize(width, height)
    rectangle.name = name
    rectangle.x = x
    rectangle.y = y
    rectangle.fills = [{ fillOpacity: 1, fillColor: color }]
    elements.push(rectangle)

    const textColor = getBrightness(color) > 128 ? '#000000' : '#FFFFFF'
    const nameText = penpot.createText(name)

    if (nameText) {
      nameText.name = `${name}-label`
      nameText.fontSize = '11'
      nameText.x = x + padding
      nameText.y = y + padding
      nameText.fills = [{ fillOpacity: 1, fillColor: textColor }]
      elements.push(nameText)
    }

    // Create hex text below
    const hexText = penpot.createText(color.toUpperCase())
    if (hexText) {
      hexText.name = `${name}-hex`
      hexText.fontSize = '11'
      hexText.x = x + padding
      hexText.y = y + padding + 20
      hexText.fills = [{ fillOpacity: 1, fillColor: textColor }]
      elements.push(hexText)
    }
  }

  return elements
}

function getBaseColorName(colorName: string): string {
  const match = colorName.match(/^([a-zA-Z-]+?)[-/]?[0-9]+/)
    || colorName.match(/^([a-zA-Z-]+?)[-/]?(light|dark|lightest|darkest|lighter|darker)/)
    || [null, colorName]

  return match ? match[1] : colorName
}

// Main function to generate components
export async function generateComponents(tokenColors: Record<string, ColorToken>): Promise<ExportResult> {
  const SWATCH_SIZE = 120
  const PADDING = 20
  const GAP = 0
  const VERTICAL_GAP = 0

  try {
    // Extract colors from tokens
    const colors = Object.entries(tokenColors)
      .filter(([_, data]) => data.$type === 'color')
      .map(([name, data]) => ({
        name,
        color: data.$value,
        baseColorName: getBaseColorName(name)
      }))

    if (colors.length === 0) {
      return {
        success: false,
        message: 'No valid colors found in the tokens data'
      }
    }

    // Group colors by their base color name
    const colorGroups: Record<string, Array<{name: string, color: string}>> = {}

    colors.forEach(color => {
      if (!colorGroups[color.baseColorName]) {
        colorGroups[color.baseColorName] = []
      }
      colorGroups[color.baseColorName].push({
        name: color.name,
        color: color.color
      })
    })

    // Sort colors within each group (e.g., by shade value)
    Object.keys(colorGroups).forEach(groupName => {
      colorGroups[groupName].sort((a, b) => {
        // Extract numbers from color names if they exist (e.g., primary-500 -> 500)
        const numA = parseInt((a.name.match(/\d+/) || ['0'])[0])
        const numB = parseInt((b.name.match(/\d+/) || ['0'])[0])
        return numA - numB
      })
    })

    const colorComponents: any[] = []
    let currentY = PADDING

    // Create a row for each color group
    Object.entries(colorGroups).forEach(([groupName, groupColors]) => {
      const rowElements: any[] = []

      groupColors.forEach((color, index) => {
        const x = PADDING + index * (SWATCH_SIZE + GAP)

        const elements = createColorRectangle(
          color.name,
          color.color,
          x,
          currentY,
          SWATCH_SIZE,
          SWATCH_SIZE
        )

        rowElements.push(...elements)
      })

      // Group the row elements
      const groupRow = penpot.group(rowElements)
      if (groupRow) {
        groupRow.name = `Color Set: ${groupName}`
        colorComponents.push(groupRow)
      }

      // Move to the next row
      currentY += SWATCH_SIZE + VERTICAL_GAP
    })

    // Group all color components
    if (colorComponents.length > 0) {
      const palette = penpot.group(colorComponents)

      if (palette) {
        palette.name = 'Color Palette'
        penpot.selection = [palette]
      }

      return {
        success: true,
        message: `Created visual palette with ${Object.keys(colorGroups).length} color sets.`
      }
    }

    return {
      success: false,
      message: 'Failed to create any visual components.'
    }
  }
  catch (error) {
    return {
      success: false,
      message: 'Failed to create visual palette: ' + (error as Error).message
    }
  }
}
