import React from "react";
import styled from "styled-components";

const Canvas = styled.canvas`
  width: 100%;
  height: 900px;

  &:hover {
    cursor: none;
  }
`;

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "UPDATE_BG_COLOR":
      return {
        ...state,
        bgColor: payload.bgColor
      };
    case "MOUSE_MOVE":
      return {
        ...state,
        mouse: payload.mouse
      };
    case "MOUSE_DOWN":
      return {
        ...state,
        mouseDown: true
      };

    case "MOUSE_UP":
      return {
        ...state,
        mouseDown: false
      };

    default:
      return state;
  }
};

//get DPI

let dpi = typeof window === "undefined" ? 1 : window.devicePixelRatio;

const Giphy = props => {
  const canvasRef = React.useRef();
  const [state, dispatch] = React.useReducer(reducer, {
    bgColor: "black",
    mouse: [0, 0]
  });

  // draw function
  React.useEffect(() => {
    const canvas = canvasRef.current;

    let style_height = +getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);
    let style_width = +getComputedStyle(canvas)
      .getPropertyValue("width")
      .slice(0, -2);

    canvas.setAttribute("height", style_height * dpi);
    canvas.setAttribute("width", style_width * dpi);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.fillStyle = "orange";
    ctx.strokeStyle = "white";
    ctx.arc(state.mouse[0], state.mouse[1], 8, 0, 2 * Math.PI);
    ctx.stroke();

    if (state.mouseDown) {
      ctx.fill();
    }
  }, [state]);

  const handleClick = React.useCallback(
    e => {
      dispatch({
        type: "UPDATE_BG_COLOR",
        payload: {
          bgColor: e.target.value
        }
      });
    },
    [dispatch]
  );

  const handleMouseMove = React.useCallback(
    e => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      dispatch({
        type: "MOUSE_MOVE",
        payload: {
          mouse: [e.clientX - rect.left, e.clientY - rect.top]
        }
      });
    },
    [dispatch, canvasRef]
  );

  const handleMouseDown = React.useCallback(
    e => {
      dispatch({
        type: "MOUSE_DOWN"
      });
    },
    [dispatch, canvasRef]
  );

  const handleMouseUp = React.useCallback(
    e => {
      dispatch({
        type: "MOUSE_UP"
      });
    },
    [dispatch, canvasRef]
  );

  return (
    <div>
      <button onClick={handleClick} value="red">
        Red
      </button>
      <button onClick={handleClick} value="blue">
        Blue
      </button>
      <Canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Giphy;
