import React from "react";

import { Route, Link, Switch } from "react-router-dom";
import HelloWorld from "./ui/HelloWorld";
import { hot } from "react-hot-loader/root";
import { createGlobalStyle } from "styled-components";

import { BrowserRouter, StaticRouter } from "react-router-dom";

const Router = typeof window === "undefined" ? StaticRouter : BrowserRouter;
const Status = ({ code, children }) => {
  return (
    <Route
      render={props => {
        const { staticContext } = props;
        if (staticContext) {
          staticContext.status = code;
        }

        return children;
      }}
    />
  );
};

const App = ({ location, context }) => {
  const GlobalStyle = createGlobalStyle`
    body {
        background: beige;
        margin: 0;
    }
`;
  //   console.log(location, context);
  return (
    <Router location={location} context={context}>
      <GlobalStyle />
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/about">About</Link>

      <Switch>
        <Route path="/" exact render={() => <p>Home</p>} />
        <Route path="/about/" render={() => <p>about</p>} />
        <Route path="/users/" component={HelloWorld} />
        <Route render={() => <Status code={404}>Not found</Status>} />
      </Switch>
    </Router>
  );
};

export default hot(App);
