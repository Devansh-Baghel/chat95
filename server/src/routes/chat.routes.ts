import { Router } from "express";
import {
  getChat,
  addMessageToChat,
  createNewChat,
} from "../controllers/chat.controllers";

const router = Router();

router.route("/").post(createNewChat);
router.route("/add-message").post(addMessageToChat);
router.route("/get-chat").post(getChat);

export default router;
