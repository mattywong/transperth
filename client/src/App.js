import React from "react";

import { Route, Link } from "react-router-dom";
import HelloWorld from "./ui/HelloWorld";
import { hot } from "react-hot-loader/root";
import { createGlobalStyle } from "styled-components";

const App = props => {
  const GlobalStyle = createGlobalStyle`
    body {
        background: beige;
        margin: 0;
    }
`;

  return (
    <>
      <GlobalStyle />
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/about">About</Link>

      <Route path="/" exact render={() => <p>Home</p>} />
      <Route path="/about/" render={() => <p>About</p>} />
      <Route path="/users/" component={HelloWorld} />
    </>
  );
};

export default hot(App);
