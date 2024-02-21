import { Router } from "express";
import { addResource } from "../controllers/resource.controller.js";

const router = Router();

router.route("/create").post(addResource);

export const resourceRouter = router;
