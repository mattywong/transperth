import express from "express";
import bodyParser from "body-parser";
import path from "path";
import compression from "compression";

import transperth from "./transperth";
import { renderReactAppToString } from "./middleware/react-renderer.js";

const template = `

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
    ${
      process.env.NODE_ENV === "production"
        ? `
        <script src="/build/runtime.min.js"></script>
        <script src="/build/app.min.js"></script>
        `
        : `<script src="/build/bundle.js"></script>`
    }

    <!-- SCRIPTS -->
  </body>
</html>
`;

const router = express.Router();

router.use(compression());

router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

// public folder
const wwwrootPath = path.resolve(__dirname, "../wwwroot");
router.use("/", express.static(wwwrootPath));

// transperth router handles api/transperth,
// and adding state to res.locals on /transperth route
// so our react app can get initial state
router.use(transperth);

// react router will take over
router.use(
  renderReactAppToString({
    template
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
