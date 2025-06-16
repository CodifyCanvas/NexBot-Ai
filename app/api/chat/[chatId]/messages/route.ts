// app/api/chat/[chatId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchChat } from "@/lib/actions/chat";
import { fetchMessages } from "@/lib/actions/message";

export async function GET(req: NextRequest, context: { params: { chatId: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    // Await params to resolve the Promise
    const { chatId } = await context.params;

    // 1. Fetch chat details
    const chatResult = await fetchChat(chatId);
    const chat = Array.isArray(chatResult) ? chatResult[0] : null;

    if (!chat) {
      return NextResponse.json({ error: "Unable to load conversation" }, { status: 404 });
    }

    const isOwner = Number(chat.userId) === userId;

    // 2. If owner, allow message fetching
    if (isOwner) {
      const messages = await fetchMessages(chatId);
      const enrichedMessages = (messages || []).map((msg) => ({
    ...msg,
      profileImg: true
  }));
      return NextResponse.json(enrichedMessages || [], { status: 200 });
    }

    // 3. If not owner, check if shareable
    if (chat.isShareable) {
  const messages = await fetchMessages(chatId);

  const enrichedMessages = (messages || []).map((msg) => ({
    ...msg,
    profileImg: false
  }));

  return NextResponse.json(enrichedMessages, { status: 200 });
}

    // 4. Otherwise, it's private
    return NextResponse.json({ error: "This conversation is private" }, { status: 403 });

  } catch (err) {
    console.error("Error fetching chat:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
