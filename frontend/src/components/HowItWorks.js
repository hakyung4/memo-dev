"use client";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      title: "Ingest",
      desc: "Upload code, bugs, or fixes — manually or from GitHub.",
      emoji: "📥",
    },
    {
      title: "Embed",
      desc: "We convert your snippets into vector memory using GPT-4o.",
      emoji: "🧠",
    },
    {
      title: "Recall",
      desc: "Search semantically across all your past insights instantly.",
      emoji: "🔍",
    },
  ];

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900 text-center transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-10">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-full md:w-1/3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl mb-4">{step.emoji}</div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
