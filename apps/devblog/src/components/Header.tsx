'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';
import type { Post } from '@/types/post';

interface HeaderProps {
  showBackButton?: boolean;
  posts: Post[];
  variant?: 'default' | 'centered';
}

export function Header({ showBackButton = false, posts, variant = 'default' }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#171717]/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-[#171717]/80 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {variant === 'centered' ? (
          <div className="h-16 flex items-center justify-between max-w-[52rem] mx-auto w-full px-4">
            <Link href="/" className="flex items-end gap-2">
              <Image
                src="/favicon.png"
                alt="Cllaude99"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Cllaude99
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors border border-gray-300 dark:border-gray-700 w-64 lg:w-80"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">글 검색...</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded flex-shrink-0">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <Link
                href="/about"
                className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                About
              </Link>

              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-16 flex items-center max-w-[1280px] mx-auto w-full">
            <div className="w-64 flex items-center px-4 lg:px-6 flex-shrink-0">
              {showBackButton && (
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mr-4"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              <Link href="/" className="flex items-end gap-2">
                <Image
                  src="/favicon.png"
                  alt="Cllaude99"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Cllaude99
                </span>
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-end gap-2 max-w-[52rem] mx-auto pr-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors border border-gray-300 dark:border-gray-700 w-64 lg:w-80"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">글 검색...</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded flex-shrink-0">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              <Link
                href="/about"
                className="hidden md:inline-flex px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                About
              </Link>

              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
      />
    </>
  );
}
