// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createNewChat, getUserChatsSearch } from '@/lib/actions/chat';
import { auth } from '@/auth';
import { generateChatId } from '@/lib/uuid';
import { generateGeminiResponse } from '@/lib/gemini/gemini';

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.toLowerCase() || '';

  try {
    const chats = await getUserChatsSearch(userId, query);

    return new Response(JSON.stringify(chats), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function POST(req: NextRequest) {
  try {
    // Fetch user session from NextAuth
    const session = await auth();

    // Ensure valid session and user ID are available
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const newChatId = generateChatId();

    // Parse the incoming message from the request body
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Generate AI response for the chat title
    const aiTitle = await generateGeminiResponse(message);

    // Create the new chat in the database
    const result = await createNewChat(Number(userId), newChatId, aiTitle);

    if (!result) {
      return NextResponse.json({ error: 'Failed to create new chat' }, { status: 500 });
    }

    // Return the created chat UUID and a success message
    return NextResponse.json({
      message: 'New chat created!',
      chatId: newChatId,  // Ensuring chatId is returned
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
