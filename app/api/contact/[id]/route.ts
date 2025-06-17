import { auth } from "@/auth";
import { checkAdmin } from "@/lib/actions/admin";
import { DeleteContactMessage, fetchContactMessageById } from "@/lib/actions/contact";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    // 1. Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access. Please sign in." },
        { status: 401 }
      );
    }

    // 2. Authorize admin access
    const isAdmin = await checkAdmin(Number(userId));

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    // 3. Extract and validate message ID from route
    const { id } = await params;
    const messageId = Number(id);
    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: "Invalid message ID." },
        { status: 400 }
      );
    }

    // 4. Fetch the message
    const message = await fetchContactMessageById(messageId);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found." },
        { status: 404 }
      );
    }

    // 5. Return the message
    return NextResponse.json(message, { status: 200 });

  } catch (error) {
    console.error("GET /api/contact/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    // 1. Authenticate request
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized Access",
          message: "You must be signed in to perform this action.",
        },
        { status: 401 }
      );
    }

    // 2. Authorize admin access
    const isAdmin = await checkAdmin(Number(userId));
    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Access Denied",
          message: "Only administrators can delete messages.",
        },
        { status: 403 }
      );
    }

    // 3. Parse and validate request payload
    const { id } = await params;
    const messageId = Number(id);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: "Invalid message ID." },
        { status: 400 }
      );
    }

    // 4. Delete the contact message
    const result = await DeleteContactMessage(messageId);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to delete message." },
        { status: 403 }
      );
    }

    // 5. Respond with success
    return NextResponse.json(
      { message: "Message deleted successfully." },
      { status: 200 }
    );

  } catch (err: unknown) {
  // Narrow error type safely
  const errorMessage = err instanceof Error ? err.message : "Unexpected server error.";

  console.error("[DELETE /api/contact]:", errorMessage);

  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: errorMessage,
    },
    { status: 500 }
  );
}
}
