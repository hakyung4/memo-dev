'use client';

import { useLayoutEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

export default function CytoscapeGraph({ graph, onNodeClick, cyRef }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // If graph is invalid or empty, safely destroy Cytoscape and return
    if (!graph || !graph.nodes || graph.nodes.length === 0) {
      if (cyRef.current) {
        try {
          cyRef.current.destroy();
        } catch (err) {
          console.warn('Cytoscape destroy error (empty graph)', err);
        }
        cyRef.current = null;
      }
      return;
    }

    // Destroy previous instance safely
    if (cyRef.current) {
      try {
        cyRef.current.destroy();
      } catch (err) {
        console.warn('Cytoscape destroy error (before rebuild)', err);
      }
      cyRef.current = null;
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graph.nodes.map((n) => ({
          data: { id: n.id, label: n.label, ...n },
        })),
        ...graph.edges.map((e) => ({
          data: { source: e.source, target: e.target, weight: e.weight },
        })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3b82f6',
            'label': 'data(label)',
            'color': '#000',
            'font-size': '10px',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-outline-color': '#ffffff',
            'text-outline-width': 2,
            'width': 20,
            'height': 20,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#bbb',
            'target-arrow-color': '#bbb',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#60a5fa',
            'text-outline-color': '#000',
          },
        },
      ],
      layout: {
        name: 'cose',
        animate: false,
        padding: 30,
        nodeRepulsion: 80000,
        idealEdgeLength: 100,
        edgeElasticity: 100,
        gravity: 0.5,
      },
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      if (onNodeClick) {
        onNodeClick(node.data('id'));
      }
    });

    cyRef.current = cy;

    return () => {
      if (cyRef.current) {
        try {
          cyRef.current.destroy();
        } catch (err) {
          console.warn('Cytoscape destroy cleanup error', err);
        }
        cyRef.current = null;
      }
    };
  }, [graph]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-xl shadow border" />
  );
}
