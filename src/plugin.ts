import { MESSAGES } from '@consts/messages'
import { LIBRARY_NAME } from '@consts/config'

import {
  handleColorLibraryMessage,
  handleGenerateComponentsMessage,
  handleGenerateJsonMessage,
} from '@plugin/messages'

penpot.ui.open(LIBRARY_NAME, `./index.html?theme=${penpot.theme}`, {
  width: 960,
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
    case MESSAGES.GENERATE_COLOR_LIBRARY:
      handleColorLibraryMessage(message)
      break

    case MESSAGES.GENERATE_JSON:
      handleGenerateJsonMessage(message)
      break

    case MESSAGES.GENERATE_COMPONENTS:
      handleGenerateComponentsMessage(message)
      break
  }
})

export {}
