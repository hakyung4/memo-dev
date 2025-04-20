"use client";

export default function MemoryCard({ entry }) {
    return (
      <div className="p-4 border rounded-xl shadow bg-white text-sm space-y-2">
        <div className="text-gray-600 text-xs">
          📁 {entry.project} / {entry.filename}
        </div>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48">
          {entry.text}
        </pre>
        <div className="text-gray-400 text-xs">
          🕒 {new Date(entry.timestamp).toLocaleString()}
        </div>
      </div>
    );
}
  