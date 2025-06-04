import { auth } from "@/auth";
import { checkAdmin, getUserConversationStats } from "@/lib/actions/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
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

    const { id } = await context.params;

    const body = await req.json();
    const duration = Number(body.value);

    if (isNaN(duration) || duration < 0) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }

    // fetch user Conversation details for chart
    const conversationStats = await getUserConversationStats(Number(id), duration);

    // Return success message after toggling favorite
    return NextResponse.json(conversationStats, { status: 200 });
  } catch (err) {
    console.error('/api/admin/stats/[id] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}