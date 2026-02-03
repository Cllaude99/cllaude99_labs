import 'the-new-css-reset/css/reset.css';
import '../styles/index.css';

import type { Decorator, Preview } from '@storybook/react';
import React from 'react';

import { ThemeProvider } from '../../src/components/ThemeProvider';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators: Decorator[] = [
  (Story, context) => (
    <ThemeProvider>
      <Story {...context} />
    </ThemeProvider>
  ),
];

export default preview;
