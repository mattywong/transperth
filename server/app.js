import express from "express";
import bodyParser from "body-parser";
import path from "path";
import compression from "compression";

import transperth from "./transperth";
import { renderReactAppToString } from "./middleware/react-renderer.js";

const router = express.Router();

router.use(compression());

router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

// public folder
const wwwrootPath = path.resolve(__dirname, "../wwwroot");

router.use("/", express.static(wwwrootPath));

// in production, client scripts get built to ./dist/wwwroot
// so expose out these static files as well
if (process.env.NODE_ENV === "production") {
  router.use("/", express.static(path.resolve(__dirname, "./wwwroot")));
}

// transperth router handles api/transperth,
// and adding state to res.locals on /transperth route
// so our react app can get initial state
router.use(transperth);

// react router will take over
router.use(
  renderReactAppToString({
    template: path.resolve(__dirname, "../wwwroot/index.html")
  })
);

// error handling
router.use(async (err, req, res, next) => {
  res.status = err.status || 500;
  res.json({
    ...err,
    message: err.message
  });
});

export default router;
