'use client';

import { useState, useEffect } from 'react';
import { chatWithGPT, saveChatQA } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  // Fetch session on first render
  // useState(() => {
  //   supabase.auth.getSession().then(({ data }) => setSession(data.session));
  // }, []);

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
    try {
      await saveChatQA({
        user_id: session.user.id,
        prompt,
        response,
        project: "",
        filename: "",
        fixed_by_ai: true,
      });
      alert('✅ Q&A saved to memory!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('❌ Failed to save');
    }
  };

  return (
    <div className="mt-12 p-4 border rounded-xl bg-white dark:bg-zinc-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">💬 Ask GPT</h2>
        <button
          onClick={() => {
            const confirmReset = window.confirm("Are you sure you want to start a new chat? This will erase the current conversation.");
            if (confirmReset) setMessages([]);
          }}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          🆕 New Chat
        </button>
      </div>

      <div className="space-y-6 max-h-[50vh] overflow-y-auto border p-4 rounded mb-4 bg-zinc-50 dark:bg-zinc-800">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm whitespace-pre-wrap">
            <div className={`font-bold ${msg.role === 'user' ? 'text-blue-600' : 'text-green-500'}`}>
              {msg.role === 'user' ? 'You:' : 'GPT:'}
            </div>
            {/* <div className="mb-2 text-black dark:text-white">{msg.content}</div> */}
            {msg.role === 'assistant' ? (
              <div className="prose dark:prose-invert max-w-none mt-1 mb-3">
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>
              </div>
            ) : (
              <div className="text-black dark:text-white mt-1 mb-3">{msg.content}</div>
            )}
            {msg.role === 'assistant' && i >= 1 && messages[i - 1].role === 'user' && (
              <button
                className="text-xs text-purple-600 hover:underline cursor-pointer"
                onClick={() => handleSave(messages[i - 1].content, msg.content)}
              >
                💾 Save to Memory
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          className="flex-1 p-2 border rounded text-black dark:text-white dark:bg-zinc-800"
          type="text"
          value={input}
          placeholder="Ask a question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
