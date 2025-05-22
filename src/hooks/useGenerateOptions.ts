import { useState } from 'preact/hooks'

export function useGenerateOptions() {
  const [delimiter, setDelimiter] = useState<Delimiter>('.')
  const [libraryMode, setLibraryMode] = useState(true)
  const [jsonMode, setJsonMode] = useState(true)
  const [visualPaletteMode, setVisualPaletteMode] = useState(true)

  return {
    libraryMode,
    jsonMode,
    visualPaletteMode,
    delimiter,
    setLibraryMode,
    setJsonMode,
    setVisualPaletteMode,
    setDelimiter,
  }
}
