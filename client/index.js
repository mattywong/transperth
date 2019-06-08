import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./src/App";
// ReactDOM.hydrate(
//   <BrowserRouter>

//   </BrowserRouter>,
//   document.getElementById("root")
// );

window.React = React;
window.ReactDOM = ReactDOM;
window.__CLIENT__ = {};
window.__CLIENT__.App = App;
