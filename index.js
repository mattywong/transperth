import express from "express";
import http from "http";
import path from "path";
import bodyParser from "body-parser";

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import webpack from "webpack";
import config from "./webpack.config.js";

const isProduction = process.env.NODE_ENV === "production";

const compiler = webpack(config);

const createWatcher = pathName => {
  const chokidar = require("chokidar");
  const watcher = chokidar.watch(path.resolve(__dirname, pathName));

  // remove leading './' from pathName "./clients" => "clients"
  const cacheIdentifier = pathName.substring(2);
  const regex = new RegExp(`[/\\\\]${cacheIdentifier}[/\\\\]`);

  watcher.on("ready", () => {
    watcher.on("all", () => {
      console.log("Clearing /%s/ module cache from server", cacheIdentifier);
      Object.keys(require.cache).forEach(id => {
        if (regex.test(id)) {
          delete require.cache[id];
          console.log("Deleted module %s", id);
        }
      });
    });
  });
};

async function start() {
  const app = express();
  const server = http.createServer(app);

  // setup watch on server and client
  if (!isProduction) {
    createWatcher("./server");
    createWatcher("./client");

    // Do "hot-reloading" of react stuff on the server
    // Throw away the cached client modules and let them be re-required next time
    compiler.plugin("done", function() {
      console.log("Clearing /client/ module cache from server");
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
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

  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // public folder
  app.use("/", express.static(path.resolve(__dirname, "./wwwroot")));

  // hot reloaded server routes and everything else
  app.use(async (req, res, next) => {
    const importedModule = await import("./server");
    importedModule.default(req, res, next);
  });

  // error handling
  app.use(async (err, req, res, next) => {
    // logic
    console.log(err);
    res.status = err.status || 500;
    res.json({
      ...err,
      message: err.message
    });
  });

  server.on("error", console.error);

  server.listen(process.env.PORT || 8080, err => {
    if (err) {
      throw err;
    }
    console.log("Server started on port %s", server.address().port);
  });
}

start().catch(console.error);
