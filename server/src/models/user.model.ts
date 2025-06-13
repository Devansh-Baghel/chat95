import mongoose, { Document, Schema } from "mongoose";

export interface UserTypes extends Document {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

const userSchema: Schema<UserTypes> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      // required: [true, "Email is required"],
      unique: true,
      match: [
        /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
        "Please use a valid email address",
      ],
    },
    firstName: {
      type: String,
      // required: [true, "First name is required"],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      // required: [true, "Last name is required"],
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<UserTypes>("User", userSchema);
