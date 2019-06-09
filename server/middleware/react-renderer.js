import React from "react";

import fs from "fs-extra";
import path from "path";

import { renderToString, renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

import serialize from "serialize-javascript";

// export const renderReactAppToNodeStream = async (req, res, next) => {
//   res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
//   res.write("<div id='root'>");

//   await import("../../client/src/App.js")
//     .then(Component => {
//       const context = {};
//       const sheet = new ServerStyleSheet();

//       const jsx = sheet.collectStyles(
//         <StaticRouter location={req.originalUrl} context={context}>
//           <Component.default />
//         </StaticRouter>
//       );

//       const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx));

//       stream.pipe(
//         res,
//         { end: false }
//       );

//       stream.on("end", () => {
//         console.log(context);
//         console.log(res);
//         // res.status(context.status || 200);

//         res.write("</div>");
//         res.write(`<script src="/bundle.js"></script>`);
//         res.write("</body></html>");
//         return res.end();
//       });
//     })
//     .catch(next);
// };

export const renderReactAppToString = ({ template }) => async (
  req,
  res,
  next
) => {
  const _template = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Page Title</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
  
      <!-- STYLES -->
    </head>
    <body>
      <div id="root"><!-- CONTENT --></div>
      <script src="/bundle.js"></script>
  
      <!-- SCRIPTS -->
    </body>
  </html>
  `;
  
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

        const html = _template
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
