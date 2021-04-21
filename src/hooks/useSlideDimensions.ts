import { useState, useEffect } from "react"

function calculateSlideWidth(visibleSlides: number): number {
  return window.innerWidth / visibleSlides
}

function calculateSlideHeight(visibleSlides: number, widthToHeightRatio: number): number {
  return (window.innerWidth / visibleSlides) * widthToHeightRatio
}

export function useSlideDimensions(visibleSlides: number, widthToHeightRatio: number): number[] {
  const [slideWidth, setSlideWidth] = useState(calculateSlideWidth(visibleSlides))
  const [slideHeight, setSlideHeight] = useState(calculateSlideHeight(visibleSlides, widthToHeightRatio))

  const dependency = typeof window !== "undefined" && window.innerWidth
  useEffect(() => {
    function handleResize() {
      setSlideWidth(calculateSlideWidth(visibleSlides))
      setSlideHeight(calculateSlideHeight(visibleSlides, widthToHeightRatio))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [dependency, visibleSlides, widthToHeightRatio])

  return [slideWidth, slideHeight]
}
