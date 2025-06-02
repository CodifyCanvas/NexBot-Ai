import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateUserName } from '@/lib/actions/user';

export async function POST(req: NextRequest) {
  try {
    // 1. Get the user session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse JSON body to get the new name
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name provided' }, { status: 400 });
    }

    // 3. Update the user's name
    await updateUserName(Number(userId), name);

    // 4. Return success response
    return NextResponse.json({ message: 'Name updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error updating user name:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
