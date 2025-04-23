import { useState } from 'preact/hooks'

export function useGenerateOptions() {
  const [libraryMode, setLibraryMode] = useState(true)
  const [jsonMode, setJsonMode] = useState(true)
  const [visualPaletteMode, setVisualPaletteMode] = useState(true)

  return {
    libraryMode,
    jsonMode,
    visualPaletteMode,
    setLibraryMode,
    setJsonMode,
    setVisualPaletteMode,
  }
}
