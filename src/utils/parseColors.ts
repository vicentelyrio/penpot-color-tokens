export function parseColors(
  palettes: Palette[],
  tints: boolean,
  shades: boolean,
  delimiter: Delimiter
) {
  return palettes.reduce<Record<string, ColorToken>>((acc, palette) => {
    const baseColorIndex = palette.colors.findIndex(c => c === palette.color)
    let paletteObj: Record<string, ColorToken> = {}

    palette.colors.forEach((color, i) => {
      if (tints && shades) {
        if (i <= baseColorIndex) {
          const step = (i + 1) * 100
          const key = `${palette.name}${delimiter}pale${delimiter}${step}`
          paletteObj[key] = {
            $type: 'color',
            $value: color
          }
        }

        if (i >= baseColorIndex) {
          const step = (i - baseColorIndex + 1) * 100
          const key = `${palette.name}${delimiter}shade${delimiter}${step}`
          paletteObj[key] = {
            $type: 'color',
            $value: color
          }
        }
      }
      else {
        const step = (i + 1) * 100
        const key = `${palette.name}${delimiter}${step}`
        paletteObj[key] = {
          $type: 'color',
          $value: color
        }
      }
    })

    return {
      ...acc,
      ...paletteObj
    }
  }, {})
}
