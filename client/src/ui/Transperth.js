import React from "react";

import ServerContext from "../state/ServerContext";

const Transperth = props => {
  const serverState = React.useContext(ServerContext);
  console.log(serverState);
  return <p>test</p>;
};

export default Transperth;
