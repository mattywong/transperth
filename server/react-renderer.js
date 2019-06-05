import React from "react";
import express from "express";
import path from "path";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";

import fs from "fs";

const _path = path.resolve(__dirname, "../client/index.html");
const template = fs.readFileSync(_path, "utf8");
const router = express.Router();

router.get("/", async (req, res, next) => {
  await import("../client/src/App.js")
    .then(Component => {
      const sheet = new ServerStyleSheet();
      let html, styleTags;
      try {
        html = renderToString(sheet.collectStyles(<Component.default />));
        styleTags = sheet.getStyleTags(); // or sheet.getStyleElement();

        console.log(styleTags);
      } catch (error) {
        // handle error
        console.error(error);
      } finally {
        sheet.seal();
      }

      let page = template.replace("<!-- CONTENT -->", html);
      page = page.replace("<!-- STYLES -->", styleTags);
      res.send(page);
    })
    .catch(next);
});

export default router;
