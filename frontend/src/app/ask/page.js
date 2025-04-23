'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { supabase } from '@/lib/supabaseClient';

export default function AskPage() {
    const [session, setSession] = useState(null);
    const router = useRouter();
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
    if (!session) return null;
  return (
    <main className="min-h-screen px-4 py-10 md:px-10 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">💬 Ask GPT</h1>
      <ChatInterface />
    </main>
  );
}
