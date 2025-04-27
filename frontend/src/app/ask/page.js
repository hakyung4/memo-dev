'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { supabase } from '@/lib/supabaseClient';
import { fetchProjects } from '@/lib/api'; // 🆕

export default function AskPage() {
    const [session, setSession] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
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

    useEffect(() => {
        const loadProjects = async () => {
            if (!session?.user?.id) return;
            try {
                const res = await fetchProjects(session.user.id);
                setProjects(res);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };
        loadProjects();
    }, [session?.user?.id]);

    if (!session) return null;

    return (
        <div>
            <ChatInterface selectedProject={selectedProject} />
        </div>
    );
}
