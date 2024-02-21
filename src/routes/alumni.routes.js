import { Router } from "express";
import { addAlumni } from "../controllers/alumni.controller.js";

const router = Router();

router.route("/create").post(addAlumni);

export const alumniRouter = router;
