// /app/api/contact/[id]/responded/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdmin } from "@/lib/actions/admin";
import { updateRespondedStatus } from "@/lib/actions/contact";

export async function POST(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    // 1. Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    // 2. Ensure user is an admin
    const isAdmin = await checkAdmin(Number(userId));
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    // 3. Parse and validate message ID
    const { id } = await params
    const messageId = Number(id);
    if (isNaN(messageId)) {
      return NextResponse.json({ error: "Invalid message ID." }, { status: 400 });
    }

    // 4. Update responded status
    const result = await updateRespondedStatus(messageId);

    if (!result.updated) {
      return NextResponse.json({ error: "Message not found or already updated." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Message marked as responded.",
      respondedAt: result.timestamp
    }, { status: 200 });

  } catch (error) {
    console.error("POST /api/contact/[id]/responded error:", error);
    return NextResponse.json(
      { error: "Internal server error while updating message status." },
      { status: 500 }
    );
  }
}
