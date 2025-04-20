import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Memo.dev",
  description: "Your Personalized AI Coding Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
