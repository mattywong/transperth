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

const useServerState = ServerState => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "DELETE_SERVER_STATE":
        if (state[action.payload.key]) {
          const nextState = { ...state };
          delete nextState[action.payload.key];
          return nextState;
        }
        return state;
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, ServerState);

  const deleteStateKey = React.useCallback(
    key =>
      dispatch({
        type: "DELETE_SERVER_STATE",
        payload: {
          key
        }
      }),
    [dispatch]
  );

  return {
    state,
    deleteStateKey
  };
};

const App = ({ location, context, state: ServerState }) => {
  const { state, deleteStateKey } = useServerState(ServerState);

  const GlobalStyle = createGlobalStyle`
    body {
        background: beige;
        margin: 0;
    }
`;

  return (
    <ServerContext.Provider value={{ ...state, deleteStateKey }}>
      <Router location={location} context={context}>
        <GlobalStyle />
        <Link to="/">Home</Link>
        <Link to="/transperth">Transperth</Link>
        <Link to="/404">404</Link>
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
