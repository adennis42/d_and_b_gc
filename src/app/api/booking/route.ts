import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/booking
 * Handles booking form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, projectType, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !projectType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email configuration is available
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
      console.error("Email configuration missing for booking");
      return NextResponse.json(
        { error: "Service unavailable", message: "Email service is not configured" },
        { status: 503 }
      );
    }

    // Format the date for display
    const appointmentDate = new Date(date);
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const projectTypeLabels: Record<string, string> = {
      kitchen: "Kitchen Remodeling",
      bathroom: "Bathroom Remodeling",
      millwork: "Millwork",
      sunroom: "Sunroom",
      other: "Other",
    };

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email to contractor
    const contractorEmailSubject = `New Appointment Request - ${formattedDate} at ${time}`;
    const contractorEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #495057; }
            .value { margin-top: 5px; color: #212529; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; color: #212529;">New Appointment Request</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              <div class="field">
                <div class="label">Date:</div>
                <div class="value">${formattedDate}</div>
              </div>
              <div class="field">
                <div class="label">Time:</div>
                <div class="value">${time}</div>
              </div>
              <div class="field">
                <div class="label">Project Type:</div>
                <div class="value">${projectTypeLabels[projectType] || projectType}</div>
              </div>
              ${message ? `
              <div class="field">
                <div class="label">Additional Details:</div>
                <div class="value">${message.replace(/\n/g, "<br>")}</div>
              </div>
              ` : ""}
            </div>
          </div>
        </body>
      </html>
    `;

    const contractorEmailText = `
New appointment request received:

Name: ${name}
Email: ${email}
Phone: ${phone}
Date: ${formattedDate}
Time: ${time}
Project Type: ${projectTypeLabels[projectType] || projectType}
${message ? `Additional Details: ${message}` : ""}

Please confirm this appointment with the client.
    `.trim();

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: contractorEmailSubject,
      html: contractorEmailHtml,
      text: contractorEmailText,
    });

    // Send confirmation email to client
    const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Raise D & B";
    const clientEmailSubject = `Appointment Request Received - ${formattedDate} at ${time}`;
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; }
            .footer { background-color: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; color: #212529;">Appointment Request Received</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for requesting an appointment with ${businessName}.</p>
              <p>We have received your request for:</p>
              <ul>
                <li><strong>Date:</strong> ${formattedDate}</li>
                <li><strong>Time:</strong> ${time}</li>
                <li><strong>Project Type:</strong> ${projectTypeLabels[projectType] || projectType}</li>
              </ul>
              <p>We will review your request and confirm your appointment via email or phone within 24 hours.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>${businessName}</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const clientEmailText = `
Appointment Request Received

Dear ${name},

Thank you for requesting an appointment with ${businessName}.

We have received your request for:
Date: ${formattedDate}
Time: ${time}
Project Type: ${projectTypeLabels[projectType] || projectType}

We will review your request and confirm your appointment via email or phone within 24 hours.

If you have any questions, please don't hesitate to contact us.

Best regards,
${businessName}
    `.trim();

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: clientEmailSubject,
      html: clientEmailHtml,
      text: clientEmailText,
    });

    return NextResponse.json(
      { message: "Appointment request submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit booking request" },
      { status: 500 }
    );
  }
}

