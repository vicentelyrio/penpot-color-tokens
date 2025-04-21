import { Actions } from '@components/actions/actions'
import { Colors } from '@components/colors/colors'
import { useAppState } from '@hooks/useAppState'
import { clsx } from '@utils/clsx'

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

      {!isGenerating && generationResult && (
        <div className={clsx([generationResult.success ? 'success' : 'error'])}>
          <p className="body-l">{generationResult.message}</p>

          {generationResult.stats && (
            <div className="generation-stats">
              <p className="body-l">
                {generationResult.stats.created > 0 &&
                  <span className="success">Created: {generationResult.stats.created}</span>
                }
                {generationResult.stats.skipped > 0 &&
                  <span className="warning"> | Skipped (already exist): {generationResult.stats.skipped}</span>
                }
                {generationResult.stats.failed > 0 &&
                  <span className="error"> | Failed: {generationResult.stats.failed}</span>
                }
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
