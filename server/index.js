import express from "express";

const router = express.Router();

const load = filePath => async (req, res, next) => {
  const importedModule = await import(filePath);
  importedModule.default(req, res, next);
};

router.use("/transperth", load("./transperth"));

export default router;
