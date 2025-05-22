import { useEffect } from 'preact/hooks'

import { Actions } from '@components/actions/actions'
import { Colors } from '@components/colors/colors'
import { Toaster } from '@components/toaster/toaster'
import { Footer } from '@components/footer/footer'

import { useToaster } from '@hooks/useToaster'
import { usePaletteOptions } from '@hooks/usePaletteOptions'
import { usePalette } from '@hooks/usePalette'
import { useGenerateOptions } from '@hooks/useGenerateOptions'
import { useGenerate } from '@hooks/useGenerate'

import classes from './app.module.css'

export function App() {
  const {
    steps,
    tints,
    shades,
    setSteps,
    setTints,
    setShades,
  } = usePaletteOptions()

  const {
    palettes,
    onAddPalette,
    onRemovePalette,
    onSetPalette,
  } = usePalette({ steps, tints, shades })

  const {
    libraryMode,
    jsonMode,
    visualPaletteMode,
    delimiter,
    setLibraryMode,
    setJsonMode,
    setVisualPaletteMode,
    setDelimiter,
  } = useGenerateOptions()

  const {
    isGenerating,
    isExporting,
    isCreating,
    generationResult,
    exportResult,
    onGeneratePalettes,
  } = useGenerate({
    palettes,
    shades,
    tints,
    jsonMode,
    libraryMode,
    delimiter,
    visualPaletteMode
  })

  const { toasts, showToast, removeToast } = useToaster()

  useEffect(() => {
    if (!isGenerating && generationResult) {
      const { success, stats } = generationResult
      const { failed, skipped } = stats ?? {}

      showToast(
        generationResult.message,
        !success || failed ? 'error' : (skipped ? 'warning' : 'success'),
        5000,
        stats
      )
    }
  }, [isGenerating, generationResult, showToast])

  useEffect(() => {
    if (!isExporting && exportResult) {
      showToast(
        exportResult.message,
        exportResult.success ? 'success' : 'error',
        5000
      )
    }
  }, [isExporting, exportResult, showToast])

  return (
    <div className={classes.workspace}>
      <Actions
        tints={tints}
        shades={shades}
        steps={steps}
        setTints={setTints}
        setShades={setShades}
        setSteps={setSteps}
        onAddPalette={onAddPalette}
      />

      <Colors
        palettes={palettes}
        onSetPalette={onSetPalette}
        onRemovePalette={onRemovePalette}
      />

      {isCreating && <p className="body-l">Creating Color Components...</p>}
      {isGenerating && <p className="body-l">Creating Colors...</p>}
      {isExporting && <p className="body-l">Exporting JSON...</p>}

      <Toaster toasts={toasts} onRemove={removeToast} />
      <Footer
        libraryMode={libraryMode}
        jsonMode={jsonMode}
        visualPaletteMode={visualPaletteMode}
        delimiter={delimiter}
        setLibraryMode={setLibraryMode}
        setJsonMode={setJsonMode}
        setVisualPaletteMode={setVisualPaletteMode}
        setDelimiter={setDelimiter}
        onSavePalettes={onGeneratePalettes}
      />
    </div>
  )
}
