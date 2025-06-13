import { Router } from "express";
import { registerUser } from "../controllers/user.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/register").post(registerUser);

// secured routes

export default router;
