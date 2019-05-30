import React from "react";
import App from "./client/src/App";
import path from "path";
import { renderToString } from "react-dom/server";
import fs from "fs";

const _path = path.resolve("./client/index.html");
console.log(_path);

const template = fs.readFileSync(_path, "utf8");

const renderApp = (path, callback) => {
  const renderedApp = renderToString(<App />);
  const page = template.replace("<!-- CONTENT -->", renderedApp);
  callback(null, page);
};

export default renderApp;
