import React from "react";
import styled from "styled-components";

const HelloWorld = props => {
  const [state, setState] = React.useState(0);

  const increment = React.useCallback(() => {
    setState(state + 1);
  }, [state, setState]);

  const decrement = React.useCallback(() => {
    setState(state - 1);
  }, [state, setState]);

  return (
    <div>
      <button onClick={increment}>Add</button>
      {state}
      <button onClick={decrement}>Minus</button>
    </div>
  );
};
export default HelloWorld;
