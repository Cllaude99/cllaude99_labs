'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const mermaidTheme = resolvedTheme === 'dark' ? 'dark' : 'default';

    mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme,
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const renderDiagram = async () => {
      if (containerRef.current && chart) {
        try {
          const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const cleanChart = chart.replace(/%%\{init:.*?\}%%\n?/g, '');
          const { svg } = await mermaid.render(uniqueId, cleanChart);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<pre class="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</pre>`;
          }
        }
      }
    };

    renderDiagram();
  }, [chart, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto"
    />
  );
}
