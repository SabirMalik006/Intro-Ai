'use client';
import { usePathname } from 'next/navigation';
import ChatBot from './ChatBot';

export default function ChatBotWrapper() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/register') return null;
  return <ChatBot />;
}
