import React from "react";
import styled from "styled-components";
import faker from "faker";

import { useSpring, animated } from "react-spring";

const Carousel = styled.div`
  width: 100%;
  height: 1000px;
  display: flex;
  background-color: #fefefe;
  overflow: auto;
`;

Carousel.Slides = styled.div``;

Carousel.Slide = styled.div`
  display: flex;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  margin: 2rem 0;
`;

const CarouselSlider = styled(animated.div)`
  display: block;
  flex: 0 0 60%;

  overflow: hidden;
`;

Carousel.Slider = ({ children }) => {
  // const [state, setState] = React.useState({
  //   style: generateRandomBlob(),
  // });

  const [props, set] = useSpring(() => ({ ...generateRandomBlob() }));

  const handleMouseEnter = () => {
    set({
      ...generateRandomBlob(),
    });
  };

  return (
    <CarouselSlider
      onMouseEnter={handleMouseEnter}
      onMouseOut={handleMouseEnter}
      style={props}
    >
      {children}
    </CarouselSlider>
  );
};

Carousel.Slider.Controls = styled.div``;

Carousel.Slider.Img = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

Carousel.Slide.Caption = styled.div`
  display: block;
  padding: 3rem 3rem;
  flex: 0 0 40%;

  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

  // &:hover {
  //   background-color: #1e1e1e;
  //   color: #fefefe;
  // }
`;

const slides = [
  {
    src:
      "https://images.adsttc.com/media/images/5d02/41cc/284d/d16c/8700/0288/slideshow/4T7A7894.jpg?1560428995",
  },
  {
    src:
      "https://images.adsttc.com/media/images/5d02/424e/284d/d16c/8700/028e/slideshow/DJI_0083.jpg?1560429124",
  },
  {
    src:
      "https://images.adsttc.com/media/images/5d02/4218/284d/d152/0500/01b5/slideshow/DJI_0006.jpg?1560429073",
  },

  {
    src:
      "https://images.adsttc.com/media/images/5d02/41e5/284d/d16c/8700/0289/slideshow/4T7A9835.jpg?1560429020",
  },
  {
    src:
      "https://images.adsttc.com/media/images/5d06/ede9/284d/d17f/3000/0165/slideshow/Dba_Hofstraat_Filip_Dujardin_009.jpg?1560735200",
  },
  {
    src:
      "https://images.adsttc.com/media/images/5d02/423f/284d/d152/0500/01b6/slideshow/DJI_0066.jpg?1560429110",
  },
  {
    src:
      "https://images.adsttc.com/media/images/5d02/426b/284d/d16c/8700/0290/slideshow/DJI_0116.jpg?1560429154",
  },
  {
    src:
      "https://images.adsttc.com/media/images/5d02/42b1/284d/d152/0500/01b9/slideshow/DJI_0062.jpg?1560429224",
  },
];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomBlob() {
  const borderTopLeftRadiusX = randomIntFromInterval(20, 80) + 1;
  const borderTopLeftRadiusY = randomIntFromInterval(20, 80) + 1;

  const borderTopRightRadiusX = 100 - borderTopLeftRadiusX;
  const borderBottomLeftRadiusY = 100 - borderTopLeftRadiusY;

  const borderTopRightRadiusY = randomIntFromInterval(20, 80) + 1;
  const borderBottomRightRadiusY = 100 - borderTopRightRadiusY;

  const borderBottomLeftRadiusX = randomIntFromInterval(20, 80) + 1;
  const borderBottomRightRadiusX = 100 - borderBottomLeftRadiusX;

  return {
    borderTopLeftRadius: `${borderTopLeftRadiusX}% ${borderTopLeftRadiusY}%`,
    borderTopRightRadius: `${borderTopRightRadiusX}% ${borderTopRightRadiusY}%`,
    borderBottomLeftRadius: `${borderBottomLeftRadiusX}% ${borderBottomLeftRadiusY}%`,
    borderBottomRightRadius: `${borderBottomRightRadiusX}% ${borderBottomRightRadiusY}%`,
  };
}

export default props => {
  return (
    <Carousel>
      <Carousel.Slides>
        {slides.map(slide => (
          <Carousel.Slide key={slide.src}>
            <Carousel.Slider>
              <Carousel.Slider.Controls />
              <Carousel.Slider.Img src={slide.src} />
            </Carousel.Slider>

            <Carousel.Slide.Caption>
              <span
                css={`
                  font-size: 1.25rem;
                  letter-spacing: 0.1em;
                  font-family: monospace;
                  margin-bottom: 0.4em;
                `}
              >
                {faker.address.stateAbbr()}
              </span>
              <h1
                css={`
                  font-size: 3rem;
                  font-style: italic;

                  font-family: serif;
                  font-family: Georgia;

                  margin-top: 0;
                  margin-bottom: 1rem;
                `}
              >
                {faker.address.city()}
              </h1>
              <span
                css={`
                  font-weight: bold;
                  font-family: "Courier New";
                  // color: #fefefe;
                `}
              >
                {faker.address.latitude()} {faker.address.longitude()}
              </span>
            </Carousel.Slide.Caption>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
    </Carousel>
  );
};
