import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { verifyCode } from "@/schemas/verifySchema";
import { z } from "zod";

const CodeQuerySchema = z.object({
  code: verifyCode,
});
export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const CodeValidationResult = CodeQuerySchema.safeParse({code});
    if (!CodeValidationResult.success) {
      const CodeError = CodeValidationResult.error.format().code?._errors;
      return Response.json(
        { success: false, message: "Error in code validations" },
        { status: 400 }
      );
    }
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "User Verified Successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code expired. Please signup again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
