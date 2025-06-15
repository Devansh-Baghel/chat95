import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Chat } from "../models/chat.model";

export const createNewChat = asyncHandler(async (req, res) => {
  const { title, madeBy, question, answer, uuid } = req.body;

  if (!madeBy) throw new ApiError(400, "Madeby is required");
  if (!title) throw new ApiError(400, "Title is required");
  if (!question) throw new ApiError(400, "Question is required");
  if (!answer) throw new ApiError(400, "Answer is required");
  if (!uuid) throw new ApiError(400, "UUID is required");

  const newChat = await Chat.create({
    madeBy,
    title,
    messages: [{ question, answer }],
    uuid,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newChat, "New chat created sucessfully"));
});

export const addMessageToChat = asyncHandler(async (req, res) => {
  const { chatId, question, answer } = req.body;

  if (!chatId) throw new ApiError(400, "Chat id is required");
  if (!question) throw new ApiError(400, "Question is required");
  if (!answer) throw new ApiError(400, "Answer is required");

  const chat = await Chat.findById(chatId);

  if (!chat) throw new ApiError(404, "Chat not found");

  chat.messages.push({ question, answer });

  await chat.save();

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Message added to chat successfully"));
});

export const getChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) throw new ApiError(400, "Chat id is required");

  const chat = await Chat.findById(chatId);

  if (!chat) throw new ApiError(404, "Chat not found");

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Chat found successfully"));
});
