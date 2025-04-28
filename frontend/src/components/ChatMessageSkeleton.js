'use client';

export default function ChatMessageSkeleton() {
  return (
    <div className="flex flex-col space-y-2 animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-24"></div>
      <div className="h-3 bg-gray-300 dark:bg-zinc-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 dark:bg-zinc-700 rounded w-2/3"></div>
    </div>
  );
}
