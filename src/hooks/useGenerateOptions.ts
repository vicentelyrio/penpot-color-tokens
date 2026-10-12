import { useState } from 'preact/hooks'

import { LIBRARY_NAME } from '@consts/config'

export function useGenerateOptions() {
  const [delimiter, setDelimiter] = useState<Delimiter>('.')
  const [libraryMode, setLibraryMode] = useState(true)
  const [jsonMode, setJsonMode] = useState(true)
  const [visualPaletteMode, setVisualPaletteMode] = useState(true)
  const [tokensMode, setTokensMode] = useState(false)
  const [targetSet, setTargetSet] = useState('')
  const [newSetName, setNewSetName] = useState(LIBRARY_NAME)

  return {
    libraryMode,
    jsonMode,
    visualPaletteMode,
    tokensMode,
    targetSet,
    newSetName,
    delimiter,
    setLibraryMode,
    setJsonMode,
    setVisualPaletteMode,
    setTokensMode,
    setTargetSet,
    setNewSetName,
    setDelimiter,
  }
}
