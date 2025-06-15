import mongoose, { Document, Schema } from "mongoose";

interface Message {
  question: string;
  answer: string;
  timestamp?: Date;
}

export interface ChatTypes extends Document {
  _id: string;
  uuid: string;
  madeBy: string;
  title: string;
  messages: Message[];
}

const chatSchema: Schema<ChatTypes> = new Schema(
  {
    madeBy: {
      type: String,
      required: [true, "Madeby is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    uuid: {
      type: String,
      required: [true, "UUID is required"],
      unique: true,
    },
    messages: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model<ChatTypes>("Chat", chatSchema);
