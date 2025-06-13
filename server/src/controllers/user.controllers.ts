import { Response } from "express";
import { User, UserTypes } from "../models/user.model";
import { UserRequest } from "../types/userTypes";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const registerUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { username, firstName, lastName, email, password } = req.body;

    if (!firstName) throw new ApiError(400, "Firstname is required");
    if (!lastName) throw new ApiError(400, "Lastname is required");
    if (!password) throw new ApiError(400, "Password is required");
    if (!email) throw new ApiError(400, "Email is required");

    const emailExists = await User.findOne({ email });
    if (emailExists) throw new ApiError(409, "Email has already been used");

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
      communitiesJoined: ["all"],
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser)
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered sucessfully"));
  }
);
