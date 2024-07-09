import { Router } from "express";
import {
  addWorkshop,
  getWorkshops,
} from "../controllers/workshop.controller.js";

const router = Router();

router.route("/add").post(addWorkshop);
router.route("/get").get(getWorkshops);

export const workshopsRouter = router;
