import { Skeleton } from '@/components/ui/skeleton';

export function ShowMessageInfoSkeleton() {
  return (
    <div className="md:px-5 space-y-4 border-t pt-1">
      {/* Header: Avatar + Info */}
      <div className="flex justify-between gap-2 items-center">
        <div className="flex items-center gap-3 md:px-2 py-2 rounded-md">
          <Skeleton className="w-10 h-10 sm:w-14 sm:h-14 rounded-full" />

          <div className="space-y-1">
            <Skeleton className="h-4 w-32 sm:w-40 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-3 w-40 sm:w-72 bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <Skeleton className="h-3 w-24 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-3 w-28 bg-gray-200 dark:bg-gray-600" />
        </div>
      </div>

      {/* Message Box */}
      <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg max-h-[50vh] overflow-hidden space-y-2">
        <Skeleton className="h-3 w-20 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-600" />
        <Skeleton className="h-4 w-[90%] bg-gray-200 dark:bg-gray-600" />
        <Skeleton className="h-4 w-[80%] bg-gray-200 dark:bg-gray-600" />
        <Skeleton className="h-4 w-[95%] bg-gray-200 dark:bg-gray-600" />
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-600" />
      </div>

      {/* Footer: Button + Responded Info */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24 rounded-md bg-gray-300 dark:bg-gray-700" />

        <div className="flex flex-col items-end space-y-1">
          <Skeleton className="h-3 w-20 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-600" />
        </div>
      </div>
    </div>
  );
}
