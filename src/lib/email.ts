import { Resend } from "resend";

/**
 * Email utility functions using Resend
 */

/**
 * Get Resend client instance (lazy initialization)
 */
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

/**
 * Send contact form notification email to contractor
 */
export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}): Promise<void> {
  if (!process.env.EMAIL_TO || !process.env.EMAIL_FROM) {
    throw new Error("Email configuration missing: EMAIL_TO and EMAIL_FROM must be set");
  }

  const projectTypeLabels: Record<string, string> = {
    kitchen: "Kitchen Remodeling",
    bathroom: "Bathroom Remodeling",
    both: "Both Kitchen & Bathroom",
    other: "Other",
  };

  const subject = `New Contact Form Submission - ${projectTypeLabels[data.projectType] || data.projectType}`;

  const htmlContent = `
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
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #495057; }
          .value { margin-top: 5px; color: #212529; }
          .message-box { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; color: #212529;">New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${escapeHtml(data.name)}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
            </div>
            <div class="field">
              <div class="label">Project Type:</div>
              <div class="value">${escapeHtml(projectTypeLabels[data.projectType] || data.projectType)}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${escapeHtml(data.message).replace(/\n/g, "<br>")}</div>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">This email was sent from your website contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Project Type: ${projectTypeLabels[data.projectType] || data.projectType}

Message:
${data.message}
  `.trim();

  const resend = getResendClient();
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    replyTo: data.email,
    subject,
    html: htmlContent,
    text: textContent,
  });
}

/**
 * Send auto-reply email to customer
 */
export async function sendAutoReplyEmail(data: {
  name: string;
  email: string;
}): Promise<void> {
  if (!process.env.EMAIL_FROM) {
    throw new Error("Email configuration missing: EMAIL_FROM must be set");
  }

  const htmlContent = `
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
            <h2 style="margin: 0; color: #212529;">Thank You for Contacting Us</h2>
          </div>
          <div class="content">
            <p>Hi ${escapeHtml(data.name)},</p>
            <p>Thank you for reaching out to us! We've received your inquiry and will get back to you within 24 hours.</p>
            <p>Our team is reviewing your message and will contact you soon to discuss your project in detail.</p>
            <p>If you have any urgent questions, please feel free to call us directly.</p>
            <p>Best regards,<br>The Team</p>
          </div>
          <div class="footer">
            <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Thank You for Contacting Us

Hi ${data.name},

Thank you for reaching out to us! We've received your inquiry and will get back to you within 24 hours.

Our team is reviewing your message and will contact you soon to discuss your project in detail.

If you have any urgent questions, please feel free to call us directly.

Best regards,
The Team
  `.trim();

  const resend = getResendClient();
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: "Thank You for Your Inquiry",
    html: htmlContent,
    text: textContent,
  });
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

