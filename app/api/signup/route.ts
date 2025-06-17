import { saveContactMessage } from "@/lib/actions/contact";
import { userSignup } from "@/lib/actions/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    const result = await userSignup(name, email, password);

    // Inbox message to notify admin
    const message = `🔔 New User Signup

Name: ${name}
Email: ${email}

Please review and verify their account.`;
 
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to create account." },
        { status: 403 }
      );
    }

    await saveContactMessage(name, email, message);
    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
