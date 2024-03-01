import { Router } from "express";
import {
  addResource,
  getResources,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller.js";

const router = Router();

router.route("/add").post(addResource);
router.route("/get").get(getResources);
router.route("/update").put(updateResource);
router.route("/delete").delete(deleteResource);

export const resourceRouter = router;
