# Custom React Carousel

May god have mercy on these bugs.

## Bugs

- Dragging too fast causes slides to teleport back on array reorder(moveLeft/Right?). It can also cause animations to break (it adds transition to last element, meaning it flies across)
- Slide div sets the height, completely breaks if there's multiple children/ more complex width settings on the child

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
