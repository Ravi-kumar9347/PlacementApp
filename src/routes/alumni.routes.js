import { Router } from "express";
import { addAlumni } from "../controllers/alumni.controller.js";

const router = Router();

router.route("/add").post(addAlumni);

export const alumniRouter = router;
