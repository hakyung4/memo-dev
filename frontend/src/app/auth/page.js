'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState(''); // 🆕 for signup success

  const handleSignUp = async () => {
    setError('');
    setInfoMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setInfoMessage('✅ Signup successful! Please check your email to confirm and then log in.');
    }
  };

  const handleSignIn = async () => {
    setError('');
    setInfoMessage('');
  
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
  
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Missing email or phone')) {
        setError('Please enter both email and password.');
      } else {
        setError(error.message);
      }
    } else {
      router.push('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">🔐 Welcome!</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
          It&apos;s that simple — just your email and password! 🚀
        </p>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 border rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignIn();
              }
            }}
          />
          <input
            className="w-full px-4 py-3 border rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignIn();
              }
            }}
          />
          {error && (
            <div className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200 rounded-md px-4 py-2 text-sm">
              ❌ {error}
            </div>
          )}

          {infoMessage && (
            <div className="text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200 rounded-md px-4 py-2 text-sm">
              {infoMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              onClick={handleSignIn}
              className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition transform hover:scale-105"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              <Link href="/reset-password" className="hover:underline text-blue-600 dark:text-blue-400">
                Forgot your password?
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
