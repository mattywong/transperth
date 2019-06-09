import express from "express";

import transperthMiddleware from "./middleware/transperth";

const router = express.Router();

router.get("/transperth", transperthMiddleware);
router.get("/api/transperth", async (req, res, next) => {
  res.send(res.locals);
});

export default router;
