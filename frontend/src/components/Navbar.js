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
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
          🧠 Memo.dev
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:underline text-gray-700 dark:text-gray-300">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm hover:underline text-gray-700 dark:text-gray-300">
            Dashboard
          </Link>
          <Link href="/ask" className="text-sm hover:underline text-gray-700 dark:text-gray-300">
            Ask GPT
          </Link>


          {session?.user ? (
            <button onClick={handleLogout} className="text-red-500 text-sm hover:underline cursor-pointer">
              Sign Out
            </button>
          ) : (
            <button onClick={() => router.push('/auth')} className="text-blue-600 text-sm hover:underline cursor-pointer">
              Sign In
            </button>
          )}

          <div className="ml-2 flex items-center">
            <DarkModeToggle compact />
          </div>
        </nav>
      </div>
    </header>
  );
}
