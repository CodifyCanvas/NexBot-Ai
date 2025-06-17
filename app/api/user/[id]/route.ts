import { auth } from "@/auth";
import { checkAdmin, DeleteUser, getUserGeneralStats } from "@/lib/actions/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  try {
    // Get session from the authentication provider
    const session = await auth();
    const userId = session?.user?.id; // Retrieve userId from session

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkAdmin(Number(userId));
    
        if (!isAdmin) {
          return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

    const { id } = await params;


    // Call fetch user stats
    const generalStats = await getUserGeneralStats(Number(id));

    // Return success message after toggling favorite
    return NextResponse.json(generalStats, { status: 200 });
  } catch (err) {
    console.error('/api/admin/user/[id] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params } : { params: Promise<{ id: string }> }
) {
  try {
    // Step 1: Authenticate the request
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized Access", message: "You must be signed in to perform this action." },
        { status: 401 }
      );
    }

    // Step 2: Check if the user is an admin
    const isAdmin = await checkAdmin(Number(userId));
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Access Denied", message: "Only administrators can delete users." },
        { status: 403 }
      );
    }

    // Step 3: Validate and parse the user ID from URL
    const { id } = await params;
    const targetUserId = Number(id);

    if (isNaN(targetUserId)) {
      return NextResponse.json(
        { error: "Invalid Request", message: "Provided user ID is not a valid number." },
        { status: 400 }
      );
    }

    // Step 4: Attempt to delete the user
    const result = await DeleteUser(targetUserId);

    return NextResponse.json(
      {
        message: result.message || "User deleted successfully.",
      },
      { status: 200 }
    );
  } catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : "Unknown server error";
  console.error("[DELETE /api/admin/user/[id]]:", errorMessage);

  return NextResponse.json(
    {
      error: "Internal Server Error",
      message: errorMessage,
    },
    { status: 500 }
  );
}
}
