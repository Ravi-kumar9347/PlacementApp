import { Router } from "express";
import { addcompany, getCompanies } from "../controllers/company.controller.js";

const router = Router();

router.route("/add").post(addcompany);
router.route("/getCompanyList").get(getCompanies);

export const companyRouter = router;
