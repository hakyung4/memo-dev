"use client";

export default function VisualPreview({ matches = [] }) {
  const grouped = matches.reduce((acc, item) => {
    const key = item.project || "Unknown";
    acc[key] = acc[key] || [];
    acc[key].push(item.filename);
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-2">🧠 Semantic Memory Map (Preview)</h2>
      <p className="text-sm text-indigo-200 mb-4">(Coming soon: visualize how your code memories connect.)</p>
      <div className="text-sm space-y-1">
        {Object.entries(grouped).map(([project, files], i) => (
          <div key={i}>
            {files.map((f, j) => (
              <div key={j}>• {project} / {f}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}