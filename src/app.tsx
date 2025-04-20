import { useState } from 'preact/hooks'

import { Actions } from '@components/actions/actions'
import { Colors } from '@components/colors/colors'

const DEFAULT_STEPS = 8

export function App() {
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [tints, setTints] = useState(true)
  const [shades, setShades] = useState(true)
  const [palettes, setPalettes] = useState(1)

  return (
    <div>
      <Actions
        tints={tints}
        shades={shades}
        steps={steps}
        palettes={palettes}
        setTints={setTints}
        setShades={setShades}
        setSteps={setSteps}
        setPalettes={setPalettes}
      />

      <Colors
        steps={steps}
        tints={tints}
        shades={shades}
        palettes={palettes}
      />
    </div>
  )
}
