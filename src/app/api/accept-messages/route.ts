import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You must be authenticated to perform this action.",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;
  const { acceptingMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptingMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status.",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User status updated successfully.",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return Response.json(
      { success: false, message: "Failed to update user status." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(AuthOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You must be authenticated to perform this action.",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;

  try {
    const userFound = await UserModel.findById(userId);
    if (!userFound) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: userFound.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to get user message acceptance status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get message acceptance status",
      },
      { status: 500 }
    );
  }
}
