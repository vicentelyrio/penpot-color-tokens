import { ReactNode } from 'react-dom/src'
import { clsx } from '@utils/clsx'

import classes from './segment-control.module.css'

export type SegmentControlItem = {
  item: ReactNode
  type: ColorType
}

export type SegmentControlProps = {
  colorType: ColorType
  setColorType: (colorType: ColorType) => void
  items: SegmentControlItem[]
}

export function SegmentControl({ items, colorType, setColorType }: SegmentControlProps) {
  return (
    <div className={classes.segmentControl}>
      {items.map(({ item, type }) => (
        <Item
          key={item}
          item={item}
          selected={colorType === type}
          onSelect={() => setColorType(type)}
        />
      ))}
    </div>
  )
}

type SegmentControlItemProps = {
  item: ReactNode
  selected: boolean
  onSelect: () => void
}

function Item({ item, selected, onSelect }: SegmentControlItemProps) {
  return (
    <div
      className={clsx([classes.segmentControlItem, selected ? classes.selected : ''])}
      onClick={onSelect}>
      {item}
    </div>
  )
}
