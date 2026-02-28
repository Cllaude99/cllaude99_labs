import '@emotion/react';
import { ThemeType } from '@cllaude99/ui/design-system/theme';

import type { TradersColors } from '@/pages/TradersPage/theme/colors';

declare module '@emotion/react' {
  export interface Theme extends ThemeType {
    traders: TradersColors;
  }
}
