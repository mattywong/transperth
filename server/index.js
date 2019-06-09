import express from "express";

import serverRouter from "./app";
const router = express.Router();

// hot reloaded server routes and everything else
router.use(serverRouter);

export default router;
