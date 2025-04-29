'use client';

import { motion } from 'framer-motion'; // 🆕 Import motion

export default function GuidePage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen px-6 py-12 bg-white dark:bg-black text-black dark:text-white"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold mb-8 text-center">🧠 Welcome to Memo.dev User Guide</h1>

        {/* Welcome Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">About Memo.dev</h2>
          <p>
            Memo.dev helps you save, search, and organize your technical knowledge and code snippets using AI.
            Easily upload memories, search them semantically, and chat with GPT-4o with full project context!
          </p>
        </section>

        {/* Upload Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">📂 Uploading Memories</h2>
          <p>
            Go to the <strong>Upload</strong> page to add a new memory. You can:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Write text manually using the rich-text editor</li>
            <li>Upload a file (.txt, .md, .py, .js, .cpp, etc.)</li>
            <li>Add optional tags for easy searching later</li>
          </ul>
        </section>

        {/* Search Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🔍 Searching Memories</h2>
          <p>
            On the <strong>Dashboard</strong>, use filters to search:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>By project name</li>
            <li>By date range</li>
            <li>By fixed-by-AI status</li>
            <li>By tag (dynamic substring match)</li>
          </ul>
        </section>

        {/* GPT Chat Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💬 Asking GPT with Project Context</h2>
          <p>
            Go to the <strong>Ask GPT</strong> page:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Select a project (optional) to provide context memories</li>
            <li>Type your question and press Send</li>
            <li>GPT will answer, optionally pulling relevant past memories!</li>
          </ul>
        </section>

        {/* Saving GPT Chat Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💾 Saving GPT Answers</h2>
          <p>
            After GPT answers your question, click <strong>&quot;💾 Save to Memory&quot;</strong> below the response
            if you want to store that Q&A into your personal memory base.
          </p>
        </section>

        {/* Weekly Digest Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🗓 Weekly Digest</h2>
          <p>
            The <strong>Weekly Digest</strong> page summarizes your saved memories each week.
            Memories are clustered into highlights for easy review, like a personal journal.
          </p>
        </section>

        {/* Tags and Projects Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">🏷 Using Tags and Projects</h2>
          <p>
            Use <strong>Tags</strong> when uploading memories to organize content by topic.
            Use <strong>Projects</strong> to group memories under a larger umbrella (e.g., &quot;Startup Project&quot;, &quot;System Design&quot;).
          </p>
        </section>

        {/* Tips Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">💡 Tips & FAQs</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Save both questions and fixed answers to build your personal coding memory</li>
            <li>Use tags carefully — they are very powerful for search later</li>
            <li>Weekly Digest is refreshed automatically every Monday!</li>
          </ul>
        </section>
      </div>
    </motion.main>
  );
}
