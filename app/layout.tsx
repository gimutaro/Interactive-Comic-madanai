import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'マンガ見開きページ V21（P5コマ割り追加／P4ズーム#5）',
  description: 'Interactive manga reading experience with panel navigation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}