// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkAdmin } from '@/lib/actions/admin';

export async function GET(req: NextRequest) {
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

    return NextResponse.json({admin: isAdmin},
      { status: 200 }
    );
    
  } catch (error) {
    console.error("GET /api/admin error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not verify admin access" },
      { status: 500 }
    );
  }
}

