'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Code2,
  Monitor,
  FileText,
  Lock,
  LucideIcon,
} from 'lucide-react';

interface Post {
  slug: string;
  title: string;
  category?: string;
  isPrivate?: boolean;
}

interface SidebarProps {
  posts: Post[];
}

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: '전체', icon: BookOpen },
  { id: 'Tech', name: 'Tech', icon: Code2 },
  { id: 'CS', name: 'CS', icon: Monitor },
  { id: 'Log', name: 'Log', icon: FileText },
];

export function Sidebar({ posts }: SidebarProps) {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const filteredPosts =
    activeCategory === 'all'
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  const SidebarContent = (): JSX.Element => (
    <nav className="px-4 lg:px-6 py-6 space-y-8">
      {/* 카테고리 목록 */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Categories
        </h2>
        <ul className="space-y-1">
          {CATEGORIES.map((category) => {
            const count =
              category.id === 'all'
                ? posts.length
                : posts.filter((p) => p.category === category.id).length;

            const Icon = category.icon;

            return (
              <li key={category.id}>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeCategory === category.id
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 포스트 목록 */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Posts
        </h2>
        {filteredPosts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 px-3">
            포스트가 없습니다.
          </p>
        ) : (
          <ul className="space-y-1">
            {filteredPosts.map((post) => {
              const isActive = pathname === `/post/${post.slug}`;
              return (
                <li key={post.slug}>
                  <Link
                    href={`/post/${post.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {post.isPrivate && (
                        <Lock className="w-3 h-3 flex-shrink-0" />
                      )}
                      {post.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* 모바일 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 모바일 사이드바 (슬라이드) */}
      <aside
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-80 bg-white dark:bg-[#171717] border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* 데스크톱 사이드바 */}
      <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
        <SidebarContent />
      </aside>
    </>
  );
}
