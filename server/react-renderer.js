import React from "react";
import express from "express";
import path from "path";
import { renderToString } from "react-dom/server";
import fs from "fs";

const _path = path.resolve(__dirname, "../client/index.html");
const template = fs.readFileSync(_path, "utf8");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await import("../client/src/App.js")
    .then(Component => {
      const renderedApp = renderToString(<Component.default />);
      const page = template.replace("<!-- CONTENT -->", renderedApp);
      res.send(page);
    })
    .catch(next);
});

export default router;
