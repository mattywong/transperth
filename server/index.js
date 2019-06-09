import express from "express";
import http from "http";
import path from "path";

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import webpack from "webpack";
import config from "../webpack.config.client.js";

import serverRouter from "./app";

const compiler = webpack(config);

const createWatcher = pathName => {
  const chokidar = require("chokidar");
  let srcPath = path.resolve(__dirname, pathName);
  srcPath = path.parse(srcPath);

  const watcher = chokidar.watch(path.resolve(__dirname, pathName));

  const regex = new RegExp(`[/\\\\]${srcPath.name}[/\\\\]`);

  watcher.on("ready", () => {
    watcher.on("all", () => {
      console.log("Clearing /%s/ module cache from server", srcPath.name);
      Object.keys(require.cache).forEach(id => {
        if (regex.test(id)) {
          delete require.cache[id];
          console.log("Deleted module %s", id);
        }
      });
    });
  });
};

const appRouter =
  process.env.NODE_ENV === "production"
    ? serverRouter
    : async (req, res, next) => {
        const importedModule = await import("./app");
        importedModule.default(req, res, next);
      };

async function start() {
  const app = express();
  const server = http.createServer(app);

  // setup watch on server and client
  if (process.env.NODE_ENV !== "production") {
    createWatcher("../server");
    createWatcher("../client");

    // Do "hot-reloading" of react stuff on the server
    // Throw away the cached client modules and let them be re-required next time
    compiler.plugin("done", function() {
      console.log("Clearing /client/ module cache from server");
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]client[\/\\]/.test(id)) {
          delete require.cache[id];
        }
      });
    });

    // Serve hot-reloading bundle to client
    app.use(
      webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
      })
    );
    app.use(webpackHotMiddleware(compiler));
  }

  // hot reloaded server routes and everything else
  app.use(appRouter);

  server.on("error", console.error);

  server.listen(process.env.PORT || 8080, err => {
    if (err) {
      throw err;
    }
    console.log("Server started on port %s", server.address().port);
  });
}

start().catch(console.error);
