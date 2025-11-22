import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'cllaude99',
  description: 'Cllaude99 개발 블로그',
  keywords: ['Next.js', 'TypeScript', 'Markdown', 'Tailwind CSS'],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Cllaude99 - 개발 블로그',
    description: 'Cllaude99 개발 블로그',
    type: 'website',
    siteName: 'Cllaude99',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 600,
        alt: 'Cllaude99 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cllaude99 - 개발 블로그',
    description: 'Cllaude99 개발 블로그',
    images: ['/favicon.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
