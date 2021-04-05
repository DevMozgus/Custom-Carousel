# Custom React Carousel

May god have mercy on these bugs.

Live demo can be found [here](https://custom-react-carousel.netlify.app/).

## Bugs

- Dragging too fast causes slides to teleport back once array reorder fires(origin: moveLeft/Right?). It can also cause animations to break (it adds transition to last element, meaning it flies across), most likely wrong direction variable attached
- Slide div sets the carousel height, it completely breaks if there's multiple children/ more complex width settings on the child
- Window zoom can cause funky behaviour (causes mouseXPosition to increase xTravelSize, previousX - currentX = stinkyX)
- On resize/zoom the carousel height sometimes doesn't adjust to the largest image

## To Do

- Refactor reducer/carousel component
- Modify for video playback
- Change to ts

## Installation

Install the dependencies and start the server.

```sh
npm install
npm start
```
