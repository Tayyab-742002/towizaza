import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BookingInquiryEmail } from "@/components/email-templates/booking-inquiry.email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, eventType, eventDate, message } = body;

    // Validate required fields
    if (!name || !email || !eventType || !eventDate || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email to owner
    const data = await resend.emails.send({
      from: "Booking Inquiry <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL! || "towizaza352@gmail.com",
      subject: `New Booking Inquiry from ${name}`,
      react: await BookingInquiryEmail({
        name,
        email,
        eventType,
        eventDate,
        eventDetails: message,
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
