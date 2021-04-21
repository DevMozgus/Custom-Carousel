import { DragValues } from "./hooks/useDrag"
import { SlideValues } from "./hooks/useCarousel"

function moveRight(state: SlideValues, dragValues: DragValues): SlideValues {
  let xPositions: any = [...state.xPositions]
  xPositions.unshift(xPositions.pop())

  if (dragValues && dragValues !== null && dragValues.startingPosition !== 0) {
    xPositions = state.xPositionsInitial.slice()
    xPositions.unshift(xPositions.pop())

    const tempXPositions: any = state.xPositions.slice()
    tempXPositions.unshift(tempXPositions.pop())

    const currentDrag = dragValues.startingPosition - dragValues.currentPosition
    const xPositionReset = tempXPositions.map((position) => position - currentDrag)
    return {
      ...state,
      xPositions: xPositionReset,
      xPositionsInitial: xPositions,
      transitionNumber: state.transitionNumber + 1,
      transitionActive: true,
    }
  } else {
    return {
      ...state,
      xPositions,
      xPositionsInitial: xPositions,
      direction: "right",
    }
  }
}

function moveLeft(state: SlideValues, dragValues: DragValues): SlideValues {
  let xPositions: any = [...state.xPositions]
  xPositions.push(xPositions.shift())
  if (dragValues && dragValues !== null && dragValues.startingPosition !== 0) {
    xPositions = state.xPositionsInitial.slice()
    xPositions.push(xPositions.shift())

    const tempXPositions: any = state.xPositions.slice()
    tempXPositions.push(tempXPositions.shift())

    const currentDrag = dragValues.startingPosition - dragValues.currentPosition
    const xPositionReset = tempXPositions.map((position) => position - currentDrag)
    return {
      ...state,
      xPositions: xPositionReset,
      xPositionsInitial: xPositions,
      transitionNumber: state.transitionNumber + 1,
      transitionActive: true,
    }
  } else {
    return {
      ...state,
      xPositions,
      xPositionsInitial: xPositions,
      direction: "left",
    }
  }
}

function determineBounceDirection(state: SlideValues, dragValues: DragValues, slideWidth: number): SlideValues {
  const initialSlidePositions = state.xPositionsInitial

  const isMovingRight = initialSlidePositions[0] - state.xPositions[0] > 0
  const isMovingLeft = initialSlidePositions[0] - state.xPositions[0] < 0

  let nextSlidePosition
  if (isMovingRight) {
    nextSlidePosition = state.xPositionsInitial.slice()
    nextSlidePosition.unshift(nextSlidePosition.pop())
  } else if (isMovingLeft) {
    nextSlidePosition = state.xPositionsInitial.slice()
    nextSlidePosition.push(nextSlidePosition.shift())
  } else return state

  const dragSpeed = Math.abs(dragValues.previousPosition - dragValues.currentPosition)

  const previousSlideDistance = (initialSlidePositions[1] - state.xPositions[1]) % slideWidth
  const nextSlideDistance = Math.abs(nextSlidePosition[1] - state.xPositions[1]) % slideWidth
  // dragValues is undefined ?
  // const currentDrag = dragValues ? dragValues.startingPosition - dragValues.currentPosition : 0

  if (Math.abs(previousSlideDistance) === 0) return state

  if (Math.abs(previousSlideDistance) > nextSlideDistance / dragSpeed) {
    const direction = isMovingRight ? "right" : "left"
    return {
      ...state,
      xPositions: nextSlidePosition,
      xPositionsInitial: nextSlidePosition,
      direction,
    }
  } else {
    const direction = previousSlideDistance < 0 ? "right" : "left"
    return {
      ...state,
      xPositions: initialSlidePositions,
      xPositionsInitial: initialSlidePositions,
      direction,
    }
  }
}

function drag(state: SlideValues, dragValues: DragValues) {
  const newXPositions = [...state.xPositions].map(
    (position) =>
      position +
      ((dragValues.previousPosition ? dragValues.previousPosition : dragValues.startingPosition) -
        dragValues.currentPosition)
  )

  const newState = { ...state, xPositions: newXPositions, direction: "" }
  return newState
}

export function slideReducer(state: SlideValues, action: any) {
  switch (action.type) {
    case "SLIDE LEFT":
      return moveLeft(state, action.data)
    case "SLIDE RIGHT":
      return moveRight(state, action.data)
    case "SET TRANSITION STATE":
      return { ...state, transitionActive: !state.transitionActive }
    case "RESET TRANSITION STATE":
      const newValues = action.data
      const newState = determineBounceDirection(state, newValues.dragValues, newValues.slideWidth)
      return { ...newState, transitionNumber: 1 }
    case "DRAG":
      const { dragValues } = action.data
      return drag(state, dragValues)
    case "NEW DIMENSIONS":
      const newPositions = action.data
      return { ...state, ...newPositions }
    default:
      return state
  }
}
