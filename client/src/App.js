import React from "react";
import { hot } from "react-hot-loader/root";

const App = props => (
  <button onClick={e => console.log("test")}>hello world</button>
);

export default hot(App);
