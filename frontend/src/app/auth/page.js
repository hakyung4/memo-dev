'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else {
      router.push('/dashboard');
      router.push('/ask');
    };
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else {
      router.push('/dashboard');
      router.push('/ask');
    };
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Sign In / Sign Up</h1>
      <input
        className="w-full p-2 mb-2 border border-black rounded text-black dark:text-white dark:border-white"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 mb-4 border border-black rounded text-black dark:text-white dark:border-white"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex gap-4">
        <button onClick={handleSignIn} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Sign In</button>
        <button onClick={handleSignUp} className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">Sign Up</button>
      </div>
    </div>
  );
}
