import { Router } from "express";
import {
  getChat,
  addMessageToChat,
  createNewChat,
  getAllChatTitles,
} from "../controllers/chat.controllers";

const router = Router();

router.route("/").post(createNewChat);
router.route("/add-message").post(addMessageToChat);
router.route("/get-chat").post(getChat);
router.route("/get-titles").post(getAllChatTitles);

export default router;
