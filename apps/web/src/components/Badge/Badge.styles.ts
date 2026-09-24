import styled from '@emotion/styled';

interface BadgeStyleProps {
  variant: 'default' | 'success' | 'warning' | 'error';
}

const VARIANT_COLORS = {
  default: { bg: '#1a1a2e', color: '#8888aa' },
  success: { bg: '#0a2e1a', color: '#44cc88' },
  warning: { bg: '#2e2a0a', color: '#ccaa44' },
  error: { bg: '#2e0a0a', color: '#cc4444' },
};

const Container = styled.span<BadgeStyleProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ variant }) => VARIANT_COLORS[variant].bg};
  color: ${({ variant }) => VARIANT_COLORS[variant].color};
`;

export { Container };
export type { BadgeStyleProps };
