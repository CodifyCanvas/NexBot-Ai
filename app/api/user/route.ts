import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { banUserAccount, fetchUser } from '@/lib/actions/user';
import { saveContactMessage } from '@/lib/actions/contact';

export async function GET() {
  try {
    // 1. Get the user session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch favorite chats for the user
    const user = await fetchUser(Number(userId));

    if (!user) {
      return NextResponse.json({ message: 'No User found' }, { status: 404 });
    }

    // Now returning the chats directly
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error('Error fetching User:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const name = session?.user?.name ?? 'Unknown';
    const email = session?.user?.email ?? 'unknown@example.com';

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message = `🔔 Account Deletion Request

A user has requested to delete their account from NexBot.

🧑 Name: ${name}
📧 Email: ${email}

Please review their account details and proceed with the deletion if appropriate.

Thank you,`;

    await banUserAccount(Number(userId));
    await saveContactMessage(name, email, message);



    return NextResponse.json({ message: "Account deactivation request submitted successfully." }, { status: 200 });
  } catch (err) {
    console.error("Error deactivating account:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
