import CarouselTemp from "./Carousel"

import "./App.scss"

export default function App() {
  return (
    <div>
      <CarouselTemp fullscreen={false} images={images} widthToHeightRatio={1.5} />
    </div>
  )
}

const images = [
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.2Hs4rhrsS42VyynNlDaZ9wAAAA%26pid%3DApi&f=1",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.meep-cgdqNoowVLn2kockgAAAA%26pid%3DApi&f=1",
  "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fthumb9.shutterstock.com%2Fdisplay_pic_with_logo%2F121426%2F116569906%2Fstock-photo-happy-healthy-woman-with-salad-116569906.jpg&f=1&nofb=1",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhookagency.com%2Fwp-content%2Fuploads%2F2017%2F07%2Fsuch-wierd-stock-photos.jpg&f=1&nofb=1",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Flaughing-hispanic-guy-sofa-loves-green-salad-blue-shirt-fresh-healthy-38122549.jpg&f=1&nofb=1",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.0A4YteuzDO-FqfIPKZNWMwAAAA%26pid%3DApi&f=1",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.kaQu2Q03uWTjxy6kjL3wYgHaE8%26pid%3DApi&f=1",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.ebaumsworld.com%2FmediaFiles%2Fpicture%2F718392%2F84890872.png&f=1&nofb=1",
]
