'use client';

import { useEffect, useState } from 'react';
import { getWeeklyDigest } from '@/lib/api';
import MemoryCard from '@/components/MemoryCard';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeeklyDigestPage() {
  const [session, setSession] = useState(null);
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [pendingDate, setPendingDate] = useState('');

  useEffect(() => {
    const fetchSessionAndDigest = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = '/auth';
        return;
      }
      setSession(data.session);

      try {
        const result = await getWeeklyDigest(data.session.user.id);
        setDigest(result);
      } catch (error) {
        console.error('Failed to load weekly digest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndDigest();
  }, []);

  const fetchDigestForDate = async (date) => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const result = await getWeeklyDigest(session.user.id, date);
      setDigest(result);
    } catch (error) {
      console.error('Failed to fetch digest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (pendingDate) {
      fetchDigestForDate(pendingDate);
      setSelectedDate(pendingDate);
    }
  };

  const handleClear = () => {
    setPendingDate('');
    setSelectedDate('');
    fetchDigestForDate(null);
  };

  const handleDeleteMemory = (memoryId) => {
    setDigest((prev) => ({
      ...prev,
      top_memories: prev.top_memories.filter((m) => m.id !== memoryId),
      new_memory_count: prev.new_memory_count - 1,
    }));
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading your Weekly Digest...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center">Weekly Digest 📚</h1>

      {/* Date Picker Section */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <input
          type="date"
          value={pendingDate}
          onChange={(e) => setPendingDate(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
        />
        <button
          onClick={handleApply}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-zinc-700 dark:text-white px-4 py-2 rounded-md text-sm"
        >
          Clear
        </button>
      </div>

      {/* Digest Content */}
      {(!digest || digest.new_memory_count === 0) ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-lg text-center">
            You saved <span className="font-semibold">{digest.new_memory_count}</span> new memories this week! 🎉
          </p>

          <div className="flex flex-col items-center space-y-6">
            <AnimatePresence>
              {digest.top_memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-xl"
                >
                  <MemoryCard
                    entry={{
                      id: memory.id,
                      user_id: session.user.id,
                      text: memory.text,
                      timestamp: memory.timestamp,
                      project: memory.project || '',
                      filename: memory.filename || '',
                      tags: memory.tags || [], // 🆕 Pass tags properly
                    }}
                    onDelete={() => handleDeleteMemory(memory.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {digest.top_memories.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-6">
              You deleted all memories from this week. 🚀
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center dark:bg-zinc-800">
        <span className="text-gray-400">No Memories</span>
      </div>
      <p className="text-gray-400">No memories saved this week yet!</p>
      <p className="text-gray-400">Let&apos;s create some new coding memories! 🚀</p>
    </div>
  );
}
