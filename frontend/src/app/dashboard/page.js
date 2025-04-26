'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import SearchBar from '@/components/SearchBar';
import MemoryCard from '@/components/MemoryCard';
import { searchMemory } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion'; // 🆕 Add animation

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [projectFilter, setProjectFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [fixedFilter, setFixedFilter] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/auth');
      } else {
        setSession(data.session);
      }
    };
    fetchSession();
  }, []);

  const handleSearch = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);

      const filters = {
        query: query || '',
        user_id: session.user.id,
        project: projectFilter || undefined,
        fixed_by_ai: fixedFilter === 'fixed' ? true : fixedFilter === 'original' ? false : undefined,
        date_from: dateFrom ? new Date(dateFrom).toISOString() : undefined,
        date_to: dateTo ? new Date(dateTo).toISOString() : undefined,
        tags: undefined,
      };

      const res = await searchMemory(filters);
      setResults(res);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setProjectFilter('');
    setDateFrom('');
    setDateTo('');
    setFixedFilter('');
    setQuery('');
    setResults([]);
  };

  useEffect(() => {
    if (session?.user?.id !== undefined) {
      handleSearch();
    }
  }, [session?.user?.id]);

  if (!session) return null;

  return (
    <main className="min-h-screen px-4 py-10 md:px-10 bg-white dark:bg-black text-black dark:text-white">
      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white dark:bg-black pt-6 pb-4 md:px-10 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h1 className="text-3xl font-bold mb-4">🔍 Search Your Memory</h1>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Project"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 border rounded-md w-40 text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />
          <select
            value={fixedFilter}
            onChange={(e) => setFixedFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="">All</option>
            <option value="fixed">Fixed by AI</option>
            <option value="original">User Fixed</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-zinc-700 dark:text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            Clear Filters
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Loading Spinner */}
        {loading && (
          <div className="text-center text-gray-400 dark:text-gray-500 my-8">
            Loading memories...
          </div>
        )}

        {/* No Results Found */}
        {!loading && results.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
            No memories found. Try a different search or filters.
          </div>
        )}

        {/* Memory Cards */}
        {!loading && (
          <AnimatePresence>
            {results.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <MemoryCard
                  entry={entry}
                  onDelete={() => {
                    setResults((prev) => prev.filter((e) => e.id !== entry.id));
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
