'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { saveMemory } from '@/lib/api';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function UploadPage() {
  const [session, setSession] = useState(null);

  const [project, setProject] = useState('');
  const [filename, setFilename] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [fixedByAI, setFixedByAI] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose dark:prose-invert min-h-[200px]',
      },
    },
  });

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 1MB.');
      return;
    }

    const allowedExtensions = ['txt', 'md', 'py', 'js', 'cpp', 'c', 'java', 'json', 'html', 'css', 'ts', 'tsx', 'go', 'rb', 'php'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setError('Unsupported file type.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      let fileContent = event.target.result;

      fileContent = fileContent
        .trim()
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n');

      if (editor) {
        editor.commands.setContent(`<pre>${escapeHtml(fileContent)}</pre>`);
      }
      setFilename(file.name);
      setError('');
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!editor || !editor.getHTML().trim() || editor.getHTML().trim() === '<p></p>') {
      setError('Memory content cannot be empty.');
      return;
    }

    let textToSave = editor.getHTML().trim();

    if (textToSave.startsWith('<p>') && textToSave.endsWith('</p>') && !textToSave.includes('<pre')) {
      textToSave = textToSave.replace(/^<p>/, '').replace(/<\/p>$/, '');
    }

    const confirmed = confirm('Are you sure you want to upload this memory?');
    if (!confirmed) return;

    setUploading(true);
    setError('');
    try {
      const payload = {
        user_id: session.user.id,
        project: project || '',
        filename: filename || '',
        text: textToSave,
        fixed_by_ai: fixedByAI,
        tags: tags.length > 0 ? tags : undefined,
      };

      await saveMemory(payload);

      setProject('');
      setFilename('');
      setFixedByAI(false);
      setTags([]);
      setSuccess(true);
      if (editor) editor.commands.clearContent();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload memory. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
    <main className="p-6 space-y-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center">Upload a New Memory 📚</h1>
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
            className="px-3 py-2 border rounded-md text-gray-900 dark:text-gray-50 text-sm dark:bg-zinc-800 dark:border-zinc-700"
            placeholder="Optional: set manually or filled from file upload"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Tags (optional)</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter"
            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800 dark:border-zinc-700"
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

        {/* Upload File */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Upload File (.txt, .md, .py, .js, etc.) (optional, max 1MB)</label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-black dark:bg-zinc-700 dark:hover:bg-gray-600 dark:text-white px-4 py-2 rounded-md text-sm border dark:border-zinc-700"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{filename || "No file selected"}</span>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.md,.py,.js,.cpp,.c,.java,.json,.html,.css,.ts,.tsx,.go,.rb,.php"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {/* Tiptap Editor */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Memory Content *</label>
          <div className="border rounded-md px-3 py-2 min-h-[200px] dark:bg-zinc-800 dark:border-zinc-700">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Fixed by AI */}
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            {uploading ? 'Uploading...' : 'Upload Memory'}
          </button>
          <button
            onClick={() => {
              setProject('');
              setFilename('');
              setFixedByAI(false);
              setTags([]);
              if (editor) editor.commands.clearContent();
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              setError('');
              setSuccess(false);
            }}
            className="bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:bg-zinc-700 dark:text-white px-4 py-2 rounded-md text-sm cursor-pointer"
          >
            Clear Form
          </button>
        </div>
      </div>
    </main>
  );
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
