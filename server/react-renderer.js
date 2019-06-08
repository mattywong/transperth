import React from "react";
import express from "express";

import fs from "fs-extra";
import path from "path";

import { renderToString, renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { StaticRouter } from "react-router-dom";

const router = express.Router();

const renderAppToNodeStream = async (req, res, next) => {
  res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
  res.write("<div id='root'>");

  await import("../client/src/App.js")
    .then(Component => {
      const context = {};
      const sheet = new ServerStyleSheet();

      const jsx = sheet.collectStyles(
        <StaticRouter location={req.originalUrl} context={context}>
          <Component.default />
        </StaticRouter>
      );

      const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx));

      stream.pipe(
        res,
        { end: false }
      );

      stream.on("end", () => {
        console.log(context);
        console.log(res);
        // res.status(context.status || 200);

        res.write("</div>");
        res.write(`<script src="/bundle.js"></script>`);
        res.write("</body></html>");
        return res.end();
      });
    })
    .catch(next);
};

const renderAppToString = async (req, res, next) => {
  const template = await fs.readFile(
    path.resolve(__dirname, "../client/index.html"),
    "utf8"
  );

  await import("../client/src/App.js")
    .then(Component => {
      const context = {};

      const sheet = new ServerStyleSheet();
      try {
        const app = renderToString(
          sheet.collectStyles(
            <Component.default location={req.originalUrl} context={context} />
          )
        );

        const styleTags = sheet.getStyleTags(); // or sheet.getStyleElement();

        const scripts = `
        <script>
          ReactDOM.hydrate(
            React.createElement(window.__CLIENT__.App, {}),
            document.getElementById("root")
          )
        </script>
          `;

        const html = template
          .replace("<!-- STYLES -->", styleTags)
          .replace("<!-- CONTENT -->", app)
          .replace("<!-- SCRIPTS -->", scripts);

        console.log(context);

        res.status(context.status || 200);
        res.send(html);
      } catch (error) {
        next(error);
      } finally {
        sheet.seal();
      }
    })
    .catch(next);
};

// router.get("*", async (req, res, next) => {});
// router.get("*", renderAppToNodeStream);
router.get("*", renderAppToString);

export default router;
