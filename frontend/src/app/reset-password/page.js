'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [mode, setMode] = useState('loading'); // loading | request | update
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      const user = session?.user;

      if (session && user) {
        // User is signed in (Supabase auto signs them in after password reset link)
        setMode('update');
      } else {
        setMode('request');
      }
    };

    checkSession();
  }, []);

  const handleRequestReset = async () => {
    setMessage('');
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('✅ Reset link sent! Please check your email.');
    }
  };

  const handleUpdatePassword = async () => {
    setMessage('');
    setError('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
    } else {
      setMessage('✅ Password updated! Redirecting to login...');
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/auth');
      }, 3000);
    }
  };

  if (mode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
        {mode === 'request' ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">🔑 Reset Your Password</h1>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 border rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRequestReset();
                    }
                  }}
              />
              {error && (
                <div className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200 rounded-md px-4 py-2 text-sm">
                  ❌ {error}
                </div>
              )}
              {message && (
                <div className="text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200 rounded-md px-4 py-2 text-sm">
                  {message}
                </div>
              )}
              <button
                onClick={handleRequestReset}
                className=" cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition transform hover:scale-105"
              >
                Send Reset Link
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">🔒 Set New Password</h1>
            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 border rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdatePassword();
                  }}
              />
              {error && (
                <div className="text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200 rounded-md px-4 py-2 text-sm">
                  ❌ {error}
                </div>
              )}
              {message && (
                <div className="text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200 rounded-md px-4 py-2 text-sm">
                  {message}
                </div>
              )}
              <button
                onClick={handleUpdatePassword}
                className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition transform hover:scale-105"
              >
                Update Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
