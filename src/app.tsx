import { useState } from 'preact/hooks'

import { clsx } from '@utils/clsx'
import { Actions } from '@components/actions/actions'
import { Colors } from '@components/colors/colors'

import classes from './app.module.css'

const DEFAULT_STEPS = 8

export function App() {
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [tints, setTints] = useState(true)
  const [shades, setShades] = useState(true)

  return (
    <div className={classes.container}>
      <h3 className={clsx(['title-m', classes.title])}>
        Color Palette Generator
      </h3>

      <Actions
        tints={tints}
        shades={shades}
        steps={steps}
        setTints={setTints}
        setShades={setShades}
        setSteps={setSteps}
      />

      <Colors
        steps={steps}
        tints={tints}
        shades={shades}
      />
    </div>
  )
}
