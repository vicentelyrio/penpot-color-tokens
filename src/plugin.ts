penpot.ui.open('Color Palette Generator', `./index.html?theme=${penpot.theme}`, {
  width: 760,
  height: 600,
})

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({
    type: 'theme',
    content: theme
  })
})

function addColorToPenpot(colorName: string, colorValue: string) {
  try {
    const localLibrary = penpot.library.local
    const newColor = localLibrary.createColor()

    newColor.name = colorName
    newColor.color = colorValue
    newColor.opacity = 1

    return { success: true, colorId: newColor.id }
  } catch (error: unknown) {
    return { success: false, error: (error as Error)?.message }
  }
}

type Message = {
  type: string
  name: string
  color: string
  colors: Array<{ name: string; value: string; }>
}

penpot.ui.onMessage((message: Message) => {
  console.log('Message received from UI:', message)

  if (message.type === 'addColor') {
    const result = addColorToPenpot(message.name, message.color)
    penpot.ui.sendMessage({
      type: 'colorAdded',
      success: result.success,
      colorId: result.colorId,
      error: result.error
    })
  }

  if (message.type === 'addColorPalette') {
    const results = []

    for (const color of message.colors) {
      const result = addColorToPenpot(color.name, color.value)

      results.push({
        name: color.name,
        success: result.success,
        colorId: result.colorId,
        error: result.error
      })
    }

    penpot.ui.sendMessage({
      type: 'paletteAdded',
      results
    })
  }
})

export {}
