import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Input validation
  if (!email || !email.trim()) {
    console.error("Verification email failed: Email is required");
    return { success: false, message: "Email address is required" };
  }

  if (!username || !username.trim()) {
    console.error("Verification email failed: Username is required");
    return { success: false, message: "Username is required" };
  }

  if (!verifyCode || !verifyCode.trim()) {
    console.error("Verification email failed: Verification code is required");
    return { success: false, message: "Verification code is required" };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Verification email failed: Invalid email format", { email });
    return { success: false, message: "Invalid email address format" };
  }

  try {
    // Check if resend client is properly initialized
    if (!resend || !resend.emails) {
      console.error("Resend client is not properly initialized");
      return { 
        success: false, 
        message: "Email service is not available. Please try again later." 
      };
    }

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Victor AI App | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    // Check if the email was sent successfully
    if (!result || result.error) {
      console.error("Resend API returned an error", result?.error);
      return { 
        success: false, 
        message: "Failed to send verification email. Please try again." 
      };
    }

    console.log("Verification email sent successfully", { 
      email, 
      username,
      messageId: result.data?.id 
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    // Enhanced error logging with more context
    console.error("Error sending verification email", {
      error: emailError instanceof Error ? emailError.message : emailError,
      stack: emailError instanceof Error ? emailError.stack : undefined,
      email,
      username,
    });

    // Provide user-friendly error messages based on error type
    if (emailError instanceof Error) {
      if (emailError.message.includes("rate limit")) {
        return { 
          success: false, 
          message: "Too many requests. Please try again in a few minutes." 
        };
      }
      
      if (emailError.message.includes("network") || emailError.message.includes("timeout")) {
        return { 
          success: false, 
          message: "Network error. Please check your connection and try again." 
        };
      }
    }

    return { 
      success: false, 
      message: "Failed to send verification email. Please try again later." 
    };
  }
}