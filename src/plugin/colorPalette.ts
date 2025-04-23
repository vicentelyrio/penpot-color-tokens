import { addToLibrary } from '@plugin/exportService'

export async function generateColorPalette(
  tokenColors: Record<string, ColorToken>
): Promise<GenerationResult> {
  return addToLibrary(tokenColors);
}
