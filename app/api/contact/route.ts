import { auth } from "@/auth";
import { checkAdmin } from "@/lib/actions/admin";
import { fetchContactMessages, saveContactMessage } from "@/lib/actions/contact";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const isAdmin = await checkAdmin(userId);

    if (!isAdmin) { 
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const messages = await fetchContactMessages();

    return NextResponse.json(messages?.length ? messages : { message: "No New Messages found" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not verify admin access" },
      { status: 500 }
    );
  }
}

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


