'use client';

import { useState, useEffect, useRef } from 'react';
import { chatWithGPT, saveChatQA, fetchProjects } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabaseClient';

export default function ChatInterface() {
  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  const [tags, setTags] = useState([]);        // 🆕 added
  const [tagInput, setTagInput] = useState(''); // 🆕 added

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.id) {
        loadProjects(data.session.user.id);
      }
    });
  }, []);

  const loadProjects = async (userId) => {
    try {
      const res = await fetchProjects(userId);
      setProjects(res.map((p) => p.project));
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !session?.user?.id) return;
    setLoading(true);
    try {
      const prompt = input.trim();

      const historyForAPI = messages
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
        .map(({ role, content }) => ({ role, content }));

      const res = await chatWithGPT(prompt, session.user.id, historyForAPI, selectedProject);
      const reply = res.response;
      const pulledMemories = res.memories || [];

      const updatedMessages = [
        ...messages,
        { role: 'user', content: prompt },
      ];

      if (pulledMemories.length > 0) {
        updatedMessages.push({ role: 'context', content: pulledMemories.join('\n') });
      }

      updatedMessages.push({ role: 'assistant', content: reply });

      setMessages(updatedMessages);
      setInput('');

      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('GPT chat failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (prompt, response) => {
    const confirmSave = window.confirm("Save this Q&A to your memory?");
    if (!confirmSave) return;
    try {
      await saveChatQA({
        user_id: session.user.id,
        prompt,
        response,
        project: selectedProject || '',
        filename: '',
        fixed_by_ai: true,
        tags: tags.length > 0 ? tags : undefined, // 🆕 pass tags
      });
      alert('✅ Q&A saved to memory!');
      setTags([]); // Clear tags after saving
    } catch (err) {
      console.error('Save failed:', err);
      alert('❌ Failed to save');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 🆕 Handle Tags input
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && newTag.length <= 20 && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!session) return null;

  return (
    <div className="h-screen flex flex-col dark:bg-zinc-950 text-white">
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 p-4 border-b border-zinc-800 text-black dark:text-white bg-zinc-50 dark:bg-zinc-950 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: Ask GPT + Project Selector */}
        <div className="flex flex-col">
          <div className="text-xl font-bold">💬 Ask GPT</div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="mt-2 p-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="" disabled hidden>Select a project</option>
            {projects.filter((p) => p && p.trim() !== '').map((project, i) => (
              <option key={i} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side: New Chat */}
        <button
          onClick={() => {
            const confirmReset = window.confirm('Start a new chat? This will erase the current one.');
            if (confirmReset) setMessages([]);
          }}
          className="text-sm text-blue-500 hover:underline cursor-pointer"
        >
          🆕 New Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
      >
        {messages.map((msg, i) => (
          <div key={i} className="text-sm whitespace-pre-wrap break-words">
            {msg.role === 'context' ? (
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-md my-3">
                <div className="text-xs font-bold text-yellow-700 dark:text-yellow-300 mb-2">🧠 Project Context Memories:</div>
                <div className="prose dark:prose-invert text-black dark:text-white">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <>
                <div className={`font-semibold ${msg.role === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
                  {msg.role === 'user' ? 'You:' : 'GPT:'}
                </div>
                <div className="prose dark:prose-invert max-w-none mt-1 mb-3 overflow-x-auto text-black dark:text-white">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.role === 'assistant' && i >= 1 && messages[i - 1].role === 'user' && (
                  <button
                    className="text-xs text-purple-500 hover:underline cursor-pointer"
                    onClick={() => handleSave(messages[i - 1].content, msg.content)}
                  >
                    💾 Save to Memory
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Fixed Input Footer */}
      <div className="sticky bottom-0 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-800 px-4 py-3 space-y-3">

        {/* 🆕 Tags Input */}
        <div className="flex flex-col">
          <label className="text-sm">Tags (optional)</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter"
            className="px-3 py-2 border rounded-md text-sm text-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center gap-1 dark:bg-blue-800 dark:text-white">
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="text-xs ml-1">❌</button>
              </span>
            ))}
          </div>
        </div>

        {/* Main Textarea */}
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            disabled={loading}
            className="text-gray-800 dark:text-white w-full p-3 rounded-md resize-none max-h-[200px] md:max-h-[400px] overflow-y-auto border border-black dark:border-gray-200 focus:ring-purple-500 dark:bg-zinc-800 placeholder-gray-400"
            placeholder="Ask something..."
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                const maxHeight = window.innerWidth < 768 ? 300 : 200;
                const nextHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
                textareaRef.current.style.height = `${nextHeight}px`;
              }
            }}
            onKeyDown={handleKeyDown}
            style={{ height: 'auto' }}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 cursor-pointer"
            >
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
