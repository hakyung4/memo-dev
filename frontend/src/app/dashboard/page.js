'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import SearchBar from '@/components/SearchBar';
import MemoryCard from '@/components/MemoryCard';
import VisualPreview from '@/components/VisualPreview';
import { searchMemory } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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
    if (!query || !session?.user?.id) return;
    try {
      const res = await searchMemory(query, session.user.id);
      setResults(res);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  useEffect(() => {
    if (query.length > 0 && session?.user?.id) handleSearch();
  }, [query]);

  if (!session) return null;

  return (
    <main className="min-h-screen px-4 py-10 md:px-10 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">🔍 Search Your Memory</h1>
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
      <div className="my-8">
        <VisualPreview results={results} />
      </div>
      <div className="space-y-6">
        {results.map((entry, i) => (
          <MemoryCard key={i} entry={entry} />
        ))}
      </div>
    </main>
  );
}
