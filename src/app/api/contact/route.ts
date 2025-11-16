import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import {
  sendContactNotificationEmail,
  sendAutoReplyEmail,
} from "@/lib/email";

/**
 * Contact form validation schema (server-side)
 */
const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    ),
  projectType: z.enum(["kitchen", "bathroom", "both", "other"]),
  message: z.string().min(10).max(1000),
});

/**
 * POST /api/contact
 * Handles contact form submissions with email sending and rate limiting
 * 
 * Features:
 * - Validates form data with Zod schema
 * - Rate limiting (5 requests per 15 minutes per IP)
 * - Sends notification email to contractor
 * - Sends auto-reply email to customer
 * - Proper error handling and logging
 * - Returns appropriate HTTP status codes
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);

  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil(
        (rateLimit.resetTime - Date.now()) / 1000
      );
      
      console.warn(`Rate limit exceeded for IP: ${clientIP}`, {
        resetTime: rateLimit.resetTime,
        retryAfter,
      });

      return NextResponse.json(
        {
          error: "Too many requests",
          message:
            "Please wait before submitting another request. You can try again in a few minutes.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Invalid JSON in request body", { error, clientIP });
      return NextResponse.json(
        { error: "Invalid request format", message: "Request body must be valid JSON" },
        { status: 400 }
      );
    }

    // Validate form data
    let validatedData;
    try {
      validatedData = contactFormSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn("Validation error", {
          errors: error.issues,
          clientIP,
          email: body.email,
        });

        return NextResponse.json(
          {
            error: "Validation failed",
            message: "Please check your form data and try again",
            details: error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          },
          {
            status: 400,
            headers: {
              "X-RateLimit-Limit": "5",
              "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            },
          }
        );
      }
      throw error;
    }

    // Check if email configuration is available
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
      console.error("Email configuration missing", {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasEmailFrom: !!process.env.EMAIL_FROM,
        hasEmailTo: !!process.env.EMAIL_TO,
      });

      // In development, log the submission instead of failing
      if (process.env.NODE_ENV === "development") {
        console.log("Contact form submission (development mode):", validatedData);
        return NextResponse.json(
          {
            message: "Contact form submitted successfully (development mode - email not sent)",
            data: validatedData,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          error: "Service unavailable",
          message: "Email service is not configured. Please contact us directly.",
        },
        { status: 503 }
      );
    }

    // Send emails
    try {
      // Send notification email to contractor
      await sendContactNotificationEmail(validatedData);
      console.info("Contact notification email sent", {
        to: process.env.EMAIL_TO,
        from: validatedData.email,
        projectType: validatedData.projectType,
        clientIP,
      });

      // Send auto-reply to customer
      await sendAutoReplyEmail({
        name: validatedData.name,
        email: validatedData.email,
      });
      console.info("Auto-reply email sent", {
        to: validatedData.email,
        clientIP,
      });
    } catch (emailError) {
      // Log email error but don't expose internal details to client
      console.error("Failed to send email", {
        error: emailError instanceof Error ? emailError.message : String(emailError),
        clientIP,
        email: validatedData.email,
      });

      return NextResponse.json(
        {
          error: "Failed to send email",
          message:
            "We received your message but encountered an issue sending the confirmation email. Please contact us directly if you don't receive a response.",
        },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;
    console.info("Contact form submitted successfully", {
      email: validatedData.email,
      projectType: validatedData.projectType,
      clientIP,
      duration: `${duration}ms`,
    });

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        success: true,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": rateLimit.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    // Catch any unexpected errors
    const duration = Date.now() - startTime;
    console.error("Unexpected error in contact form handler", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      clientIP,
      duration: `${duration}ms`,
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
