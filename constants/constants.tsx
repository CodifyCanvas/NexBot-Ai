import { BookOpenCheck, MessageSquareText, NotebookPen, Search, SquarePen } from 'lucide-react';

export const features = [
    { title: 'Have Intelligent, Real-Time Text Conversations', icon: MessageSquareText },
    { title: 'Summarize Articles, Docs, and More Instantly', icon: BookOpenCheck },
    { title: 'Enhance Your Writing with AI-Powered Edits', icon: NotebookPen },
];

export const Names = {
    app_name: 'NexBot',
}
export const Images = {
    main_logo_transparent: '/assets/images/main_logo_transparent.png',
    main_logo: '/assets/images/main_logo.png',
    ai_svg_login: '/assets/images/Chat_bot_svg_login_screen.png'
}

export const navMain = [
    { title: "Search", url: "/chat/search", icon: Search },
    { title: "New Chat", url: "/chat", icon: SquarePen },
  ];
