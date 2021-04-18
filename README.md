# Custom React Carousel

May god have mercy on these bugs.

Live demo can be found [here](https://custom-react-carousel.netlify.app/).

## Bugs

- Dragging too fast causes slides to teleport back once array reorder fires(origin: moveLeft/Right?). It can also cause animations to break (it adds transition to last element, meaning it flies across), most likely wrong direction variable attached
- Item 3 in image array has no previous/next distance for "DRAG ENDED"

## To Do

- Change bounce direction based on sliderWidth/2 > mouseDrag
- Change navigation buttons size for mobile
- Refactor reducer/carousel component
- Add carousel hook
- Modify for video playback

## Installation

Install the dependencies and start the server.

```sh
npm install
npm start
```
