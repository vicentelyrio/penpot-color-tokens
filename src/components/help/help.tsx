import { useState } from 'preact/hooks'
import { clsx } from '@utils/clsx'
import classes from './help.module.css'

export interface HelpProps {
  description: string
}

export function Help({ description }: HelpProps) {
  const [show, setShow] = useState(false)

  return (
    <div
      className={classes.help}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      <span className={clsx(['code-font', classes.label])}>?</span>
      <div className={clsx([classes.tooltip, show ? classes.show : ''])}>{description}</div>
    </div>
  )
}
