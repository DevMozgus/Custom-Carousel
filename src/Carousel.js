import { useState, useEffect, useRef, useReducer } from "react"
import { carouselReducer } from "./carouselReducer"

function calculateImageWidth(currentScreenWidth, visibleSlides, offset) {
  return currentScreenWidth / visibleSlides - offset
}

function calculateXPositions(items, currentImageWidth, offset = 0) {
  return items.map((_, index) => (currentImageWidth + offset) * index)
}

export default function CarouselTemp({ children, visibleSlides, offset = 0, scrollInterval = 0 }) {
  const slideRef = useRef(null)

  const initialImageWidth = calculateImageWidth(window.innerWidth, visibleSlides, offset)
  const initialCarouselState = {
    imageSizes: {
      imageWidth: initialImageWidth,
      offset,
      imageHeights: [],
      largestImage: 0,
    },
    slide: {
      direction: "",
      active: false,
      xPositions: calculateXPositions(children, initialImageWidth, offset),
      xPositionsInitial: calculateXPositions(children, initialImageWidth, offset),
    },
    mousePosition: {
      startingPosition: null,
      currentPosition: null,
      transitionNumber: 1,
    },
    previousMousePosition: null,
  }

  const [touchPosition, setTouchPosition] = useState(null)

  const [state, dispatch] = useReducer(carouselReducer, initialCarouselState)

  useEffect(() => {
    function handleResize() {
      const currentImageWidth = calculateImageWidth(window.innerWidth, visibleSlides, offset)

      const newImageHeights = [...slideRef.current.children].map(
        (element) => element.children[0].children[0].offsetHeight
      )

      dispatch({
        type: "UPDATE SIZES",
        data: {
          slide: {
            xPositions: calculateXPositions(children, currentImageWidth, offset),
          },
          imageSizes: {
            imageWidth: currentImageWidth,
            imageHeights: newImageHeights,
            largestImage: getLargestImage(newImageHeights),
          },
        },
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  })

  useEffect(() => {
    const currentDrag = state.mousePosition.startingPosition - state.mousePosition.currentPosition
    const totalSlideSize = state.imageSizes.imageWidth + state.imageSizes.offset

    if (state.mousePosition.currentPosition && currentDrag !== 0) {
      if (currentDrag >= window.innerWidth) return null

      if (currentDrag >= totalSlideSize * state.mousePosition.transitionNumber) {
        dispatch({
          type: "DRAG LEFT",
        })
        dispatch({
          type: "SET TRANSITION NUM",
          data: state.mousePosition.transitionNumber + 1,
        })
        console.log("MOVING LEFT")
      } else if (-currentDrag >= totalSlideSize * state.mousePosition.transitionNumber) {
        dispatch({
          type: "DRAG RIGHT",
        })
        dispatch({
          type: "SET TRANSITION NUM",
          data: state.mousePosition.transitionNumber + 1,
        })
        console.log("MOVING RIGHT")
      } else if (state.slide.active) {
        console.log("reseting state...", state.mousePosition.transitionNumber)
        dispatch({
          type: "TRANSITION NUM DONE",
        })
      } else {
        const newXPositions = [...state.slide.xPositions].map(
          (position) =>
            position +
            ((state.previousMousePosition ? state.previousMousePosition : state.mousePosition.startingPosition) -
              state.mousePosition.currentPosition)
        )
        // console.log("DRAG NEW POSITIONS: ", newXPositions)
        dispatch({
          type: "UPDATE DRAG POSITION",
          data: { xPositions: newXPositions, previousMousePosition: state.mousePosition.currentPosition },
        })
      }
    }
  }, [state.mousePosition])

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
      console.log("DRAG STARTED: ", state.mousePosition)
    } else if (dragEnded) {
      dispatch({
        type: "DRAG ENDED",
        data: { ...initialCarouselState.mousePosition },
      })
      dispatch({
        type: "BOUNCE",
      })
      console.log("DRAG ENDED: ")
    } else if (state.mousePosition.startingPosition) {
      dispatch({
        type: "CURRENTLY DRAGGING",
        data: e.screenX,
      })
    }
  }

  // function handleTouchMove(e) {
  //   const touchDown = touchPosition

  //   if (touchDown === null) {
  //     return
  //   }

  //   const currentTouch = e.touches[0].clientX
  //   const diff = touchDown - currentTouch

  //   if (diff > 5) {
  //     moveLeft()
  //   }

  //   if (diff < -5) {
  //     moveRight()
  //   }

  //   setTouchPosition(null)
  // }

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
        WebkitTransition: "all 200ms ease",
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

  function onImgLoad({ target: img }) {
    const newImage = state.imageSizes.imageHeights.concat(img.height)
    dispatch({
      type: "IMAGES LOADED",
      data: { imageHeights: newImage, largestImage: getLargestImage() },
    })
  }

  function getLargestImage(newImageHeights) {
    // Needs 3 pixels added, otherwise it adds vertical scroll idfk
    if (newImageHeights && newImageHeights.length > 2) {
      return newImageHeights.reduce((acc, curr) => (acc > curr ? acc : curr)) + 3
    } else if (state.imageSizes.imageHeights.length > 2) {
      return state.imageSizes.imageHeights.reduce((acc, curr) => (acc > curr ? acc : curr)) + 3
    }
  }

  const carouselCentering =
    visibleSlides !== 1
      ? (state.imageSizes.imageWidth + offset) * (visibleSlides + 1) - state.imageSizes.imageWidth / 2
      : offset / 2 + (state.imageSizes.imageWidth + offset)

  return (
    <>
      <div
        onTouchStart={handleTouchStart}
        className="Carousel-Container"
        style={{ height: `${state.imageSizes.largestImage}px` }}
        onMouseDown={handleDrag}
        onMouseMove={handleDrag}
        onMouseUp={handleDrag}
      >
        <div className="relative Slides" style={{ left: `${carouselCentering}px` }} ref={slideRef}>
          {children.map((item, index) => {
            const imgStyle = determineStyle(index)
            return (
              <div key={item.id} style={{ width: `${state.imageSizes.imageWidth}px` }} className="Slide-Container">
                <div key={item.id} className="relative" style={{ width: `${state.imageSizes.imageWidth}px` }}>
                  <div key={item.id} onLoad={onImgLoad} style={imgStyle} className="absolute Slider-Content">
                    {item}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            dispatch({
              type: "SLIDE LEFT",
            })
          }}
          className="buttonBack"
        >
          next
        </button>
        <button
          onClick={() => {
            dispatch({
              type: "SLIDE RIGHT",
            })
          }}
          className="buttonNext"
        >
          back
        </button>
      </div>
    </>
  )
}