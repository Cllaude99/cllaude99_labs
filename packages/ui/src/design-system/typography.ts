import { css } from '@emotion/react';

const generateTypography = (
  size: number,
  weight: number,
  lineHeight: number,
  letterSpacing: string,
) => css`
  font-family:
    'Pretendard Variable',
    Pretendard,
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    sans-serif;
  font-style: normal;
  font-display: auto;
  font-size: ${size}px;
  font-weight: ${weight};
  line-height: ${lineHeight}px;
  letter-spacing: ${letterSpacing};
`;

const typography = {
  // Display (대형 제목)
  display1: generateTypography(48, 700, 58, '-0.02em'),
  display2: generateTypography(40, 700, 50, '-0.02em'),
  display3: generateTypography(32, 700, 42, '-0.02em'),

  // Heading (제목)
  heading1: generateTypography(28, 700, 38, '-0.01em'),
  heading2: generateTypography(24, 700, 34, '-0.01em'),
  heading3: generateTypography(22, 700, 32, '-0.01em'),
  heading4: generateTypography(20, 700, 28, '-0.01em'),

  // Title (부제목)
  title1: generateTypography(18, 600, 26, '-0.01em'),
  title2: generateTypography(16, 600, 24, '-0.01em'),
  title3: generateTypography(16, 500, 24, '-0.01em'),

  // Body (본문)
  body1: generateTypography(16, 400, 26, '-0.01em'),
  body1Bold: generateTypography(16, 600, 26, '-0.01em'),
  body2: generateTypography(15, 400, 24, '-0.01em'),
  body2Bold: generateTypography(15, 600, 24, '-0.01em'),
  body3: generateTypography(14, 400, 22, '-0.01em'),
  body3Bold: generateTypography(14, 600, 22, '-0.01em'),
  body4: generateTypography(13, 400, 20, '-0.01em'),
  body4Bold: generateTypography(13, 600, 20, '-0.01em'),

  // Label (레이블)
  label1: generateTypography(14, 500, 20, '-0.01em'),
  label1Bold: generateTypography(14, 600, 20, '-0.01em'),
  label2: generateTypography(13, 500, 18, '-0.01em'),
  label2Bold: generateTypography(13, 600, 18, '-0.01em'),
  label3: generateTypography(12, 500, 16, '-0.005em'),
  label3Bold: generateTypography(12, 600, 16, '-0.005em'),

  // Caption (캡션)
  caption1: generateTypography(12, 400, 18, '-0.005em'),
  caption2: generateTypography(11, 400, 16, '0em'),
} as const;

export { typography };
