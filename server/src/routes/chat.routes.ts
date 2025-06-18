import { Router } from "express";
import {
  getChat,
  addMessageToChat,
  createNewChat,
  getAllChatTitles,
  deleteChat,
} from "../controllers/chat.controllers";

const router = Router();

router.route("/").post(createNewChat);
router.route("/add-message").post(addMessageToChat);
router.route("/get-chat").post(getChat);
router.route("/get-titles").post(getAllChatTitles);
router.route("/delete-chat").post(deleteChat);

export default router;
