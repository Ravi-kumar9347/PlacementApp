import { Router } from "express";
import { addResource } from "../controllers/resource.controller.js";

const router = Router();

router.route("/add").post(addResource);

export const resourceRouter = router;
