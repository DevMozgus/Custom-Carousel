import { useReducer, useEffect, useState } from "react"
import { useSwipeable, SwipeableHandlers, EventData } from "react-swipeable"
import CarouselTemp from "./Carousel"

import "./App.scss"

function App() {
  return (
    <>
      <CarouselTemp visibleSlides={3} offset={150}>
        {images.map((img, index) => (
          <img key={index} src={img.image} />
        ))}
      </CarouselTemp>
    </>
  )
}

const videos = [
  "https://firebasestorage.googleapis.com/v0/b/wms-website-ab4a6.appspot.com/o/PW51QrYfsNad2bK2%2F08.mp4?alt=media&token=a7e1e71c-940b-4a79-a044-445819f48501",
  "https://firebasestorage.googleapis.com/v0/b/wms-website-ab4a6.appspot.com/o/v6Lqrm0sWwyQe66n%2F01.mp4?alt=media&token=de3f9752-7a30-4e58-8c14-113f28f58b0a",
  "https://firebasestorage.googleapis.com/v0/b/wms-website-ab4a6.appspot.com/o/bBJsWoIUQbsLPbP2%2F03.mp4?alt=media&token=e626e144-f6a7-4221-bf67-725654ae1663",
  "https://firebasestorage.googleapis.com/v0/b/wms-website-ab4a6.appspot.com/o/If88N06mLNA845zL%2F04.mp4?alt=media&token=abbcbcab-8133-41c8-8e5c-4269c3dd5d78",
  "https://firebasestorage.googleapis.com/v0/b/wms-website-ab4a6.appspot.com/o/IM7EhKYAUSuktE4p%2F05.mp4?alt=media&token=b0ae8eb5-23c5-44ba-9dac-45e561d540a8",
  "https://firebasestorage.googleapis.com/v0/b/wms-website-ab4a6.appspot.com/o/ffcNVC5ExdcKQ1pv%2F06.mp4?alt=media&token=c740c757-7646-4df6-8342-d54caea3d6f5",
  "https://firebasestorage.googleapis.com/v0/b/wms-website-ab4a6.appspot.com/o/XwbSFFQ32ZZR7nPZ%2F07.mp4?alt=media&token=44426b0c-0e4f-42c6-a861-c944e4320001",
]

const images = [
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.2Hs4rhrsS42VyynNlDaZ9wAAAA%26pid%3DApi&f=1",
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.meep-cgdqNoowVLn2kockgAAAA%26pid%3DApi&f=1",
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fthumb9.shutterstock.com%2Fdisplay_pic_with_logo%2F121426%2F116569906%2Fstock-photo-happy-healthy-woman-with-salad-116569906.jpg&f=1&nofb=1",
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhookagency.com%2Fwp-content%2Fuploads%2F2017%2F07%2Fsuch-wierd-stock-photos.jpg&f=1&nofb=1",
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Flaughing-hispanic-guy-sofa-loves-green-salad-blue-shirt-fresh-healthy-38122549.jpg&f=1&nofb=1",
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.0A4YteuzDO-FqfIPKZNWMwAAAA%26pid%3DApi&f=1",
  },
  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.kaQu2Q03uWTjxy6kjL3wYgHaE8%26pid%3DApi&f=1",
  },

  {
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.ebaumsworld.com%2FmediaFiles%2Fpicture%2F718392%2F84890872.png&f=1&nofb=1",
  },
]

// const initialCarouselState = {
//   offset: 0,
//   desired: 0,
//   active: 0,
// }

// function previous(length, current) {
//   return (current - 1 + length) % length
// }

// function next(length, current) {
//   return (current + 1) % length
// }

// function threshold(target) {
//   const width = target.clientWidth
//   return width / 3
// }

// const transitionTime = 400
// const elastic = `transform ${transitionTime}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`
// const smooth = `transform ${transitionTime}ms ease`

// function carouselReducer(state, action) {
//   switch (action.type) {
//     case "JUMP":
//       return {
//         ...state,
//         desired: action.desired,
//       }
//     case "NEXT":
//       return {
//         ...state,
//         desired: next(action.length, state.active),
//       }
//     case "PREV":
//       return {
//         ...state,
//         desired: previous(action.length, state.active),
//       }
//     case "DONE":
//       return {
//         ...state,
//         offset: NaN,
//         active: state.desired,
//       }
//     case "DRAG":
//       return {
//         ...state,
//         offset: action.offset,
//       }
//     default:
//       return state
//   }
// }

// function Carousel({ children, interval = 2000 }) {
//   const length = children.length
//   const [active, setActive, handlers, style] = useCarousel(length, interval)
//   const slides = children

//   return (
//     length > 0 && (
//       <div className="carousel">
//         <ol className="carousel-indicators">
//           {slides.map((_, index) => (
//             <li onClick={() => setActive(index)} key={index} className={`${active === index ? "active" : ""}`} />
//           ))}
//         </ol>
//         <div className="carousel-content" {...handlers} style={style}>
//           <div className="carousel-item">{slides[slides.length - 1]}</div>
//           {slides.map((slide, index) => (
//             <div className="carousel-item" key={index}>
//               {slide}
//             </div>
//           ))}
//           <div className="carousel-item">{slides[0]}</div>
//         </div>
//       </div>
//     )
//   )
// }

// function swiped(e, dispatch, length, dir) {
//   const t = threshold(e.event.target)
//   const d = dir * e.deltaX

//   if (d >= t) {
//     dispatch({
//       type: dir > 0 ? "NEXT" : "PREV",
//       length,
//     })
//   } else {
//     dispatch({
//       type: "DRAG",
//       offset: 0,
//     })
//   }
// }

// export function useCarousel(length, interval) {
//   const [state, dispatch] = useReducer(carouselReducer, initialCarouselState)
//   const [current, setCurrent] = useState(0)

//   const handlers = useSwipeable({
//     onSwiping(e) {
//       dispatch({
//         type: "DRAG",
//         offset: -e.deltaX,
//       })
//     },
//     onSwipedLeft(e) {
//       swiped(e, dispatch, length, 1)
//     },
//     onSwipedRight(e) {
//       swiped(e, dispatch, length, -1)
//     },
//     trackMouse: true,
//     trackTouch: true,
//   })

//   // useEffect(() => {
//   //   const id = setTimeout(() => dispatch({ type: "NEXT", length }), interval)
//   //   return () => clearTimeout(id)
//   // }, [state.offset, state.active])

//   // useEffect(() => {
//   //   const id = setTimeout(() => dispatch({ type: "DONE" }), transitionTime)
//   //   return () => clearTimeout(id)
//   // }, [state.desired]);

//   const style = {
//     transform: "translateX(0)",
//     width: `${100 * (length + 2)}%`,
//     left: `-${(state.active + 1) * 100}%`,
//   }

//   if (state.desired !== state.active) {
//     const dist = Math.abs(state.active - state.desired)
//     const pref = Math.sign(state.offset || 0)
//     const dir = (dist > length / 2 ? 1 : -1) * Math.sign(state.desired - state.active)
//     const shift = (100 * (pref || dir)) / (length + 2)
//     style.transition = smooth
//     style.transform = `translateX(${shift}%)`
//   } else if (!isNaN(state.offset)) {
//     if (state.offset !== 0) {
//       style.transform = `translateX(${state.offset}px)`
//     } else {
//       style.transition = elastic
//     }
//   }

//   return [state.active, (n) => dispatch({ type: "JUMP", desired: n }), handlers, style]
// }

export default App
