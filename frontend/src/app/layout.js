import "./globals.css";
import Navbar from "@/components/Navbar";
import RecoveryRedirector from "@/components/RecoveryRedirector";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper"; // (assuming you already have this)

export const metadata = {
  title: "Memo.dev — Your Personalized AI Memory",
  description: "Save, search, and organize your technical knowledge and code with Memo.dev's AI memory assistant.",
  openGraph: {
    title: "Memo.dev — Your Personalized AI Memory",
    description: "Save, search, and organize your technical knowledge and code with Memo.dev's AI memory assistant.",
    url: "https://your-memo-dev-domain.com",
    siteName: "Memo.dev",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <ThemeProviderWrapper>
          <RecoveryRedirector>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-800">
              © 2025 Memo.dev. All Rights Reserved.
            </footer>
          </RecoveryRedirector>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
