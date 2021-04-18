import { useState, useEffect, useReducer } from "react"
import { carouselReducer } from "./carouselReducer"
import { Slide, SlideSizes, DragValues, CarouselProps, State } from "./types"

function calculateSlideWidth(currentScreenWidth: number, visibleSlides: number): number {
  return currentScreenWidth / visibleSlides
}

function calculateSlideHeight(currentScreenWidth: number, visibleSlides: number, widthToHeightRatio: number): number {
  return (currentScreenWidth / visibleSlides) * widthToHeightRatio
}

function calculateXPositions(items: string[], currentSlideWidth: number): number[] {
  return items.map((_, index) => currentSlideWidth * index)
}

export default function CarouselTemp({ fullscreen, images, widthToHeightRatio }: CarouselProps) {
  const visibleSlides: number = fullscreen ? 1 : 3

  const initialSlideWidth: number = calculateSlideWidth(window.innerWidth, visibleSlides)
  const initialSlideHeight: number = calculateSlideHeight(window.innerWidth, visibleSlides, widthToHeightRatio)
  const initialCarouselState: State = {
    slideSizes: {
      slideWidth: initialSlideWidth,
      slideHeight: initialSlideHeight,
    },
    slide: {
      direction: "",
      active: false,
      xPositions: calculateXPositions(images, initialSlideWidth),
      xPositionsInitial: calculateXPositions(images, initialSlideWidth),
    },
    dragValues: {
      startingPosition: 0,
      currentPosition: 0,
      transitionNumber: 1,
    },
    previousMousePosition: 0,
  }

  const [touchPosition, setTouchPosition] = useState(null)

  const [state, dispatch] = useReducer(carouselReducer, initialCarouselState)

  useEffect(() => {
    function handleResize() {
      const currentSlideWidth = calculateSlideWidth(window.innerWidth, visibleSlides)
      const currentSlideHeight = calculateSlideHeight(window.innerWidth, visibleSlides, widthToHeightRatio)

      dispatch({
        type: "UPDATE SIZES",
        data: {
          slide: {
            ...state.slide,
            xPositions: calculateXPositions(images, currentSlideWidth),
            xPositionsInitial: calculateXPositions(images, currentSlideWidth),
          },
          slideSizes: {
            ...state.slideSizes,
            slideWidth: currentSlideWidth,
            slideHeight: currentSlideHeight,
          },
        },
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  })

  useEffect((): any => {
    const currentDrag = state.dragValues.startingPosition - state.dragValues.currentPosition
    const totalSlideSize = state.slideSizes.slideWidth

    if (state.dragValues.currentPosition && currentDrag !== 0) {
      if (currentDrag >= window.innerWidth) return null

      if (currentDrag >= totalSlideSize * state.dragValues.transitionNumber) {
        dispatch({
          type: "DRAG LEFT",
        })
        dispatch({
          type: "SET TRANSITION NUM",
          data: state.dragValues.transitionNumber + 1,
        })
      } else if (-currentDrag >= totalSlideSize * state.dragValues.transitionNumber) {
        dispatch({
          type: "DRAG RIGHT",
        })
        dispatch({
          type: "SET TRANSITION NUM",
          data: state.dragValues.transitionNumber + 1,
        })
      } else if (state.slide.active) {
        dispatch({
          type: "TRANSITION NUM DONE",
        })
      } else {
        const newXPositions = [...state.slide.xPositions].map(
          (position) =>
            position +
            ((state.previousMousePosition ? state.previousMousePosition : state.dragValues.startingPosition) -
              state.dragValues.currentPosition)
        )

        dispatch({
          type: "UPDATE DRAG POSITION",
          data: { xPositions: newXPositions, previousMousePosition: state.dragValues.currentPosition },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dragValues])

  function handleTouchStart(e) {
    const touchDown = e.touches[0].clientX
    setTouchPosition(touchDown)
  }
  function handleDrag(e) {
    const dragStarted = e.type === "mousedown"
    const dragEnded = e.type === "mouseup"

    if (dragStarted) {
      dispatch({
        type: "DRAG STARTED",
        data: e.clientX,
      })
    } else if (dragEnded) {
      dispatch({
        type: "DRAG ENDED",
        data: { ...initialCarouselState.dragValues },
      })
      dispatch({
        type: "BOUNCE",
      })
    } else if (state.dragValues.startingPosition) {
      dispatch({
        type: "CURRENTLY DRAGGING",
        data: e.clientX,
      })
    }
  }

  function handleTouchMove(e) {
    const touchDown = touchPosition

    if (touchDown === null) {
      return
    }

    const currentTouch = e.touches[0].clientX
    const diff = touchDown - currentTouch

    if (diff > 5) {
      dispatch({
        type: "SLIDE LEFT",
      })
    }

    if (diff < -5) {
      dispatch({
        type: "SLIDE RIGHT",
      })
    }

    setTouchPosition(null)
  }

  function determineStyle(index) {
    const firstItemPosition = state.slide.xPositions.reduce((acc, curr) => (acc > curr ? curr : acc))
    const lastItemPosition = state.slide.xPositions.reduce((acc, curr) => (acc > curr ? acc : curr))

    const xPosition = state.slide.xPositions[index]
    const showAnimation =
      (xPosition > firstItemPosition && state.slide.direction === "left") ||
      (xPosition < lastItemPosition && state.slide.direction === "right")

    if (showAnimation) {
      return {
        transform: `translate3d(-${xPosition}px,0px,0px)`,
        transition: "all 500ms ease",
        WebkitTransition: "all 500ms ease",
        MozTransition: "all 500ms ease",
        msTransition: "all 500ms ease",
        OTransition: "all 500ms ease",
      }
    } else {
      return {
        transform: `translate3d(-${xPosition}px,0px,0px)`,
      }
    }
  }

  const carouselCentering =
    visibleSlides !== 1
      ? state.slideSizes.slideWidth * (visibleSlides + 1) - state.slideSizes.slideWidth / 2
      : state.slideSizes.slideWidth

  return (
    <div className="relative" style={{ overflow: "hidden" }}>
      <div
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        className="Carousel-Container"
        style={{ height: `${state.slideSizes.slideHeight}px` }}
        onMouseDown={handleDrag}
        onMouseMove={handleDrag}
        onMouseUp={handleDrag}
      >
        <div className="Slides">
          {images.map((item, index) => {
            const animationStyle = determineStyle(index)
            return (
              <div
                key={index}
                className="Slide-Container absolute"
                style={{ width: `${state.slideSizes.slideWidth}px`, left: `${carouselCentering}px` }}
              >
                <div
                  className="Slider-Content"
                  style={{
                    ...animationStyle,
                    width: `${state.slideSizes.slideWidth}px`,
                    height: `${state.slideSizes.sliderHeight}`,
                  }}
                >
                  <img src={item} alt="example" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <button
        onClick={() => {
          dispatch({
            type: "SLIDE RIGHT",
          })
        }}
        className="buttonNext"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-chevron-left"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#9e9e9e"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
      </button>
      <button
        onClick={() => {
          dispatch({
            type: "SLIDE LEFT",
          })
        }}
        className="buttonBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-chevron-right"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#9e9e9e"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>
    </div>
  )
}
