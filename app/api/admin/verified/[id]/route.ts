import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkAdmin, verifiedUser } from "@/lib/actions/admin";

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  // Get session from auth provider
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await checkAdmin(Number(userId));
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const value = body.value;

  // Call the verifiedUser function to update verification status
  const response = await verifiedUser(Number(id), value);

  if (response.success) {
    return NextResponse.json({ message: response.message }, { status: 200 });
  }

  return NextResponse.json({ error: response.message }, { status: 400 });
}
