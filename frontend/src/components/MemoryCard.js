'use client';

import { deleteMemory } from '@/lib/api';
import { useState } from 'react';

export default function MemoryCard({ entry, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      setDeleting(true);
      await deleteMemory(entry.id, entry.user_id);
      onDelete?.(); // ✅ Immediately remove from UI
    } catch (err) {
      console.error('❌ Failed to delete memory:', err);
      alert('❌ Failed to delete memory');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white text-sm space-y-2 relative">
      <div className="text-gray-600 text-xs">
        📁 {entry.project} / {entry.filename}
      </div>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48 dark:text-black">
        {entry.text}
      </pre>
      <div className="text-gray-400 text-xs">
        🕒 {new Date(entry.timestamp).toLocaleString()}
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-2 right-2 text-red-500 text-xs hover:underline cursor-pointer"
      >
        🗑 Remove
      </button>
    </div>
  );
}
