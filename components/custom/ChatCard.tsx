import React from 'react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm'; // Optional but recommended

interface ChatProp {
  message: string;
  sender: 'user' | 'bot';
}

interface ChatCardProps {
  chat: ChatProp[];
}

const ChatCard: React.FC<ChatCardProps> = ({ chat }) => {
  const [user, setUser] = React.useState({ profileImg: '' });

  React.useEffect(() => {
    const loadUser = async () => {
      const res = await fetch('/api/user');
      const data = await res.json();
      setUser(data.user);
    };
    loadUser();
  }, []);

  return (
    <div className="w-full space-y-5 mt-10">
      {chat.map((chatItem, index) => {
        const isUser = chatItem.sender === 'user';

        return (
          <div
            key={index}
            className={`flex gap-2 justify-start ${isUser && 'flex-row-reverse'}`}
          >
            <Avatar className="mt-1">
              <AvatarImage
                src={isUser ? user.profileImg : '/assets/images/main_logo.png'}
                alt="avatar"
              />
              <AvatarFallback>
                {chatItem.sender.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Card
              className={`w-fit py-2 px-4 max-w-[80%] overflow-hidden ${
                isUser
                  ? 'gradient saturate-100 brightness-110 rounded-br-4xl rounded-l-4xl rounded-tr-none'
                  : 'bg-[#201f20] rounded-bl-4xl rounded-r-4xl rounded-tl-none'
              }`}
            >
              {isUser ? (
                <p className="text-shadow-xs text-shadow-black/60 text-sm sm:text-base text-white">
                  {chatItem.message}
                </p>
              ) : (
                <ReactMarkdown
                  rehypePlugins={[rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      return inline ? (
                        <code
                          className="bg-muted px-1 py-0.5 rounded text-sm text-yellow-400"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-neutral-950/75 p-4 rounded-lg overflow-x-auto text-sm text-green-300 my-2">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    },
                    h2: ({ children }) => (
                      <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-orange-300">{children}</strong>
                    ),
                    p({ node, children, ...props }) {
                      const containsBlockCode = node.children?.some(
                        (child: any) =>
                          child.tagName === 'pre' ||
                          (child.tagName === 'code' && !child.properties?.inline)
                      );

                      if (containsBlockCode) {
                        return <>{children}</>;
                      }

                      return (
                        <p className="text-white text-sm sm:text-base mb-2" {...props}>
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
        );
      })}
    </div>
  );
};

export default ChatCard;
