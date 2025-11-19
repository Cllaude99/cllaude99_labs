'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Giscus from '@giscus/react';

export function Comments() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <Giscus
        id="comments"
        repo="Cllaude99/cllaude99_labs"
        repoId="R_kgDOPj97Mg"
        category="General"
        categoryId="DIC_kwDOPj97Ms4CwjWM"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
