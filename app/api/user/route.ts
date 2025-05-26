import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { fetchUser } from '@/lib/actions/user';

export async function GET(req: NextRequest) {
  try {
    // 1. Get the user session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch favorite chats for the user
    const user = await fetchUser(Number(userId));

    if (user.length === 0) {
      return NextResponse.json({ message: 'No User found' }, { status: 404 });
    }

    // Now returning the chats directly
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error('Error fetching User:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
