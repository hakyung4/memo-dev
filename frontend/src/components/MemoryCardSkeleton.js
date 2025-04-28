'use client';

export default function MemoryCardSkeleton() {
  return (
    <div className="p-4 border rounded-xl shadow bg-gray-100 dark:bg-zinc-800 animate-pulse space-y-4">
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3"></div>
      <div className="h-24 bg-gray-300 dark:bg-zinc-700 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/2"></div>
    </div>
  );
}
