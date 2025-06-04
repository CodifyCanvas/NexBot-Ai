import React from 'react';

export function DataTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Header */}
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {Array.from({ length: 6 }).map((_, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body with 7 rows */}
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div className="h-4 w-full max-w-[150px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserInfoSkeleton() {
  return (
    <div className="space-y-4 border-t pt-4 animate-pulse">
      {/* Profile Skeleton */}
      <div className="flex flex-row items-center gap-4 px-2 py-2">
        <div className="w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-48 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Role & Status Skeleton */}
      <div className="flex flex-wrap justify-between gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={`role-status-${i}`}
            className="flex flex-col min-w-fit border px-4 py-3 rounded-md bg-neutral-200 dark:bg-white/5 backdrop-blur-md basis-[calc(33.333%-1rem)]  space-y-2"
          >
            <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Activity Stats Skeleton */}
      <div className="flex flex-wrap justify-between gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={`activity-${i}`}
            className="flex flex-col border px-4 py-3 rounded-md bg-neutral-200 dark:bg-white/5 backdrop-blur-md basis-[calc(33.333%-1rem)] min-w-fit space-y-2"
          >
            <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Response Rate Skeleton */}
      <div className="flex flex-col border px-4 py-3 rounded-md bg-neutral-200 dark:bg-white/5 backdrop-blur-md basis-[calc(33.333%-1rem)] min-w-fit space-y-2">
        <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
