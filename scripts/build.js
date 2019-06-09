import webpack from "webpack";
import webpackServerConfig from "../webpack.config.server.js";
import webpackClientConfig from "../webpack.config.client.prod.js";

const outputErrors = (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error(info.errors);
  }
  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
};

const serverCompiler = webpack(webpackServerConfig);
serverCompiler.run((err, stats) => {
  outputErrors(err, stats);
});

const clientCompiler = webpack(webpackClientConfig);
clientCompiler.run((err, stats) => {
  outputErrors(err, stats);
});
