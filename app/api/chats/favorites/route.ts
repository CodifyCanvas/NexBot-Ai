import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { fetchFavoriteChats } from '@/lib/actions/chat';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
  
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favoriteChats = await fetchFavoriteChats(Number(userId));

    return NextResponse.json(favoriteChats, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorite chats:', error);
    return NextResponse.json([], { status: 500 });
  }
}
