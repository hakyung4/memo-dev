'use client';

import { deleteMemory } from '@/lib/api';
import { useState } from 'react';

export default function MemoryCard({ entry, onDelete, loading }) {
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    // Loading Skeleton
    return (
      <div className="p-4 border rounded-xl shadow bg-gray-100 dark:bg-zinc-800 animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/3"></div>
        <div className="h-24 bg-gray-300 dark:bg-zinc-700 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-1/2"></div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      setDeleting(true);
      await deleteMemory(entry.id, entry.user_id);
      onDelete?.();
    } catch (err) {
      console.error('❌ Failed to delete memory:', err);
      alert('❌ Failed to delete memory');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white dark:bg-zinc-900 text-sm space-y-2 relative">
      <div className="text-gray-600 dark:text-gray-400 text-xs">
        📁 {entry.project || 'No Project'} / {entry.filename || 'No Filename'}
      </div>

      <pre
        className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48 dark:text-black"
        dangerouslySetInnerHTML={{ __html: entry.text }}
      />

      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {entry.tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs dark:bg-blue-800 dark:text-white">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-gray-400 text-xs">
        🕒 {new Date(entry.timestamp).toLocaleString()}
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-2 right-2 text-red-500 text-xs hover:underline cursor-pointer"
      >
        {deleting ? 'Removing...' : '🗑 Remove'}
      </button>
    </div>
  );
}
