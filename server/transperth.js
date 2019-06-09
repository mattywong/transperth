import express from "express";

import transperthMiddleware from "./middleware/transperth";

const router = express.Router();

router.get("/transperth", transperthMiddleware);
router.get("/api/transperth", transperthMiddleware, async (req, res, next) => {
  res.json(res.locals);
});

export default router;
