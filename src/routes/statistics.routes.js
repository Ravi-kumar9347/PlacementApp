import { Router } from "express";
import {
  addOrUpdateStatistics,
  getStatistics,
  deleteStatistics,
} from "../controllers/statistics.controller.js";

const router = Router();

router.route("/add").post(addOrUpdateStatistics);
router.route("/get").get(getStatistics);
router.route("/delete").delete(deleteStatistics);

export const statisticsRouter = router;
