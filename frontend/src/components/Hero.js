"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="text-center py-24 px-6 md:px-12 bg-white dark:bg-black transition-colors duration-300">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
      >
        Code as Memory 🧠
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
      >
        A personalized AI memory system for developers. Store, search, and recall
        your code fixes, bugs, and insights — forever.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex justify-center gap-4"
      >
        <a
          href="/dashboard"
          className="px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-800"
        >
          Try the Demo
        </a>
        <a
          href="#features"
          className="px-6 py-3 border rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          Learn More
        </a>
      </motion.div>
    </section>
  );
}
