import { useState } from "react"

export interface DragValues {
  startingPosition: number
  currentPosition: number
  previousPosition: number
}

export function useDrag(callback: () => void): [(event: any) => void, DragValues] {
  const [startingPosition, setStartingPostion] = useState(0)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [previousPosition, setPreviousPosition] = useState(0)

  function handleDrag(event: any) {
    const dragType = event.type
    const dragStarted = dragType === "mousedown" || dragType === "touchstart"
    const dragEnded = dragType === "mouseup" || dragType === "touchend"

    if (dragStarted) {
      setStartingPostion(event.clientX || event.touches[0].clientX)
    } else if (dragEnded) {
      callback()
      setStartingPostion(0)
      setCurrentPosition(0)
      setPreviousPosition(0)
    } else if (startingPosition !== 0) {
      const newDragPosition = dragType === "mousemove" ? event.clientX : event.touches[0].clientX
      setPreviousPosition(currentPosition)
      setCurrentPosition(newDragPosition)
    }
  }

  const dragValues = { startingPosition, currentPosition, previousPosition }

  return [handleDrag, dragValues]
}
