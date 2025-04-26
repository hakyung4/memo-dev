import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const CytoscapeGraph = dynamic(() => import('@/components/CytoscapeGraph'), { ssr: false });

export default function MemoryGraph({ graph }) {
  const cyRef = useRef(null); // 🆕 New: Track Cytoscape instance

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [loadingMemory, setLoadingMemory] = useState(false);

  async function fetchMemoryDetail(id) {
    try {
      setLoadingMemory(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/memory/detail/${id}`);
      if (!res.ok) throw new Error('Failed to fetch memory');
      const data = await res.json();
      setSelectedMemory(data);
    } catch (err) {
      console.error('❌ Memory fetch error:', err);
      alert('Failed to load memory.');
    } finally {
      setLoadingMemory(false);
    }
  }

  return (
    <div className="relative w-full h-[80vh]">
      {/* Cytoscape Graph */}
      <CytoscapeGraph graph={graph} onNodeClick={fetchMemoryDetail} cyRef={cyRef} />

      {/* Modal */}
      {(loadingMemory || selectedMemory) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl max-w-lg w-full">
            {loadingMemory ? (
              <div className="text-center py-20 text-lg">Loading Memory...</div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Memory Detail</h2>
                <div className="text-sm space-y-2">
                  <div><strong>Project:</strong> {selectedMemory?.project || '(none)'}</div>
                  <div><strong>Filename:</strong> {selectedMemory?.filename || '(untitled)'}</div>
                  <div><strong>Timestamp:</strong> {new Date(selectedMemory?.timestamp).toLocaleString()}</div>
                  <div className="mt-4 p-3 bg-gray-100 rounded dark:bg-zinc-800 dark:text-gray-300 max-h-48 overflow-y-auto text-xs whitespace-pre-wrap">
                    {selectedMemory?.text || '(no text)'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedMemory(null);
                    if (cyRef.current) {
                      cyRef.current.$('node:selected').unselect(); // 🧠 Unselect node manually
                    }
                  }}
                  className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
