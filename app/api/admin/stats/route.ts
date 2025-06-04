// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkAdmin, getAdminStats, getDailyStats } from '@/lib/actions/admin';

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

    const stats = await getAdminStats();
    if (!stats) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }

    return NextResponse.json(stats,
      { status: 200 }
    );
    
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats. Please try again later." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const isAdmin = await checkAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const duration = Number(body.value);

    if (isNaN(duration) || duration < 0) {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }

    const stats = await getDailyStats(duration);
    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error('POST /api/admin/stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily stats data. Please try again later.' },
      { status: 500 }
    );
  }
}

