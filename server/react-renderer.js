import React from "react";
import express from "express";
import path from "path";
import { renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { StaticRouter } from "react-router-dom";

// import fs from "fs";

const _path = path.resolve(__dirname, "../client/index.html");
// const template = fs.readFileSync(_path, "utf8");
const router = express.Router();

router.get("*", async (req, res, next) => {
  res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
  res.write("<div id='root'>");
  await import("../client/src/App.js")
    .then(Component => {
      const sheet = new ServerStyleSheet();
      console.log(req);
      const jsx = sheet.collectStyles(
        <StaticRouter location={req.originalUrl} context={{}}>
          <Component.default />
        </StaticRouter>
      );

      const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx));

      stream.pipe(
        res,
        { end: false }
      );

      stream.on("end", () => {
        res.write("</div>");
        res.write(`<script src="/bundle.js"></script>`);

        res.end("</body></html>");
      });
    })
    .catch(next);
});

export default router;
