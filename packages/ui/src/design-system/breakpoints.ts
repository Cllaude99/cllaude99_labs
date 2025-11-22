/* 크롬 개발자 도구 기준 */
const breakpoints = {
  mobile: '425px',
  tablet: '768px',
  desktop: '1024px',
} as const;

const mq = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
} as const;

export { breakpoints, mq };
