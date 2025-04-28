'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration error
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`cursor-pointer z-50 rounded-full border flex items-center justify-center transition ${
        compact
          ? "w-10 h-10 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:scale-110"
          : "fixed top-4 right-4 w-10 h-10 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 hover:scale-110"
      }`}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
