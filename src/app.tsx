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
    colorType,
    setSteps,
    setTints,
    setShades,
    setColorType,
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
    errors,
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
        colorType={colorType}
        setTints={setTints}
        setShades={setShades}
        setSteps={setSteps}
        setColorType={setColorType}
        onAddPalette={onAddPalette}
      />

      <Colors
        palettes={palettes}
        onSetPalette={onSetPalette}
        onRemovePalette={onRemovePalette}
        errors={errors}
        colorType={colorType}
      />

      {isCreating && <p className="body-l">Creating Color Components...</p>}
      {isGenerating && <p className="body-l">Creating Colors...</p>}
      {isExporting && <p className="body-l">Exporting JSON...</p>}

      <Toaster toasts={toasts} onRemove={removeToast} />
      <Footer
        hasError={Object.values(errors).length > 0}
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
