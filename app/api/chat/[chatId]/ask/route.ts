'use server';

import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiResponse } from '@/lib/gemini/gemini';
import { auth } from '@/auth';
import { createNewMessage } from '@/lib/actions/message';

export async function POST( req: NextRequest, context: { params: { chatId: string } }) {
  // Get message and chatHistory from request body (default chatHistory to an empty array if not provided)
  const { message, chatHistory = [] } = await req.json();

  // Return an error if no message is provided
  if (!message) {
    return NextResponse.json({ error: 'No message provided' }, { status: 400 });
  }

  try {
    // Fetch user session from NextAuth
    const session = await auth();

    // Ensure valid session and user ID are available
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await context.params;
    
    // Ensure the chat history is trimmed to the last 5 messages for efficient processing
    const recentChatHistory = chatHistory.slice(-5);
    // Store the user's message in the database
    await createNewMessage(chatId, message, 'user');

    // Generate the response from Gemini based on the user's message and recent chat history
    const aiText = await generateGeminiResponse(message, recentChatHistory);

    // Store the bot's response in the database
    await createNewMessage(chatId, aiText.trim(), 'bot');

    // Return the bot's response in the JSON format
    return NextResponse.json({
      sender: 'bot',
      message: aiText.trim(), // Trim any extra whitespace or newlines
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
