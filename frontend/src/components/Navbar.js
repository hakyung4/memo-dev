'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DarkModeToggle from './DarkModeToggle';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inRecoveryMode, setInRecoveryMode] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');
    if (pathname === '/reset-password' && code) {
      setInRecoveryMode(true);
    } else {
      setInRecoveryMode(false);
    }
  }, [pathname, searchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return null;
  }

  const navLinks = (
    <>
      <Link href="/" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">Home</Link>
      <Link href="/dashboard" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">Dashboard</Link>
      <Link href="/weekly-digest" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">Weekly Digest</Link>
      <Link href="/graph" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">Graph</Link>
      <Link href="/ask" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">Ask GPT</Link>
      <Link href="/upload" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">Upload</Link>
      <Link href="/guide" className="text-sm hover:underline text-gray-700 dark:text-gray-300 p-2">Guide</Link>
    </>
  );

  const authButton = !inRecoveryMode && session?.user ? (
    <button
      onClick={handleLogout}
      aria-label="Sign Out"
      className="bg-red-500 hover:bg-red-600 text-white text-sm cursor-pointer py-1.5 px-4 rounded-md transition"
    >
      Sign Out
    </button>
  ) : !session?.user ? (
    <button
      onClick={() => router.push('/auth')}
      aria-label="Sign In"
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm cursor-pointer py-1.5 px-4 rounded-md transition"
    >
      Sign In
    </button>
  ) : null;

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md bg-white/80 dark:bg-black/80 backdrop-blur' : 'bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800'}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="/" aria-label="Memo.dev Home" className="text-lg font-bold text-gray-900 dark:text-white">
          🧠 Memo.dev
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks}
            {authButton}
            <DarkModeToggle compact />
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 border rounded-full border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Slide */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden flex flex-col gap-4 bg-white dark:bg-black py-4 px-6 border-t border-gray-200 dark:border-gray-800"
          >
            {navLinks}
            {authButton}
            <DarkModeToggle compact />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
