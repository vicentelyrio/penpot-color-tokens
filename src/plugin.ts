import { MESSAGES } from '@consts/messages'
import {
  handleAddColorMessage,
  handleAddColorPaletteMessage,
  handleSavePalettesMessage,
} from '@utils/messages'

penpot.ui.open('Penpot Color Tokens', `./index.html?theme=${penpot.theme}`, {
  width: 760,
  height: 600,
})

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({
    type: MESSAGES.THEME,
    content: theme
  })
})

// Handle UI messages
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
  }
})

export {}
