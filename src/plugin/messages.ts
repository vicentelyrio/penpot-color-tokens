import { generateColorLibrary } from '@plugin/generateColorLibrary'
import { generateComponents } from '@plugin/generateComponents'
import { generateJson } from '@plugin/generateJson'
import { generateTokens, getTokenSets } from '@plugin/generateTokens'

import { MESSAGES } from '@consts/messages'

export function handleColorLibraryMessage(message: Message): void {
  if (!message.tokens) return

  generateColorLibrary(message.tokens)
    .then(result => {
      penpot.ui.sendMessage({
        type: MESSAGES.COLOR_LIBRARY_GENERATED,
        success: result.success,
        message: result.message,
        results: result.results
      })
    })
    .catch(error => {
      penpot.ui.sendMessage({
        type: MESSAGES.COLOR_LIBRARY_GENERATED,
        success: false,
        message: 'Error: ' + (error as Error).message
      })
    })
}

export function handleGenerateJsonMessage(message: Message): void {
  if (!message.tokens) return

  generateJson(message.tokens)
    .then(result => {
      penpot.ui.sendMessage({
        type: MESSAGES.JSON_GENERATED,
        success: result.success,
        message: result.message,
        jsonData: result.result
      })
    })
    .catch(error => {
      penpot.ui.sendMessage({
        type: MESSAGES.JSON_GENERATED,
        success: false,
        message: 'Error: ' + (error as Error).message
      })
    })
}

export function handleGenerateComponentsMessage(message: Message): void {
  if (!message.tokens) return

  generateComponents(message.tokens)
    .then(result => {
      penpot.ui.sendMessage({
        type: MESSAGES.COMPONENTS_GENERATED,
        success: result.success,
        message: result.message
      })
    })
    .catch(error => {
      penpot.ui.sendMessage({
        type: MESSAGES.COMPONENTS_GENERATED,
        success: false,
        message: 'Error: ' + (error as Error).message
      })
    })
}

export function handleGetTokenSetsMessage(): void {
  try {
    penpot.ui.sendMessage({
      type: MESSAGES.TOKEN_SETS,
      ...getTokenSets()
    })
  }
  catch (error) {
    penpot.ui.sendMessage({
      type: MESSAGES.TOKEN_SETS,
      available: false,
      sets: [],
      message: 'Error: ' + (error as Error).message
    })
  }
}

export function handleGenerateTokensMessage(message: Message): void {
  if (!message.tokens) return

  generateTokens(message.tokens, message.setId, message.newSetName)
    .then(result => {
      penpot.ui.sendMessage({
        type: MESSAGES.TOKENS_GENERATED,
        success: result.success,
        message: result.message,
        results: result.results
      })
    })
    .catch(error => {
      penpot.ui.sendMessage({
        type: MESSAGES.TOKENS_GENERATED,
        success: false,
        message: 'Error: ' + (error as Error).message
      })
    })
}
