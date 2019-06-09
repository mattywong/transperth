const express = require("express");
const http = require("http");
const path = require("path");

const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const webpack = require("webpack");
const config = require("./webpack.config.client.js");
const chokidar = require("chokidar");

const compiler = webpack(config);

const createWatcher = pathName => {
  const srcPath = path.parse(pathName);
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
    ? require("./dist/server").default
    : async (req, res, next) => {
        const importedModule = await import("./server");
        importedModule.default(req, res, next);
      };

async function start() {
  const app = express();
  const server = http.createServer(app);

  // setup watch on server and client
  if (process.env.NODE_ENV !== "production") {
    createWatcher(path.resolve(__dirname, "./server"));
    createWatcher(path.resolve(__dirname, "./client"));

    // Do "hot-reloading" of react stuff on the server
    // Throw away the cached client modules and let them be re-required next time
    compiler.plugin("done", function() {
      console.log("Clearing /client/ module cache from server");
      Object.keys(require.cache).forEach(function(id) {
        if (/[/\\\\]client[/\\\\]/.test(id)) {
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
