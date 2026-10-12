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

import { NEW_TOKEN_SET } from '@consts/config'

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
  } = useGenerateOptions()

  const {
    errors,
    status,
    tokenSets,
    onGeneratePalettes,
  } = useGenerate({
    palettes,
    shades,
    tints,
    jsonMode,
    libraryMode,
    delimiter,
    visualPaletteMode,
    tokensMode,
    targetSet,
    newSetName
  })

  const { toasts, showToast, removeToast } = useToaster()

  useEffect(() => {
    status.forEach((stat) => showToast(stat))
  }, [status, showToast])

  const hasModesSelected = libraryMode || jsonMode || visualPaletteMode || tokensMode
  const hasTokenTargetError = tokensMode && (
    !targetSet || (targetSet === NEW_TOKEN_SET && !newSetName.trim())
  )
  const hasError = Object.values(errors).length > 0 || !hasModesSelected || hasTokenTargetError

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
            tokensMode={tokensMode}
            tokensAvailable={tokenSets.available}
            tokenSets={tokenSets.sets}
            targetSet={targetSet}
            newSetName={newSetName}
            delimiter={delimiter}
            setLibraryMode={setLibraryMode}
            setJsonMode={setJsonMode}
            setVisualPaletteMode={setVisualPaletteMode}
            setDelimiter={setDelimiter}
            setTokensMode={setTokensMode}
            setTargetSet={setTargetSet}
            setNewSetName={setNewSetName}
            onSavePalettes={onGeneratePalettes}
          />
        </div>
    </PostHogProvider>
  )
}
