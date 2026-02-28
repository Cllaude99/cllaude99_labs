import Moon from '@cllaude99/icon/Moon';
import Sun from '@cllaude99/icon/Sun';

import * as S from './FloatingThemeToggle.styles';
import { useTradersThemeMode } from '../../theme/TradersThemeProvider';

const FloatingThemeToggle = () => {
  const { mode, setMode } = useTradersThemeMode();

  return (
    <S.ToggleButton
      type="button"
      aria-label="테마 변경"
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      {mode === 'light' ? <Moon /> : <Sun />}
    </S.ToggleButton>
  );
};

export default FloatingThemeToggle;
