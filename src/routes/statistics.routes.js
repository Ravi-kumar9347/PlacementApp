import { Router } from "express";
import { addStatistics } from "../controllers/statistics.controller.js";

const router = Router();

router.route("/add").post(addStatistics);

export const statisticsRouter = router;
