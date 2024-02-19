import { Router } from "express";
import { createStatistics } from "../controllers/statistics.controller";

const router = Router();

router.route("/create").post(createStatistics);

export default router;
