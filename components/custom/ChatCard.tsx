import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import useUser from '@/hooks/useUser';
import { cn, getColorByLetter } from '@/lib/utils';
import { Copy } from 'lucide-react';

interface ChatProp {
  message: string;
  sender: 'user' | 'bot';
}

interface ChatCardProps {
  messages: ChatProp[];
}

const ChatCard: React.FC<ChatCardProps> = ({ messages }) => {
  const { user } = useUser();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };


  return (
    <div className="w-full space-y-5 mt-10">
      {messages.map((chatItem, index) => {
        const isUser = chatItem.sender === 'user';

        return (
          <div
            key={index}
            className={`flex flex-col w-full px-3 ${isUser ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex gap-2 w-full justify-start ${isUser ? 'flex-row-reverse' : ''}`}>
              <Avatar className="mt-1 hidden sm:block">
                <AvatarImage
                  src={isUser ? user?.profileImg : '/assets/images/main_logo_transparent.png'}
                  alt="avatar"
                />
                <AvatarFallback className={user?.name ? getColorByLetter(user.name) : getColorByLetter(chatItem.sender)}>
                  {(user?.name || chatItem.sender).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Card
                className={`py-2 w-fit max-w-[90%] sm:max-w-[80%] break-words ${isUser
                    ? 'bg-gradient-to-tr px-4 py-2 from-blue-500/80 to-blue-600/90 dark:from-blue-500/75 dark:to-blue-800 saturate-100 brightness-110 backdrop-blur-xl rounded-br-4xl rounded-l-4xl rounded-tr-none'
                    : 'border-none shadow-none bg-transparent outline-none'
                  }`}
              >
                {isUser ? (
                  <p className={cn("text-shadow-xs text-shadow-black/60 text-sm sm:text-base", isUser ? 'text-white' : 'text-black dark:text-white')}>
                    {chatItem.message}
                  </p>
                ) : (
                  <ReactMarkdown
                    rehypePlugins={[rehypeSanitize]}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        return inline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm text-yellow-400" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-neutral-950/85 p-4 rounded-lg overflow-x-auto text-sm text-green-300 my-2 max-w-full break-words">
                            <code className={`whitespace-pre-wrap break-words inline-block max-w-full ${className}`} {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      },
                      h1: ({ children }) => (
                        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg sm:text-xl font-bold mb-3 text-orange-500 dark:text-indigo-400">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-md sm:text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">{children}</h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-base sm:text-base font-medium mb-2 text-pink-600 dark:text-pink-400">{children}</h4>
                      ),
                      h5: ({ children }) => (
                        <h5 className="text-sm sm:text-sm font-medium mb-1 text-teal-600 dark:text-teal-400">{children}</h5>
                      ),
                      h6: ({ children }) => (
                        <h6 className="text-xs font-normal mb-1 text-gray-600 dark:text-gray-400">{children}</h6>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-blue-500">{children}</strong>
                      ),
                      p({ node, children, ...props }) {
                        const containsBlockCode = node.children?.some(
                          (child: any) =>
                            child.tagName === 'pre' || (child.tagName === 'code' && !child.properties?.inline)
                        );
                        if (containsBlockCode) return <>{children}</>;
                        return (
                          <p className={cn("text-sm sm:text-base mb-2", isUser ? 'text-white' : 'text-black dark:text-white')} {...props}>
                            {children}
                          </p>
                        );
                      },
                    }}
                  >
                    {chatItem.message}
                  </ReactMarkdown>
                )}
              </Card>
            </div>

            {/* Copy button below card, aligned right */}
            <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mt-1`}>
              <button
                onClick={() => handleCopy(chatItem.message, index)}
                className={cn("p-1 text-gray-600 hover:text-gray-950  dark:text-white/70 dark:hover:text-white transition flex items-center gap-1", isUser ? 'sm:pr-12' : 'sm:pl-12')}
                aria-label="Copy message"

              >
                <Copy size={15} />
                {copiedIndex === index && <span className="text-green-800 dark:text-green-300 text-xs">Copied!</span>}
              </button>
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default ChatCard;
