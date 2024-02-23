import { Router } from "express";
import { pushCompanyUpdate } from "../controllers/companyUpdates.controller.js";

const router = Router();

router.route("/pushCompanyUpdate").post(pushCompanyUpdate);

export const companyUpdatesRouter = router;