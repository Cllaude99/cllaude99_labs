import { breakpoints, mq } from './breakpoints';
import { palette } from './palette';
import { typography } from './typography';

const theme = {
  breakpoints,
  mq,
  palette,
  typography,
} as const;

type ThemeType = typeof theme;

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}

export { theme, type ThemeType };
