import { MESSAGES } from '@consts/messages'
import {
  handleAddColorMessage,
  handleAddColorPaletteMessage,
  handleSavePalettesMessage,
  handleExportAsJsonMessage,
  handleGenerateVisualPaletteMessage,
} from '@plugin/messages'

penpot.ui.open('Penpot Color Tokens', `./index.html?theme=${penpot.theme}`, {
  width: 900,
  height: 600,
})

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({
    type: MESSAGES.THEME,
    content: theme
  })
})

penpot.ui.onMessage((message: Message) => {
  switch (message.type) {
    case MESSAGES.ADD_COLOR:
      handleAddColorMessage(message)
      break

    case MESSAGES.ADD_COLOR_PALETTE:
      handleAddColorPaletteMessage(message)
      break

    case MESSAGES.SAVE_PALETTES:
      handleSavePalettesMessage(message)
      break

    case MESSAGES.EXPORT_AS_JSON:
      handleExportAsJsonMessage(message)
      break

    case MESSAGES.GENERATE_VISUAL_PALETTE:
      handleGenerateVisualPaletteMessage(message)
      break
  }
})

export {}
