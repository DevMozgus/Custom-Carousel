import { useEffect, useReducer } from "react"
import { slideReducer } from "../slideReducer"
import { useDrag } from "./useDrag"

type Direction = "left" | "right" | ""

function calculateXPositions(arrayLength: number, currentSlideWidth: number): number[] {
  const xPositions: number[] = []

  for (let i = 0; i < arrayLength; i++) {
    xPositions.push(currentSlideWidth * i)
  }
  return xPositions
}

export interface SlideValues {
  direction: Direction
  transitionActive: boolean
  transitionNumber: number
  xPositions: number[]
  xPositionsInitial: number[]
}

export default function useCarousel(arrayLength: number, slideWidth: number) {
  const [handleDrag, dragValues] = useDrag(dragEnded)

  const initialXPositions = calculateXPositions(arrayLength, slideWidth)
  const initialSlidesState: SlideValues = {
    direction: "",
    transitionNumber: 1,
    transitionActive: false,
    xPositions: initialXPositions,
    xPositionsInitial: initialXPositions,
  }

  const [slideState, dispatch] = useReducer(slideReducer, initialSlidesState)

  useEffect(() => {
    const newPositions = calculateXPositions(arrayLength, slideWidth)
    dispatch({
      type: "NEW DIMENSIONS",
      data: {
        xPositions: newPositions,
        xPositionsInitial: newPositions,
      },
    })
  }, [slideWidth, arrayLength])

  useEffect((): any => {
    const currentDrag = dragValues.startingPosition - dragValues.currentPosition
    const totalSlideSize = slideWidth

    // TO DO

    if (dragValues.currentPosition && currentDrag !== 0) {
      if (currentDrag >= window.innerWidth) return null

      if (currentDrag >= totalSlideSize * slideState.transitionNumber) {
        dispatch({
          type: "SLIDE LEFT",
          data: dragValues,
        })
      } else if (-currentDrag >= totalSlideSize * slideState.transitionNumber) {
        dispatch({
          type: "SLIDE RIGHT",
          data: dragValues,
        })
      } else if (slideState.transitionActive) {
        dispatch({
          type: "SET TRANSITION STATE",
        })
      }
      dispatch({
        type: "DRAG",
        data: { dragValues },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragValues.startingPosition, dragValues.currentPosition])

  function dragEnded() {
    dispatch({
      type: "RESET TRANSITION STATE",
      data: { dragValues, slideWidth },
    })
  }

  function moveLeft() {
    return dispatch({
      type: "SLIDE LEFT",
    })
  }

  function moveRight() {
    return dispatch({
      type: "SLIDE RIGHT",
    })
  }

  function moveReset() {
    console.log(slideWidth, dragValues)
    return dispatch({
      type: "RESET TRANSITION STATE",
      data: { dragValues, slideWidth },
    })
  }

  return [
    { left: moveLeft, right: moveRight, reset: moveReset, handleDrag },
    { direction: slideState.direction, xPositions: slideState.xPositions },
  ]
}
