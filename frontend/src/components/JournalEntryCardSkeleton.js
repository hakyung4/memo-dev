'use client';

export default function JournalEntryCardSkeleton() {
  return (
    <div className="py-6 border-b border-gray-200 dark:border-zinc-800 space-y-4 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-5/6"></div>
    </div>
  );
}
