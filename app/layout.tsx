import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UnAI — 去除AI写作痕迹 | Remove AI Writing Patterns',
  description: 'Make AI-generated text sound naturally human. 让AI写的文字像人写的一样自然。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  );
}
