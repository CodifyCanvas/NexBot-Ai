// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkAdmin, fetchAllUsers} from '@/lib/actions/admin';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const isAdmin = await checkAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const users = await fetchAllUsers();
    if (!users) {
        return NextResponse.json({ error: "Failed to fetch Users" }, { status: 500 });
    }

    return NextResponse.json(users,
      { status: 200 }
    );
    
  } catch (error) {
    console.error("GET /api/user/all error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Users. Please try again later." },
      { status: 500 }
    );
  }
}