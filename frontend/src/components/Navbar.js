'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-black shadow-sm dark:shadow-md border-b border-gray-200 dark:border-gray-800 transition">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo or Home */}
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
          🧠 Memo.dev
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:underline text-gray-700 dark:text-gray-300">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm hover:underline text-gray-700 dark:text-gray-300">
            Dashboard
          </Link>

          {/* Theme Toggle */}
          <div className="ml-2 flex items-center">
            <DarkModeToggle compact />
          </div>
        </nav>
      </div>
    </header>
  )
}
