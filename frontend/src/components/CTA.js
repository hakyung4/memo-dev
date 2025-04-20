"use client";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-20 bg-gray-100 dark:bg-black text-center transition-colors duration-300">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="text-3xl font-bold"
      >
        Ready to Remember Everything?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-4 dark:text-gray-300"
      >
        Save your bugs, fixes, code thoughts — and never lose context again.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <a
          href="/dashboard"
          className="px-6 py-3 bg-white text-black rounded-xl shadow hover:bg-gray-200"
        >
          Go to My Memory
        </a>
      </motion.div>
    </section>
  );
}
