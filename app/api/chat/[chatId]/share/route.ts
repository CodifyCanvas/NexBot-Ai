// app/api/chat/[chatId]/share/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { toggleShare } from '@/lib/actions/chat';

// PATCH: Toggle shareable status of a chat
export async function PATCH( req: NextRequest, context: { params: { chatId: string } }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isShareable } = await req.json();
    const { chatId } = await context.params;

    const result = await toggleShare(Number(userId), chatId, isShareable);

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { message: 'No update — check chat ID or permissions.' },
        { status: 202 }
      );
    }

    const message = isShareable
      ? 'This chat is now public and shareable!'
      : 'This chat is now private';

    return NextResponse.json(
      { message, value: isShareable },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error toggling chat share status:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
