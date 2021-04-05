function moveRight(state, mousePosition) {
  console.log("START TRANSITION: ", state.slide.xPositions)
  let xPositions = state.slide.xPositions.slice()
  xPositions.unshift(xPositions.pop())

  if (mousePosition) {
    xPositions = state.slide.xPositionsInitial.slice()
    xPositions.unshift(xPositions.pop())

    const tempXPositions = state.slide.xPositions.slice()
    tempXPositions.unshift(tempXPositions.pop())

    const currentDrag = mousePosition.startingPosition - mousePosition.currentPosition
    const xPositionReset = tempXPositions.map((position) => position - currentDrag)
    console.log("DONE: ", xPositions, xPositionReset)
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
    console.log("DONE: ", xPositions)
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

function moveLeft(state, mousePosition) {
  console.log("START TRANSITION: ", state.slide.xPositions)
  let xPositions = state.slide.xPositions.slice()
  xPositions.push(xPositions.shift())
  if (mousePosition) {
    xPositions = state.slide.xPositionsInitial.slice()
    xPositions.push(xPositions.shift())

    const tempXPositions = state.slide.xPositions.slice()
    tempXPositions.push(tempXPositions.shift())

    const currentDrag = mousePosition.startingPosition - mousePosition.currentPosition
    const xPositionReset = tempXPositions.map((position) => position - currentDrag)
    console.log("TRANSITION NEW POSITIONS: ", xPositionReset, currentDrag)
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
    console.log("DONE: ", xPositions)
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

function determineBounceDirection(state) {
  const previousSlidePosition = state.slide.xPositionsInitial
  console.log(previousSlidePosition)

  const isMovingRight = previousSlidePosition[0] - state.slide.xPositions[0] > 0

  let nextSlidePosition
  if (isMovingRight) {
    // moving right
    console.log("MOVING RIGHT")
    nextSlidePosition = state.slide.xPositionsInitial.slice()
    nextSlidePosition.unshift(nextSlidePosition.pop())
  } else {
    console.log("MOVING LEFT")
    // moving left
    nextSlidePosition = state.slide.xPositionsInitial.slice()
    nextSlidePosition.push(nextSlidePosition.shift())
  }

  const previousSlideDistance =
    (previousSlidePosition[1] - state.slide.xPositions[1]) % (state.imageSizes.imageWidth + state.imageSizes.offset)
  const nextSlideDistance =
    Math.abs(nextSlidePosition[1] - state.slide.xPositions[1]) % (state.imageSizes.imageWidth + state.imageSizes.offset)

  console.log("PREVIOUS DISTANCE: ", Math.abs(previousSlideDistance), "NEXT DISTANCE: ", nextSlideDistance)
  console.log(state.imageSizes)
  if (Math.abs(previousSlideDistance === 0)) {
    return state
  } else if (Math.abs(previousSlideDistance) < nextSlideDistance) {
    const direction = previousSlideDistance < 0 ? "right" : "left"
    console.log("PREVIOUS", direction)
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
    console.log("NEXT", direction)
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
      return { ...state, mousePosition: { ...state.mousePosition, startingPosition: action.data } }
    case "DRAG ENDED":
      return { ...state, mousePosition: action.data, previousMousePosition: null }
    case "CURRENTLY DRAGGING":
      return { ...state, mousePosition: { ...state.mousePosition, currentPosition: action.data } }
    case "SLIDE LEFT":
      return moveLeft(state)
    case "DRAG LEFT":
      return moveLeft(state, state.mousePosition)
    case "SLIDE RIGHT":
      return moveRight(state)
    case "DRAG RIGHT":
      return moveRight(state, state.mousePosition)
    case "SET TRANSITION NUM":
      const transitionNumber = action.data
      return { ...state, mousePosition: { ...state.mousePosition, transitionNumber } }
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
