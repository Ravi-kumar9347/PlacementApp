import { Router } from "express";
import {
  signUp,
  signIn,
  getUserData,
  tokenIsValid,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/").get(auth, getUserData);
router.post("/tokenIsValid", tokenIsValid);

export const userRouter = router;
