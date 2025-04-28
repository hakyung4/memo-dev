'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-black shadow-sm dark:shadow-md border-b border-gray-200 dark:border-gray-800 transition">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="/" aria-label="Memo.dev Home" className="text-lg font-bold text-gray-900 dark:text-white">
          🧠 Memo.dev
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">
            Dashboard
          </Link>
          <Link href="/weekly-digest" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">
            Weekly Digest
          </Link>
          <Link href="/graph" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">
            Graph
          </Link>
          <Link href="/ask" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">
            Ask GPT
          </Link>
          <Link href="/upload" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">
            Upload
          </Link>

          {/* Authentication Actions */}
          {session?.user ? (
            <button
              onClick={handleLogout}
              aria-label="Sign Out"
              className="bg-red-500 hover:bg-red-600 text-white text-sm cursor-pointer py-1.5 px-4 rounded-md transition"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => router.push('/auth')}
              aria-label="Sign In"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm cursor-pointer py-1.5 px-4 rounded-md transition"
            >
              Sign In
            </button>
          )}

          {/* Dark Mode Toggle */}
          <div className="ml-2 flex items-center">
            <DarkModeToggle compact />
          </div>
        </nav>
      </div>
    </header>
  );
}
