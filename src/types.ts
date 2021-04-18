export type Direction = "left" | "right" | ""

export interface CarouselProps {
  images: string[]
  fullscreen: boolean
  widthToHeightRatio: number
}

export interface Slide {
  direction: Direction
  active: boolean
  xPositions: number[]
  xPositionsInitial: number[]
}

export interface SlideSizes {
  slideWidth: number
  slideHeight: number
}

export interface DragValues {
  startingPosition: number
  currentPosition: number
  transitionNumber: number
}

export interface State {
  slide: Slide
  slideSizes: SlideSizes
  dragValues: DragValues
  previousMousePosition: number
}
