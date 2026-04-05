import styled from '@emotion/styled';

interface BadgeStyleProps {
  variant: 'default' | 'success' | 'warning' | 'error';
}

const VARIANT_COLORS = {
  default: { bg: '#2a2a3e', color: '#aaaacc' },
  success: { bg: '#0d3b22', color: '#34d399' },
  warning: { bg: '#3b3510', color: '#fbbf24' },
  error: { bg: '#3b1010', color: '#f87171' },
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
