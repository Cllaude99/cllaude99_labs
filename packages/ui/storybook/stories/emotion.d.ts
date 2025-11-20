import '@emotion/react';
import { ThemeType } from '../../src/design-system/theme';

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
