import { palette } from '@cllaude99/ui/design-system/palette';

// 거래 색상 (coral 계열)
const CORAL_500 = '#F04452';
const CORAL_400 = '#FF616E';

// 오버레이
const BLACK_ALPHA_60 = 'rgba(0, 0, 0, 0.6)';
const BLACK_ALPHA_80 = 'rgba(0, 0, 0, 0.8)';

// 차트 영역 투명도 (hex 20%)
const CHART_AREA_ALPHA = '33';

export interface TradersColors {
  // 배경
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;

  // 텍스트
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textLink: string;

  // 보더
  borderPrimary: string;
  borderSecondary: string;

  // CTA / 인터랙티브
  ctaPrimary: string;
  ctaPrimaryLight: string;
  ctaSecondaryBg: string;
  ctaSecondaryBorder: string;
  ctaSecondaryText: string;

  // 거래 (한국 증권 관례)
  buy: string;
  sell: string;
  profitPositive: string;
  profitNegative: string;

  // 표면
  surfaceCard: string;
  surfaceOverlay: string;
  surfaceElevated: string;

  // 차트
  chartLine: string;
  chartArea: string;
  chartGrid: string;
  chartBg: string;

  // 상태
  statusError: string;
  statusErrorLight: string;

  // 스켈레톤
  skeletonBase: string;
  skeletonBg: string;

  // 기타
  rankHighlight: string;
}

export const tradersLightColors: TradersColors = {
  // 배경
  bgPrimary: palette.white,
  bgSecondary: palette.grey50,
  bgTertiary: palette.grey100,

  // 텍스트
  textPrimary: palette.grey800,
  textSecondary: palette.grey600,
  textTertiary: palette.grey400,
  textInverse: palette.white,
  textLink: palette.blue500,

  // 보더
  borderPrimary: palette.grey200,
  borderSecondary: palette.grey150,

  // CTA / 인터랙티브
  ctaPrimary: palette.blue500,
  ctaPrimaryLight: palette.blue100,
  ctaSecondaryBg: 'transparent',
  ctaSecondaryBorder: palette.blue500,
  ctaSecondaryText: palette.blue500,

  // 거래 (매수 coral)
  buy: CORAL_500,
  sell: palette.blue500,
  profitPositive: CORAL_500,
  profitNegative: palette.blue500,

  // 표면
  surfaceCard: palette.white,
  surfaceOverlay: BLACK_ALPHA_60,
  surfaceElevated: palette.white,

  // 차트
  chartLine: palette.blue500,
  chartArea: `${palette.blue500}${CHART_AREA_ALPHA}`,
  chartGrid: palette.grey50,
  chartBg: palette.white,

  // 상태
  statusError: palette.red500,
  statusErrorLight: palette.red100,

  // 스켈레톤
  skeletonBase: palette.grey200,
  skeletonBg: palette.grey50,

  // 기타
  rankHighlight: palette.yellow500,
};

export const tradersDarkColors: TradersColors = {
  // 배경
  bgPrimary: palette.grey900,
  bgSecondary: palette.grey800,
  bgTertiary: palette.grey700,

  // 텍스트
  textPrimary: palette.grey100,
  textSecondary: palette.grey300,
  textTertiary: palette.grey500,
  textInverse: palette.grey900,
  textLink: palette.blue400,

  // 보더
  borderPrimary: palette.grey600,
  borderSecondary: palette.grey700,

  // CTA / 인터랙티브
  ctaPrimary: palette.blue500,
  ctaPrimaryLight: palette.blue900,
  ctaSecondaryBg: 'transparent',
  ctaSecondaryBorder: palette.blue400,
  ctaSecondaryText: palette.blue400,

  // 거래
  buy: CORAL_400,
  sell: palette.blue400,
  profitPositive: CORAL_400,
  profitNegative: palette.blue400,

  // 표면
  surfaceCard: palette.grey800,
  surfaceOverlay: BLACK_ALPHA_80,
  surfaceElevated: palette.grey700,

  // 차트
  chartLine: palette.blue400,
  chartArea: `${palette.blue400}${CHART_AREA_ALPHA}`,
  chartGrid: palette.grey800,
  chartBg: palette.grey900,

  // 상태
  statusError: palette.red400,
  statusErrorLight: palette.red900,

  // 스켈레톤
  skeletonBase: palette.grey700,
  skeletonBg: palette.grey800,

  // 기타
  rankHighlight: palette.yellow400,
};
