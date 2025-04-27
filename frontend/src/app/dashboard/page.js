'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import SearchBar from '@/components/SearchBar';
import MemoryCard from '@/components/MemoryCard';
import { searchMemory, fetchProjects, fetchAllMemories } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [query, setQuery] = useState('');
  const [allMemories, setAllMemories] = useState([]); // 🆕 All loaded memories
  const [filteredMemories, setFilteredMemories] = useState([]); // 🆕 Locally filtered memories
  const [loading, setLoading] = useState(false);

  const [projectFilter, setProjectFilter] = useState('');
  const [availableProjects, setAvailableProjects] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [fixedFilter, setFixedFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

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

  useEffect(() => {
    if (session?.user?.id) {
      loadMemories(session.user.id);
      loadProjects(session.user.id);
    }
  }, [session?.user?.id]);

  const loadMemories = async (userId) => {
    try {
      setLoading(true);
      const memories = await fetchAllMemories(userId);
      setAllMemories(memories);
      setFilteredMemories(memories); // Initially show all
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async (userId) => {
    try {
      const res = await fetchProjects(userId);
      const projectList = res.map((p) => p.project).filter((p) => p && p.trim() !== '');
      setAvailableProjects(projectList);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const applyFilters = () => {
    let filtered = allMemories;

    // Project filter
    if (projectFilter) {
      filtered = filtered.filter((mem) => (mem.project || '') === projectFilter);
    }

    // Fixed filter
    if (fixedFilter) {
      const isFixed = fixedFilter === 'fixed';
      filtered = filtered.filter((mem) => mem.fixed_by_ai === isFixed);
    }

    // Date filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      filtered = filtered.filter((mem) => new Date(mem.timestamp) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      filtered = filtered.filter((mem) => new Date(mem.timestamp) <= to);
    }

    // Tag filter (substring match)
    if (tagFilter) {
      const tagLower = tagFilter.toLowerCase();
      filtered = filtered.filter((mem) =>
        (mem.tags || []).some((tag) => tag.toLowerCase().includes(tagLower))
      );
    }

    setFilteredMemories(filtered);
  };

  const handleClearFilters = () => {
    setProjectFilter('');
    setDateFrom('');
    setDateTo('');
    setFixedFilter('');
    setTagFilter('');
    setQuery('');
    setFilteredMemories(allMemories); // Reset to all memories
  };

  const handleTagChange = (e) => {
    setTagFilter(e.target.value.toLowerCase());
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilters();
    }
  };

  const handleProjectChange = (e) => {
    setProjectFilter(e.target.value);
    applyFilters();
  };

  const handleFixedFilterChange = (e) => {
    setFixedFilter(e.target.value);
  };

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
  };

  useEffect(() => {
    applyFilters();
  }, [tagFilter, projectFilter, fixedFilter, dateFrom, dateTo]);

  if (!session) return null;

  return (
    <main className="min-h-screen px-4 py-10 md:px-10 bg-white dark:bg-black text-black dark:text-white">
      <div className="sticky top-16 z-30 bg-white dark:bg-black pt-6 pb-4 md:px-10 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h1 className="text-3xl font-bold mb-4">🔍 Search Your Memory</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={projectFilter}
            onChange={handleProjectChange}
            className="px-3 py-2 border rounded-md w-48 text-sm dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="">All Projects</option>
            {availableProjects.map((proj, i) => (
              <option key={i} value={proj}>
                {proj}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={handleDateFromChange}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />

          <input
            type="date"
            value={dateTo}
            onChange={handleDateToChange}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />

          <select
            value={fixedFilter}
            onChange={handleFixedFilterChange}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="">All</option>
            <option value="fixed">Fixed by AI</option>
            <option value="original">User Fixed</option>
          </select>

          <input
            type="text"
            placeholder="Filter by Tag"
            value={tagFilter}
            onChange={handleTagChange}
            onKeyDown={handleTagKeyDown}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />

          <button
            onClick={applyFilters}
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
        <SearchBar query={query} setQuery={setQuery} onSearch={applyFilters} />
      </div>

      {/* Results */}
      <div className="space-y-6">
        {loading && (
          <div className="text-center text-gray-400 dark:text-gray-500 my-8">
            Loading memories...
          </div>
        )}
        {!loading && filteredMemories.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-10 text-sm">
            No memories found. Try a different search or filters.
          </div>
        )}
        {!loading && (
          <AnimatePresence>
            {filteredMemories.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <MemoryCard
                  entry={entry}
                  onDelete={() => {
                    setAllMemories((prev) => prev.filter((e) => e.id !== entry.id));
                    setFilteredMemories((prev) => prev.filter((e) => e.id !== entry.id));
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
