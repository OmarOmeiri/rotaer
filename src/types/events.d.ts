type _RangeSliderEvent = {min: number, max: number}
type RangeSliderEvent = CustomEvent<_RangeSliderEvent> & {
  target: HTMLInputElement
}
type RangeSliderEventHandler = (event: RangeSliderEvent) => void

type _ListSelectEvent = {selected: (string | boolean)[]}
type ListSelectEvent = CustomEvent<_ListSelectEvent> & {
  target: HTMLDivElement
}

type ListSelectEventHandler = (event: ListSelectEvent) => void

type _DebouncedInputEvent = {value: string}
type DebouncedInputEvent = CustomEvent<_DebouncedInputEvent> & {
  target: HTMLInputElement
}
type DebouncedInputEventHandler = (event: DebouncedInputEvent) => void
