import React from "react";
import express from "express";
import path from "path";
import { renderToString, renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

import fs from "fs";

const _path = path.resolve(__dirname, "../client/index.html");
const template = fs.readFileSync(_path, "utf8");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
  res.write("<div id='root'>");
  await import("../client/src/App.js")
    .then(Component => {
      const sheet = new ServerStyleSheet();

      const jsx = sheet.collectStyles(<Component.default />);

      const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx));

      stream.pipe(
        res,
        { end: false }
      );

      stream.on("end", () => res.end("</body></html>"));

      //   console.log(styleTags);
      // } catch (error) {
      //   // handle error
      //   console.error(error);
      // } finally {
      //   sheet.seal();
      // }

      // let page = template.replace("<!-- CONTENT -->", html);
      // page = page.replace("<!-- STYLES -->", styleTags);
      // res.send(page);
    })
    .catch(next);
});

export default router;
