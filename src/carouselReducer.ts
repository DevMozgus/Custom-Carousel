import { Slide, SlideSizes, DragValues, State } from "./types"

function moveRight(state: State): State {
  let xPositions: any = [...state.slide.xPositions]
  xPositions.unshift(xPositions.pop())

  if (state.dragValues !== null && state.dragValues.startingPosition !== 0) {
    xPositions = state.slide.xPositionsInitial.slice()
    xPositions.unshift(xPositions.pop())

    const tempXPositions: any = state.slide.xPositions.slice()
    tempXPositions.unshift(tempXPositions.pop())

    const currentDrag = state.dragValues.startingPosition - state.dragValues.currentPosition
    const xPositionReset = tempXPositions.map((position) => position - currentDrag)
    return {
      ...state,
      slide: {
        ...state.slide,
        xPositions: xPositionReset,
        xPositionsInitial: xPositions,
        active: true,
      },
    }
  } else {
    return {
      ...state,
      slide: {
        ...state.slide,
        xPositions,
        xPositionsInitial: xPositions,
        direction: "right",
      },
    }
  }
}

function moveLeft(state: any): State {
  let xPositions = [...state.slide.xPositions]
  xPositions.push(xPositions.shift())
  if (state.dragValues !== null && state.dragValues.startingPosition !== 0) {
    xPositions = state.slide.xPositionsInitial.slice()
    xPositions.push(xPositions.shift())

    const tempXPositions = state.slide.xPositions.slice()
    tempXPositions.push(tempXPositions.shift())

    const currentDrag = state.dragValues.startingPosition - state.dragValues.currentPosition
    const xPositionReset = tempXPositions.map((position) => position - currentDrag)
    return {
      ...state,
      slide: {
        ...state.slide,
        xPositions: xPositionReset,
        xPositionsInitial: xPositions,
        active: true,
      },
    }
  } else {
    return {
      ...state,
      slide: {
        ...state.slide,
        xPositions,
        xPositionsInitial: xPositions,
        direction: "left",
      },
    }
  }
}

function determineBounceDirection(state: any): State {
  const previousSlidePosition = state.slide.xPositionsInitial
  console.log(state.dragValues)

  const isMovingRight = previousSlidePosition[0] - state.slide.xPositions[0] > 0

  let nextSlidePosition
  if (isMovingRight) {
    // moving right
    nextSlidePosition = state.slide.xPositionsInitial.slice()
    nextSlidePosition.unshift(nextSlidePosition.pop())
  } else {
    // moving left
    nextSlidePosition = state.slide.xPositionsInitial.slice()
    nextSlidePosition.push(nextSlidePosition.shift())
  }

  const previousSlideDistance = (previousSlidePosition[1] - state.slide.xPositions[1]) % state.slideSizes.imageWidth
  const nextSlideDistance = Math.abs(nextSlidePosition[1] - state.slide.xPositions[1]) % state.slideSizes.slideWidth

  if (Math.abs(previousSlideDistance) === 0) {
    return state
  } else if (Math.abs(previousSlideDistance) < nextSlideDistance) {
    const direction = previousSlideDistance < 0 ? "right" : "left"
    return {
      ...state,
      slide: {
        ...state.slide,
        xPositions: previousSlidePosition,
        xPositionsInitial: previousSlidePosition,
        direction,
      },
    }
  } else {
    const direction = isMovingRight ? "right" : "left"
    return {
      ...state,
      slide: {
        ...state.slide,
        xPositions: nextSlidePosition,
        xPositionsInitial: nextSlidePosition,
        direction,
      },
    }
  }
}

export function carouselReducer(state, action) {
  switch (action.type) {
    case "DRAG STARTED":
      return { ...state, dragValues: { ...state.dragValues, startingPosition: action.data } }
    case "DRAG ENDED":
      return { ...state, dragValues: action.data, previousMousePosition: null }
    case "CURRENTLY DRAGGING":
      return { ...state, dragValues: { ...state.dragValues, currentPosition: action.data } }
    case "SLIDE LEFT":
      return moveLeft(state)
    case "DRAG LEFT":
      return moveLeft(state)
    case "SLIDE RIGHT":
      return moveRight(state)
    case "DRAG RIGHT":
      return moveRight(state)
    case "SET TRANSITION NUM":
      const transitionNumber = action.data
      return { ...state, dragValues: { ...state.dragValues, transitionNumber } }
    case "TRANSITION NUM DONE":
      return { ...state, slide: { ...state.slide, active: false } }
    case "UPDATE DRAG POSITION":
      const { xPositions, previousMousePosition } = action.data
      return { ...state, previousMousePosition, slide: { ...state.slide, xPositions, direction: "", active: false } }
    case "BOUNCE":
      return determineBounceDirection(state)
    case "UPDATE SIZES":
      return { ...state, ...action.data }
    case "IMAGES LOADED":
      return { ...state, imageSizes: { ...state.imageSizes, ...action.data } }
    default:
      return state
  }
}
