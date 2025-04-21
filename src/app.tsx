import { Actions } from '@components/actions/actions'
import { Colors } from '@components/colors/colors'
import { useAppState } from '@hooks/useAppState'

export function App() {
  const {
    steps,
    tints,
    shades,
    palettes,
    onAddPalette,
    onRemovePalette,
    onSetPalette,
    onSavePalettes,
    setSteps,
    setTints,
    setShades
  } = useAppState()

  return (
    <div>
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
    </div>
  )
}
