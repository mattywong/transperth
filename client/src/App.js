import React from "react";
import {
  Route,
  Link,
  Switch,
  BrowserRouter,
  StaticRouter,
} from "react-router-dom";
import { hot } from "react-hot-loader/root";

import { createGlobalStyle } from "styled-components";

import Transperth from "./ui/Transperth";
import HttpStatus from "./ui/HttpStatus";
import Giphy from "./ui/Giphy";
import Carousel from "./ui/Carousel";

import { ServerContext, useServerContext } from "./state/ServerContext";

const Router = typeof window === "undefined" ? StaticRouter : BrowserRouter;

const App = ({ location, context, state: ServerState }) => {
  const { state, deleteStateKey } = useServerContext(ServerState);

  const GlobalStyle = createGlobalStyle``;
  return (
    <ServerContext.Provider value={{ ...state, deleteStateKey }}>
      <Router location={location} context={context}>
        <GlobalStyle />
        <div>
          <Link to="/">Home</Link>
          <Link to="/transperth">Transperth</Link>
          <Link to="/giphy">giphy</Link>
          <Link to="/404">404</Link>
          <Link to="/carousel">Carousel</Link>
        </div>

        <Switch>
          <Route path="/" exact render={() => <p>Home</p>} />
          <Route path="/giphy/" component={Giphy} />
          <Route path="/transperth/" component={Transperth} />
          <Route path="/carousel/" component={Carousel} />
          <Route render={() => <HttpStatus code={404}>Not found</HttpStatus>} />
        </Switch>
      </Router>
    </ServerContext.Provider>
  );
};

export default hot(App);
