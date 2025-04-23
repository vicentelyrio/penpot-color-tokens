import { addColorToLibrary, getLocalLibrary } from '@plugin/libraryService'
import { generateColorPalette } from '@plugin/colorPalette'
import { exportAsJson, generateVisualPalette } from '@plugin/exportService'
import { MESSAGES } from '@consts/messages'

export function handleAddColorMessage(message: Message): void {
  if (!message.name || !message.color) {
    penpot.ui.sendMessage({
      type: MESSAGES.COLOR_ADDED,
      success: false,
      error: "Missing required parameters: name or color"
    })
    return
  }

  try {
    const localLibrary = getLocalLibrary()
    const result = addColorToLibrary(localLibrary, message.name, message.color)

    penpot.ui.sendMessage({
      type: MESSAGES.COLOR_ADDED,
      ...result
    })
  }
  catch (error) {
    penpot.ui.sendMessage({
      type: MESSAGES.COLOR_ADDED,
      success: false,
      error: (error as Error)?.message
    })
  }
}

export function handleAddColorPaletteMessage(message: Message): void {
  if (!message.colors || !Array.isArray(message.colors)) {
    penpot.ui.sendMessage({
      type: MESSAGES.PALETTE_ADDED,
      success: false,
      error: "Missing or invalid colors parameter",
      results: []
    })
    return
  }

  try {
    const localLibrary = getLocalLibrary()
    const results = []

    for (const color of message.colors) {
      const tokenPath = color.path
      const result = addColorToLibrary(localLibrary, color.name, color.value, tokenPath)
      results.push(result)
    }

    penpot.ui.sendMessage({
      type: MESSAGES.PALETTE_ADDED,
      results
    })
  }
  catch (error) {
    penpot.ui.sendMessage({
      type: MESSAGES.PALETTE_ADDED,
      success: false,
      error: (error as Error)?.message,
      results: []
    })
  }
}

export function handleSavePalettesMessage(message: Message): void {
  if (!message.tokens) return

  generateColorPalette(message.tokens)
    .then(result => {
      penpot.ui.sendMessage({
        type: MESSAGES.PALETTE_GENERATED,
        success: result.success,
        message: result.message,
        results: result.results
      })
    })
    .catch(error => {
      penpot.ui.sendMessage({
        type: MESSAGES.PALETTE_GENERATED,
        success: false,
        message: "Error: " + (error as Error).message
      })
    })
}

export function handleExportAsJsonMessage(message: Message): void {
  if (!message.tokens) return

  exportAsJson(message.tokens)
    .then(result => {
      penpot.ui.sendMessage({
        type: MESSAGES.JSON_EXPORTED,
        success: result.success,
        message: result.message,
        jsonData: result.result
      })
    })
    .catch(error => {
      penpot.ui.sendMessage({
        type: MESSAGES.JSON_EXPORTED,
        success: false,
        message: "Error: " + (error as Error).message
      })
    })
}

export function handleGenerateVisualPaletteMessage(message: Message): void {
  if (!message.tokens) return

  generateVisualPalette(message.tokens)
    .then(result => {
      penpot.ui.sendMessage({
        type: MESSAGES.VISUAL_PALETTE_GENERATED,
        success: result.success,
        message: result.message
      })
    })
    .catch(error => {
      penpot.ui.sendMessage({
        type: MESSAGES.VISUAL_PALETTE_GENERATED,
        success: false,
        message: "Error: " + (error as Error).message
      })
    })
}
