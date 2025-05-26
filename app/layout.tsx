import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '宝宝今日吃啥 - 科学育儿好帮手',
  description: '为您的宝宝提供个性化的营养和发展建议，包括辅食推荐、亲子互动、智力开发和运动建议',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}