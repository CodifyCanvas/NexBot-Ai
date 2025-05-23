import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import Spinner from './Spinner';

const ChatFallback = () => {
    return (
        <div className={`flex gap-2 justify-start mt-4`} >
            {/* Avatar with Spinner */}
            <Avatar className="mt-1 shrink-0">
                <AvatarImage src="" alt="avatar" />
                <AvatarFallback>
                    <Spinner variant="gradient" />
                </AvatarFallback>
            </Avatar>

            {/* Chat bubble fallback */}
            <Card className="py-2 px-4 w-2/3 max-w-[80%] bg-[#202124] rounded-bl-4xl rounded-r-4xl rounded-tl-none">
                <div className="text-shadow-xs text-shadow-black/60 text-sm sm:text-base px-1 py-2 space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-4 w-full" />
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default ChatFallback