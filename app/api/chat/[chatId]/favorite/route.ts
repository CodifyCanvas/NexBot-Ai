// app/api/chat/[chatId]/favorite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { favoriteChat } from '@/lib/actions/chat';

// Toggling Chat to Favorites
export async function POST(req: NextRequest, { params } : { params: Promise<{ chatId: string }> }) {
  try {
    // Get session from the authentication provider
    const session = await auth();
    const userId = session?.user?.id; // Retrieve userId from session
    const { value } = await req.json(); // Retrieve value from request body

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await params;

    // Call favoriteChat function to add/remove from favorites based on value
    const response = await favoriteChat(Number(userId), chatId, value);

    // Return success message after toggling favorite
    return NextResponse.json({ message: response.message }, { status: 200 });
  } catch (err) {
    console.error('Toggle favorite error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

