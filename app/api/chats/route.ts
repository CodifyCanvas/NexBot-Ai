// app/api/chats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // from your auth.ts
import { fetchChats } from "@/lib/actions/chat";

export async function GET(req: NextRequest) {
  try {
    // Get user session from NextAuth
    const session = await auth();

    // Check for valid session and user ID
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all chats for the user
    const result = await fetchChats(userId);

    // Optional: return empty array if no chats instead of error
    if (!result || result.length === 0) {
      return NextResponse.json({ message: "No chats found" }, { status: 200 });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error("Error fetching chats:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
