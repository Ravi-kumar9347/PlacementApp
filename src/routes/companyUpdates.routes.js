import { Router } from "express";
import {
  AddCompanyUpdate,
  getCompanyUpadtesById,
  updateCompanyUpdates,
  deleteCompanyUpdate,
} from "../controllers/companyUpdates.controller.js";

const router = Router();

router.route("/add").post(AddCompanyUpdate);
router.route("/getById").get(getCompanyUpadtesById);
router.route("/update").put(updateCompanyUpdates);
router.route("/delete").delete(deleteCompanyUpdate);

export const companyUpdatesRouter = router;
