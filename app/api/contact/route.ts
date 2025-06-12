import { saveContactMessage } from "@/lib/actions/contact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    const success = await saveContactMessage(name, email, message);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send your message, please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Message sent successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
