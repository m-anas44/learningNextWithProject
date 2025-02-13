import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log("Sending email to:", email); // Log the email address
    console.log("Verify code:", verifyCode); // Log the verification code
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message || Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("Email response:", emailResponse); // Log the response from Resend
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Failed in sending verification email. Please try again!",
    };
  }
}
