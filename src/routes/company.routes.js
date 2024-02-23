import { Router } from "express";
import { addcompany, getCompanies, getCompanyById} from "../controllers/company.controller.js";

const router = Router();

router.route("/add").post(addcompany);
router.route("/getCompanyList").get(getCompanies);
router.route("/getCompanyById").get(getCompanyById);

export const companyRouter = router;
