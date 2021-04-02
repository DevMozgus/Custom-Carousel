import { useState, useEffect, useRef, useReducer } from "react"

export function useDrag(moveLeft, moverRight, slideSize, state, setState) {
  const [mousePosition, setMousePosition] = useState({
    startingPosition: null,
    currentPosition: null,
    transitionNumber: 1,
  })
  const [lastXPosition, setLastXPosition] = useState(null)

  useEffect(() => {
    const currentDrag = mousePosition.startingPosition + mousePosition.currentPosition
    if (mousePosition.currentPosition && currentDrag !== 0) {
      if (state.xPositions[0] === 0 && mousePosition.transitionNumber > 1) return null

      if (currentDrag >= slideSize * mousePosition.transitionNumber) {
        moveLeft(true)
        console.log("updating array")
        setMousePosition({ ...mousePosition, transitionNumber: mousePosition.transitionNumber + 1 })
      } else if (state.active) {
        console.log("reseting state...")
        setState({ ...state, active: false })
      } else {
        const newXPositions = [...state.xPositions].map(
          (position) =>
            position +
            ((lastXPosition ? lastXPosition : mousePosition.startingPosition) - mousePosition.currentPosition)
        )
        setState({
          ...state,
          xPositions: newXPositions,
          active: false,
        })

        setLastXPosition(mousePosition.currentPosition)
      }
    }
  }, [mousePosition])

  function handleDrag(e) {
    const dragStarted = e.type === "mousedown"
    const dragEnded = e.type === "mouseup"

    if (dragStarted) {
      setMousePosition({
        ...mousePosition,
        startingPosition: e.clientX,
      })

      console.log("DRAG STARTED")
    } else if (dragEnded) {
      setMousePosition({
        startingPosition: null,
        currentPosition: null,
        transitionNumber: 1,
      })
      setLastXPosition(null)

      console.log("DRAG ENDED: ")
      determineBouceDirection()
    } else if (mousePosition.startingPosition) {
      setMousePosition({
        ...mousePosition,
        currentPosition: e.screenX,
      })
    }
  }

  function determineBouceDirection() {
    const previousSlidePosition = state.xPositionsInitial
    const nextSlidePosition = state.xPositionsInitial.slice()
    nextSlidePosition.push(nextSlidePosition.shift())

    const previousSlideDistance = previousSlidePosition[0] - state.xPositions[0]
    const nextSlideDistance = Math.abs(nextSlidePosition[0] - state.xPositions[0])

    console.log(previousSlideDistance, nextSlideDistance)

    if (Math.abs(previousSlideDistance === 0)) {
      return null
    } else if (Math.abs(previousSlideDistance < nextSlideDistance)) {
      const direction = previousSlideDistance < 0 ? "right" : "left"
      console.log("PREVIOUS", direction)
      setState({
        ...state,
        xPositions: previousSlidePosition,
        direction,
      })
    } else {
      const direction = nextSlideDistance < 0 ? "right" : "left"
      console.log("NEXT", direction)
      setState({
        ...state,
        xPositions: nextSlidePosition,
        xPositionsInitial: nextSlidePosition,
        direction,
      })
    }
  }

  return [handleDrag, mousePosition]
}
