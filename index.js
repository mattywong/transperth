import express from "express";
import http from "http";
import WebSocket from "ws";
import bodyParser from "body-parser";
const isProduction = process.env.NODE_ENV === "production";

async function start() {
  // setup watch on serrver
  if (!isProduction) {
    const chokidar = require("chokidar");
    const watcher = chokidar.watch("./server");
    watcher.on("ready", function() {
      watcher.on("all", function() {
        console.log("Clearing /server/ module cache from server");
        Object.keys(require.cache).forEach(function(id) {
          if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
        });
      });
    });
  }

  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // client app
  app.use("/", express.static("./wwwroot"));
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
