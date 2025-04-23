'use client';

import { useState, useEffect, useRef } from 'react';
import { chatWithGPT, saveChatQA } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabaseClient';

export default function ChatInterface() {
  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

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
      const history = messages.map(({ role, content }) => ({ role, content }));
      const res = await chatWithGPT(prompt, session.user.id, history);
      const reply = res.response;

      setMessages([
        ...messages,
        { role: 'user', content: prompt },
        { role: 'assistant', content: reply },
      ]);
      setInput('');
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
        project: '',
        filename: '',
        fixed_by_ai: true,
      });
      alert('✅ Q&A saved to memory!');
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

  return (
    <div className="h-screen flex flex-col dark:bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-16 z-30 p-4 border-b  border-zinc-800 text-black dark:text-white dark:bg-zinc-950 bg-zinc-50 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">💬 Ask GPT</h1>
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
          </div>
        ))}
      </div>

      {/* Fixed Input Footer */}
      <div className="sticky bottom-0 dark:bg-zinc-950 border-t border-zinc-800 px-4 py-3">
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            className="text-gray-800 dark:text-white w-full p-3 rounded-md resize-none max-h-[200px] md:max-h-[400px] overflow-y-auto border border-black dark:border-gray-200 focus:ring-purple-500 dark:bg-zinc-800 placeholder-gray-400"
            placeholder="Ask something..."
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'; // reset first
                const maxHeight = window.innerWidth < 768 ? 300 : 200;
                const nextHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
                textareaRef.current.style.height = `${nextHeight}px`;
              }
            }}
            onKeyDown={handleKeyDown}
            style={{
              height: 'auto',
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
