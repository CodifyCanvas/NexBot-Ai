// app/chat/[chatId]/page.tsx

import ChatClient from '@/components/custom/ChatClient';
import Spinner from '@/components/custom/Spinner';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

interface ChatMetaData {
  id: number;
  userId: number;
  chatId: string;
  title: string;
  isShareable: boolean;
  color: number;
  createdAt: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chatId?: string }>;
}): Promise<Metadata> {
  const { chatId } = await params;

  if (!chatId) {
    return {
      title: 'Loading...',
      description: 'Loading conversation...',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const cookieHeader = (await cookies()).getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  try {
    const res = await fetch(`${baseUrl}/api/chat/${chatId}`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.status}`);

    const data: ChatMetaData = await res.json();
    const title = data?.title?.trim() || 'Chat';

    return {
      title,
      description: `Chat conversation titled "${title}"`,
    };
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return {
      title: 'Chat',
      description: 'Conversation page',
    };
  }
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId?: string }>;
}) {
  const { chatId } = await params;

  if (!chatId) {
    return (
      <div className="w-full h-full flex justify-center items-center overflow-hidden">
        <div className="scale-200">
          <Spinner variant="blue-gradient" />
        </div>
      </div>
    );
  }

  return <ChatClient />;
}