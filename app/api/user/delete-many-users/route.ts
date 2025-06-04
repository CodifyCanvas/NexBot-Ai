// /app/api/user/delete-many/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdmin, DeleteUser} from "@/lib/actions/admin";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id; 

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await checkAdmin(Number(userId));
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { ids } = body as { ids: number[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No user IDs provided" }, { status: 400 });
    }

    // Delete each user using your full DeleteUser cascade function
    for (const id of ids) {
      await DeleteUser(id); // your function handles error if user doesn't exist
    }

    return NextResponse.json({ message: "Users deleted successfully." }, { status: 200 });

  } catch (err) {
    console.error("Bulk Delete /api/user/delete-many-user Error:", err);
    return NextResponse.json({ error: "Internal server error while this /api/user/delete-many-user endpoint trigger" }, { status: 500 });
  }
}
