import { useEffect } from 'preact/hooks'
import { Actions } from '@components/actions/actions'
import { Colors } from '@components/colors/colors'
import { Toaster } from '@components/toaster/toaster'
import { useAppState } from '@hooks/useAppState'
import { useToaster } from '@hooks/useToaster'

export function App() {
  const {
    steps,
    tints,
    shades,
    palettes,
    isGenerating,
    generationResult,
    onAddPalette,
    onRemovePalette,
    onSetPalette,
    onSavePalettes,
    setSteps,
    setTints,
    setShades
  } = useAppState()

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

  return (
    <>
      <Actions
        tints={tints}
        shades={shades}
        steps={steps}
        setTints={setTints}
        setShades={setShades}
        setSteps={setSteps}
        onAddPalette={onAddPalette}
        onSavePalettes={onSavePalettes}
      />

      <Colors
        palettes={palettes}
        onSetPalette={onSetPalette}
        onRemovePalette={onRemovePalette}
      />

      {isGenerating && (
        <p className="body-l">
          Creating... This may take a few seconds
        </p>
      )}

      <Toaster toasts={toasts} onRemove={removeToast} />
    </>
  )
}
