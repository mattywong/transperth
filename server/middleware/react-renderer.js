import React from "react";

import fs from "fs-extra";
import path from "path";

import { renderToString, renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { StaticRouter } from "react-router-dom";

import serialize from "serialize-javascript";

export const renderReactAppToNodeStream = async (req, res, next) => {
  res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
  res.write("<div id='root'>");

  await import("../../client/src/App.js")
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

export const renderReactAppToString = async (req, res, next) => {
  const template = await fs.readFile(
    path.resolve(__dirname, "../client/index.html"),
    "utf8"
  );

  const state = res.locals;

  await import("../../client/src/App.js")
    .then(Component => {
      const context = {};

      const sheet = new ServerStyleSheet();
      try {
        const app = renderToString(
          sheet.collectStyles(
            <Component.default
              location={req.originalUrl}
              context={context}
              state={state}
            />
          )
        );

        const styleTags = sheet.getStyleTags(); // or sheet.getStyleElement();

        const scripts = `
          <script>
            ReactDOM.hydrate(
              React.createElement(window.App, { state: ${serialize(
                res.locals
              )} }),
              document.getElementById("root")
            )
          </script>
            `;

        const html = template
          .replace("<!-- STYLES -->", styleTags)
          .replace("<!-- CONTENT -->", app)
          .replace("<!-- SCRIPTS -->", scripts);

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
