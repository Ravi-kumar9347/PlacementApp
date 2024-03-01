import { Router } from "express";
import {
  addCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";

const router = Router();

router.route("/add").post(addCompany);
router.route("/get").get(getCompanies);
router.route("/getById").get(getCompanyById);
router.route("/update").put(updateCompany);
router.route("/delete").delete(deleteCompany);

export const companyRouter = router;
