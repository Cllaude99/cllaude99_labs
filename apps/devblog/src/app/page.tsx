import Link from 'next/link';
import { format } from 'date-fns';
import { Lock } from 'lucide-react';
import { getAllPosts } from '@/lib/posts';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { FloatingMenu } from '@/components/FloatingMenu';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#171717]">
      <Header posts={posts} />

      <div className="flex flex-1 max-w-[1280px] mx-auto w-full">
        <Sidebar posts={posts} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[52rem] mx-auto px-4 py-8">
            <div className="space-y-2">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    아직 게시글이 없습니다.
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <Link href={`/post/${post.slug}`} key={post.slug}>
                    <article className="group rounded-lg px-4 py-5 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex-1 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors truncate flex items-center gap-2">
                          {post.isPrivate && (
                            <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          )}
                          {post.title}
                        </h2>
                        <div className="hidden md:flex items-center gap-3 text-sm text-gray-500 dark:text-gray-500 flex-shrink-0">
                          <time dateTime={post.date}>
                            {format(new Date(post.date), 'yyyy-MM-dd')}
                          </time>
                          {post.category && (
                            <>
                              <span>·</span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {post.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Cllaude99</p>
        </div>
      </footer>

      <FloatingMenu />
    </div>
  );
}
