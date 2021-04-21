import { useSlideDimensions } from "./hooks/useSlideDimensions"
import useCarousel from "./hooks/useCarousel"

export interface CarouselProps {
  images: string[]
  fullscreen: boolean
  widthToHeightRatio: number
}

export default function CarouselTemp({ fullscreen, images, widthToHeightRatio }: CarouselProps) {
  // changing visible slides from 3 to anything else may break current carouselCentering style
  const visibleSlides: number = 3
  const [slideWidth, slideHeight] = useSlideDimensions(visibleSlides, widthToHeightRatio)
  const [move, slide] = useCarousel(images.length, slideWidth)

  function determineStyle(index) {
    const firstItemPosition = slide.xPositions.reduce((acc, curr) => (acc > curr ? curr : acc))
    const lastItemPosition = slide.xPositions.reduce((acc, curr) => (acc > curr ? acc : curr))

    const xPosition = slide.xPositions[index]
    const showAnimation =
      (xPosition > firstItemPosition && slide.direction === "left") ||
      (xPosition < lastItemPosition && slide.direction === "right")

    if (showAnimation) {
      return {
        transform: `translate3d(-${xPosition}px,0px,0px)`,
        transition: "all 500ms ease-out",
        WebkitTransition: "all 500ms ease-out",
        MozTransition: "all 500ms ease-out",
        msTransition: "all 500ms ease-out",
        OTransition: "all 500ms ease-out",
      }
    } else {
      return {
        transform: `translate3d(-${xPosition}px,0px,0px)`,
      }
    }
  }

  const carouselCentering = visibleSlides !== 1 ? slideWidth * (visibleSlides + 1) - slideWidth / 2 : slideWidth

  return (
    <div className="relative" style={{ overflow: "hidden" }}>
      <div
        onTouchMove={move.handleDrag}
        onTouchStart={move.handleDrag}
        onTouchEnd={move.handleDrag}
        className="Carousel-Container"
        style={{ height: `${fullscreen ? "100vh" : slideHeight}px` }}
        onMouseDown={move.handleDrag}
        onMouseMove={move.handleDrag}
        onMouseUp={move.handleDrag}
      >
        <div className="Slides">
          {images.map((item, index) => {
            const animationStyle = determineStyle(index)
            return (
              <div
                key={index}
                className="Slide-Container absolute"
                style={{ width: `${slideWidth}px`, left: `${carouselCentering}px` }}
              >
                <div
                  className="Slider-Content"
                  style={{
                    ...animationStyle,
                    width: `${slideWidth}px`,
                    height: `${fullscreen ? "100vh" : slideHeight}`,
                  }}
                >
                  <img src={item} alt="example" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <button onClick={() => (move && move.right ? move.right() : null)} className="buttonNext">
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
      <button onClick={() => (move && move.left ? move.left() : null)} className="buttonBack">
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
