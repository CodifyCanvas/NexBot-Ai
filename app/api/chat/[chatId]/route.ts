// app/api/chats/[chatId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { DeleteChat, fetchChat } from "@/lib/actions/chat"; // Assuming your DeleteChat is defined here

export async function GET(
  req: NextRequest, context: { params: { chatId: string } }
) {
  try {
    // 1. Authenticate the user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await context.params;

    // 2. Attempt to fetch the chat
    const chat = await fetchChat(chatId);

    // 3. Check if chat is found and return it
    if (chat?.length > 0) {
      return NextResponse.json(chat[0], { status: 200 });
    } else {
      // 4. If chat not found
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

  } catch (err) {
    // 5. General server error
    console.error("Error fetching chat:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest, context: { params: { chatId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await context.params;
    const userId = Number(session.user.id);

    try {
      await DeleteChat(userId, chatId);

      return NextResponse.json(
        { message: "Chat deleted" },
        { status: 200 }
      );
    } catch (err: any) {
      if (err.message === "Chat not found or unauthorized access.") {
        return NextResponse.json(
          { message: "Chat not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Delete failed" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



