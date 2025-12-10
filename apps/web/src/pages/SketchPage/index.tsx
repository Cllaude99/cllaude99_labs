import Dock from '@/components/Dock';

import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ZoomControls from './components/ZoomControls';
import * as S from './SketchPage.styles';
import { useSketchStore } from './stores/sketchStore';

const SketchPage = () => {
  const { theme } = useSketchStore();

  return (
    <S.SketchContainer themeMode={theme}>
      {/* 그리드 배경 */}
      <S.GridBackground themeMode={theme} />

      {/* 캔버스 */}
      <Canvas />

      {/* 상단 도구바 */}
      <Toolbar />

      {/* 좌측 하단 줌 컨트롤 */}
      <ZoomControls />

      {/* 우측 하단 도움말 */}
      <S.HelpText themeMode={theme}>
        <S.Kbd themeMode={theme}>Space</S.Kbd>+ 드래그로 이동 |
        <S.Kbd themeMode={theme}>Scroll</S.Kbd>로 확대/축소
      </S.HelpText>

      <Dock />
    </S.SketchContainer>
  );
};

export default SketchPage;
