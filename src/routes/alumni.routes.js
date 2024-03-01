import { Router } from "express";
import {
  addAlumni,
  getAlumnis,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
} from "../controllers/alumni.controller.js";

const router = Router();

router.route("/add").post(addAlumni);
router.route("/get").get(getAlumnis);
router.route("/getById").get(getAlumniById);
router.route("/update").put(updateAlumni);
router.route("/delete").delete(deleteAlumni);

export const alumniRouter = router;
