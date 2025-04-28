'use client';

import { motion } from 'framer-motion';

export default function JournalEntryCard({ entry, loading }) {
  if (loading) {
    return (
      <div className="py-6 border-b border-gray-200 dark:border-zinc-800 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-zinc-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="py-6 border-b border-gray-200 dark:border-zinc-800 space-y-4">
        <div className="text-lg font-bold flex items-center gap-2">
          📚 {entry.memory_count} memories summarized
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {entry.summary}
        </p>

        {entry.examples.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <div className="font-semibold">Highlights:</div>
            <ul className="list-disc ml-6 space-y-1">
              {entry.examples.map((example, idx) => (
                <li key={idx}>{example}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
