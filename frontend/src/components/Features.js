"use client";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      title: "Semantic Code Search",
      desc: "Find your past fixes with natural language, not filenames.",
      icon: "🧩",
    },
    {
      title: "Visual Memory Graph",
      desc: "See how your knowledge evolves across projects and time.",
      icon: "🌐",
    },
    {
      title: "Auto-Fix Suggestions",
      desc: "Paste a bug → get a GPT-4o fix → save it to your memory.",
      icon: "🛠️",
    },
  ];

  return (
    <section id="features" className="py-20 px-6 text-center bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-10">What You Can Do</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-3xl">{f.icon}</div>
            <h3 className="text-xl font-semibold mt-4">{f.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
