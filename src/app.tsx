import { useEffect } from 'preact/hooks'

import { PostHogProvider} from 'posthog-js/react'

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

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
}

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
    status,
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
    status.forEach((stat) => showToast(stat))
  }, [status, showToast])

  const hasModesSelected = libraryMode || jsonMode || visualPaletteMode
  const hasError = Object.values(errors).length > 0 || !hasModesSelected

  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}>
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

          <Toaster toasts={toasts} onRemove={removeToast} />
          <Footer
            hasError={hasError}
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
    </PostHogProvider>
  )
}
