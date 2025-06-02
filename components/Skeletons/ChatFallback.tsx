import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import Spinner from '../custom/Spinner';

const ChatFallback = () => {
  return (
    <div className="flex items-start gap-3 px-4 mt-4">
      {/* Spinner in place of avatar */}
      <div className="mt-1">
        <Spinner variant="blue-gradient" />
      </div>

      {/* Skeleton chat bubble */}
      <Card className="w-3/4 bg-black/5 dark:bg-white/10 backdrop-blur-xl shadow-sm border border-black/10 dark:border-none animate-pulse transition-all duration-300">
        <CardHeader>
          <CardDescription>
            <Skeleton className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
          </CardDescription>
          <CardTitle className="flex flex-col gap-2 mt-2">
            <Skeleton className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
            <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 items-start">
          <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatFallback;
