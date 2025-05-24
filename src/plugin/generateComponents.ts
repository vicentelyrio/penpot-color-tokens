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

function getBaseColorName(colorName: string) {
  const match = colorName.match(/^(.*?)(?:[-.](pale|shade))?[-.]\d+$/) || [null, colorName]
  return match[1]
}

function getColorTone(colorName: string) {
  if (colorName.includes('pale')) return 'pale'
  if (colorName.includes('shade')) return 'shade'
  return 'base'
}

export async function generateComponents(
  tokenColors: Record<string, ColorToken>
): Promise<ExportResult> {
  const SWATCH_WIDTH = 180
  const SWATCH_HEIGHT = 60
  const PADDING = 20
  const HORIZONTAL_GAP = 0
  const VERTICAL_GAP = 0

  try {
    const colors = Object.entries(tokenColors)
      .filter(([_, data]) => data.$type === 'color')
      .map(([name, data]) => ({
        name,
        color: data.$value,
        baseColorName: getBaseColorName(name),
        type: getColorTone(name)
      }))

    if (colors.length === 0) {
      return {
        success: false,
        message: 'No valid colors found in the tokens data'
      }
    }

    const colorGroups: Record<string, Array<{name: string, color: string, type: string}>> = {}

    colors.forEach(color => {
      if (!colorGroups[color.baseColorName]) {
        colorGroups[color.baseColorName] = []
      }
      colorGroups[color.baseColorName].push({
        name: color.name,
        color: color.color,
        type: color.type
      })
    })

    const colorComponents: any[] = []
    let currentX = PADDING

    Object.entries(colorGroups).forEach(([groupName, groupColors]) => {
      groupColors.sort((a, b) => {
        const numA = parseInt((a.name.match(/\d+/) || ['500'])[0])
        const numB = parseInt((b.name.match(/\d+/) || ['500'])[0])

        if (a.type !== b.type) {
          if (a.type === 'base') return 0
          if (b.type === 'base') return -1
          if (a.type === 'pale') return -1
          return 1
        }

        if (a.type === 'pale') return numA - numB
        return numA - numB
      })

      const totalHeight = groupColors.length * (SWATCH_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP
      const startY = PADDING + (totalHeight / 2) - (groupColors.length * (SWATCH_HEIGHT + VERTICAL_GAP)) / 2

      const columnElements: any[] = []

      groupColors.forEach((color, index) => {
        const y = startY + index * (SWATCH_HEIGHT + VERTICAL_GAP)

        const elements = createColorRectangle(
          color.name,
          color.color,
          currentX,
          y,
          SWATCH_WIDTH,
          SWATCH_HEIGHT
        )

        columnElements.push(...elements)
      })

      const groupColumn = penpot.group(columnElements)
      if (groupColumn) {
        groupColumn.name = `Color Set: ${groupName}`
        colorComponents.push(groupColumn)
      }

      currentX += SWATCH_WIDTH + HORIZONTAL_GAP
    })

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
