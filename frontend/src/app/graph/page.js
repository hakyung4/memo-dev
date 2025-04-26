'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import MemoryGraph from '@/components/MemoryGraph';
import { getMemoryGraph } from '@/lib/api';

export default function GraphPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

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
    const fetchGraph = async () => {
      if (!session?.user?.id) return;
      const data = await getMemoryGraph(session.user.id);
      setGraphData(data);
    };
    fetchGraph();
  }, [session]);

  if (!session) return null;

  return (
    <main className="min-h-screen p-6 md:p-12 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🧠 Memory Graph</h1>
      <MemoryGraph graph={graphData} />
    </main>
  );
}
