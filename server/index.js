import express from "express";
import bodyParser from "body-parser";
import path from "path";
import compression from "compression";

const router = express.Router();

const load = filePath => async (req, res, next) => {
  const importedModule = await import(filePath);
  importedModule.default(req, res, next);
};

router.use(compression());

router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

// public folder
const wwwrootPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "./wwwroot")
    : path.resolve(__dirname, "../wwwroot");

router.use("/", express.static(wwwrootPath));

router.use("/transperth", load("./transperth"));

// react router will take over
router.use("*", load("./react-renderer"));

// error handling
router.use(async (err, req, res, next) => {
  res.status = err.status || 500;
  res.json({
    ...err,
    message: err.message
  });
});

export default router;
