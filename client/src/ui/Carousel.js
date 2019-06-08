import React from "react";
import styled from "styled-components";

const Carousel = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: blue;
  overflow: auto;
`;

Carousel.Slide = styled.div`
  flex: 0 0 300px;
  height: 300px;
  background: orange;
`;

export default props => {
  return (
    <Carousel>
      <Carousel.Slide onClick={e => alert("ayyeee")} />
      <Carousel.Slide />
      <Carousel.Slide />
    </Carousel>
  );
};
