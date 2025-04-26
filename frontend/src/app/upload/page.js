'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { saveMemory } from '@/lib/api';

export default function UploadPage() {
  const [session, setSession] = useState(null);

  const [project, setProject] = useState('');
  const [filename, setFilename] = useState('');
  const [text, setText] = useState('');
  const [fixedByAI, setFixedByAI] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.href = '/auth';
      } else {
        setSession(data.session);
      }
    };
    fetchSession();
  }, []);

  const handleUpload = async () => {
    if (!text.trim()) {
      setError('Memory content cannot be empty.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const payload = {
        user_id: session.user.id,
        project: project || '',
        filename: filename || '',
        text: text,
        fixed_by_ai: fixedByAI,
      };

      await saveMemory(payload);

      // ✅ Reset form
      setProject('');
      setFilename('');
      setText('');
      setFixedByAI(false);

      setSuccess(true);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload memory. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!session) return null;

  return (
    <main className="p-6 space-y-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold">Upload a New Memory 📚</h1>

      <div className="w-full max-w-2xl space-y-6">
        {/* Project */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Project (optional)</label>
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>

        {/* Filename */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Filename (optional)</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Memory Content *</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="px-3 py-2 border rounded-md text-sm resize-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-50 text-gray-800"
            placeholder="Paste your code snippet, note, bug explanation, or anything else here..."
          />
        </div>

        {/* Fixed by AI Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={fixedByAI}
            onChange={(e) => setFixedByAI(e.target.checked)}
            id="fixedByAI"
            className="w-4 h-4"
          />
          <label htmlFor="fixedByAI" className="text-sm">
            Fixed by AI?
          </label>
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Success */}
        {success && <div className="text-green-500 text-sm">✅ Memory uploaded successfully!</div>}

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            {uploading ? 'Uploading...' : 'Upload Memory'}
          </button>
          <button
            onClick={() => {
              setProject('');
              setFilename('');
              setText('');
              setFixedByAI(false);
              setError('');
              setSuccess(false);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-zinc-700 dark:text-white px-4 py-2 rounded-md text-sm"
          >
            Clear Form
          </button>
        </div>
      </div>
    </main>
  );
}
