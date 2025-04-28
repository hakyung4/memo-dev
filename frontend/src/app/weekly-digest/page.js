'use client';

import { useEffect, useState } from 'react';
import { getWeeklyDigest } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import JournalEntryCard from '@/components/JournalEntryCard';

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
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const result = await getWeeklyDigest(data.session.user.id, todayString);

        setDigest(result);
        setSelectedDate(todayString);
        setPendingDate(todayString);
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
      const result = await getWeeklyDigest(session.user.id, date || undefined);
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
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    setPendingDate(todayString);
    setSelectedDate(todayString);
    fetchDigestForDate(todayString);
  };

  if (!session) return null;

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      {/* Sticky Topbar */}
      <div className="sticky top-16 z-30 bg-white dark:bg-black py-4 md:px-10 border-b border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-wrap items-center justify-between px-6">
        <h1 className="text-2xl font-bold">Weekly Digest 📚</h1>

        <div className="flex items-center gap-4">
          <input
            type="date"
            value={pendingDate}
            onChange={(e) => setPendingDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />
          <button
            onClick={handleApply}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            Apply
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-zinc-700 dark:text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Digest Content */}
      <div className="flex-1 flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full">
        {loading ? (
          [...Array(3)].map((_, idx) => (
            <JournalEntryCard key={idx} loading />
          ))
        ) : (!digest || digest.new_memory_count === 0) ? (
          <EmptyState />
        ) : (
          <>
            <p className="text-lg text-center mt-6">
              You saved <span className="font-semibold">{digest.new_memory_count}</span> new memories this week! 🎉
            </p>

            <AnimatePresence>
              {digest.journal_entries.map((entry, idx) => (
                <JournalEntryCard key={idx} entry={entry} />
              ))}
            </AnimatePresence>
          </>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-20">
      <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center dark:bg-zinc-800">
        <span className="text-gray-400">No Memories</span>
      </div>
      <p className="text-gray-400">No memories saved this week yet!</p>
      <p className="text-gray-400">Let&apos;s create some new coding memories! 🚀</p>
    </div>
  );
}
