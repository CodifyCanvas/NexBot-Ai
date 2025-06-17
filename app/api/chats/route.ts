import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Authentication helper
import { deleteAllChats, fetchChats } from "@/lib/actions/chat";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const chats = await fetchChats(userId);

    return NextResponse.json(
      chats?.length ? chats : { message: "No chats found" },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/chats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats. Please try again later." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    await deleteAllChats(userId);

    return NextResponse.json(
      { message: "All chats deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/chats error:", error);
    return NextResponse.json(
      { error: "Failed to delete chats. Please try again later." },
      { status: 500 }
    );
  }
}
