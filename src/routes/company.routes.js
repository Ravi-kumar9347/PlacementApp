import { Router } from "express";
import { addcompany } from "../controllers/company.controller.js";

const router = Router();

router.route("/add").post(addcompany);

export const companyRouter = router;
