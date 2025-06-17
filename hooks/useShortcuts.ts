// lib/hooks/useShortcuts.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!e.altKey) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case 's':
          e.preventDefault();
          router.push('/chat/search');
          break;
        case 'c':
          e.preventDefault();
          router.push('/chat');
          break;
        case 'p':
          e.preventDefault();
          router.push('/chat/profile');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [router]);
}
