import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post, PostFrontMatter } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter(
      (fileName) => fileName.endsWith('.mdx') && !fileName.startsWith('_'),
    )
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontMatter = data as PostFrontMatter;

      return {
        slug,
        title: frontMatter.title,
        description: frontMatter.description,
        date: frontMatter.date,
        published: frontMatter.published !== false,
        tags: frontMatter.tags || [],
        category: frontMatter.category,
        author: frontMatter.author || 'Default Author',
        content,
        isPrivate: frontMatter.isPrivate || false,
        readingTime: readingTime(content),
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getAllSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map((post) => post.slug);
}

export function verifyPostPassword(password: string): boolean {
  const correctPassword = process.env.PRIVATE_POST_PASSWORD;

  if (!correctPassword) {
    return false;
  }

  return correctPassword === password;
}
