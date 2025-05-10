import { NextResponse } from "next/server";
import { Resend } from "resend";
import { QuickInquiryEmail } from "@/components/email-templates/quick-inquiry.email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email to owner
    const data = await resend.emails.send({
      from: "Quick Inquiry <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL! || "towizaza352@gmail.com",
      subject: `New Quick Inquiry: ${subject}`,
      react: await QuickInquiryEmail({
        name,
        email,
        subject,
        message,
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
