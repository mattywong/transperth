import React from "react";

import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

import serialize from "serialize-javascript";

import { minify } from "html-minifier";

export const renderReactAppToString = ({ template }) => async (
  req,
  res,
  next
) => {
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

        let html = template
          .replace("<!-- STYLES -->", styleTags)
          .replace("<!-- CONTENT -->", app)
          .replace("<!-- SCRIPTS -->", scripts);

        if (process.env.NODE_ENV === "production") {
          html = minify(html, {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true,
            collapseBooleanAttributes: true,
            minifyJS: true,
            minifyCSS: true
          });
        }

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
