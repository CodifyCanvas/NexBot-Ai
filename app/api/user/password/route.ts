import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { changeUserPassword } from '@/lib/actions/user';

export async function PUT(req: NextRequest) {
  try {
    // 1. Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Extract and validate new password
    const { newPassword } = await req.json(); 

    if (typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 3. Update user's password
    await changeUserPassword(Number(userId), newPassword);

    // 4. Respond with success
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
