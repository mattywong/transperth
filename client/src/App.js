import React from "react";
import {
  Route,
  Link,
  Switch,
  BrowserRouter,
  StaticRouter
} from "react-router-dom";
import { hot } from "react-hot-loader/root";

import { createGlobalStyle } from "styled-components";

import Transperth from "./ui/Transperth";
import HttpStatus from "./ui/HttpStatus";

import ServerContext from "./state/ServerContext";

const Router = typeof window === "undefined" ? StaticRouter : BrowserRouter;

const App = ({ location, context, state }) => {
  console.log(state);

  const GlobalStyle = createGlobalStyle`
    body {
        background: beige;
        margin: 0;
    }
`;

  return (
    <ServerContext.Provider value={{ ...state }}>
      <Router location={location} context={context}>
        <GlobalStyle />
        <Link to="/">Home</Link>
        <Link to="/hello">Users</Link>
        <Switch>
          <Route path="/" exact render={() => <p>Home</p>} />
          <Route path="/transperth/" component={Transperth} />
          <Route render={() => <HttpStatus code={404}>Not found</HttpStatus>} />
        </Switch>
      </Router>
    </ServerContext.Provider>
  );
};

export default hot(App);
