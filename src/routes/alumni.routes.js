import { Router } from "express";
import {
  addAlumni,
  getAlumni,
  getAlumniByUserName,
  deleteAlumni,
} from "../controllers/alumni.controller.js";

const router = Router();

router.route("/add").post(addAlumni);
router.route("/get").get(getAlumni);
router.route("/getById").get(getAlumniByUserName);
router.route("/delete").delete(deleteAlumni);

export const alumniRouter = router;
