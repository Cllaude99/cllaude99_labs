'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { MermaidDiagram } from './MermaidDiagram';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // 텍스트를 ID로 변환하는 헬퍼 함수
  const generateId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h2(props) {
          const { children } = props;
          const text = String(children);
          const id = generateId(text);
          return <h2 id={id}>{children}</h2>;
        },
        h3(props) {
          const { children } = props;
          const text = String(children);
          const id = generateId(text);
          return <h3 id={id}>{children}</h3>;
        },
        code(props) {
          const { node, inline, className, children, ...rest } = props as {
            node?: unknown;
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          };
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';

          if (!inline && language === 'mermaid') {
            return (
              <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
            );
          }

          return (
            <code className={className} {...rest}>
              {children}
            </code>
          );
        },
        img(props) {
          const { src, alt } = props as {
            src?: string;
            alt?: string;
          };

          // src가 없으면 기본 img 태그 반환 (예외 케이스)
          if (!src) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img alt={alt || ''} {...props} />;
          }

          return (
            <Image
              src={src}
              alt={alt || ''}
              width={800}
              height={533}
              className="rounded-lg my-6"
              style={{ maxWidth: '600px', width: '100%', height: 'auto' }}
              sizes="(max-width: 768px) 100vw, 600px"
              loading="lazy"
              priority={false}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
