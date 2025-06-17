// /app/api/user/delete-many-messages/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdmin } from "@/lib/actions/admin";
import { DeleteContactMessage } from "@/lib/actions/contact";

export async function DELETE(req: NextRequest) {
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

    // 3. Parse and validate input
    const { ids } = (await req.json()) as { ids: (number | string)[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No message IDs provided." }, { status: 400 });
    }

    // 4. Normalize and validate numeric IDs
    const numericIds = ids.map(Number).filter((id) => !isNaN(id));

    if (numericIds.length === 0) {
      return NextResponse.json({ error: "No valid numeric IDs provided." }, { status: 400 });
    }

    // 5. Delete each message
    for (const id of numericIds) {
      await DeleteContactMessage(id);
    } 

    return NextResponse.json(
      { message: `${numericIds.length} message${numericIds.length > 1 ? 's' : ''} deleted successfully.` },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE /api/contact/delete-many-messages error:", error);
    return NextResponse.json(
      { error: "Internal server error while deleting messages." },
      { status: 500 }
    );
  }
}
