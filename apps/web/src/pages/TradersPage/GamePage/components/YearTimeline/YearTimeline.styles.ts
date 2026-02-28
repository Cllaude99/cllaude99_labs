import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const YearDot = styled.button<{ status: 'past' | 'current' | 'future' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 28px;
  border-radius: 14px;
  border: 1px solid
    ${({ theme, status }) => {
      if (status === 'current') return theme.traders.ctaPrimary;
      if (status === 'past') return theme.traders.ctaPrimaryLight;
      return theme.traders.borderSecondary;
    }};
  background-color: ${({ theme, status }) => {
    if (status === 'current') return `${theme.traders.ctaPrimary}26`;
    if (status === 'past') return `${theme.traders.ctaPrimary}0D`;
    return 'transparent';
  }};
  cursor: default;
  transition: all 0.2s;
`;

const YearLabel = styled.span<{ status: 'past' | 'current' | 'future' }>`
  font-size: 11px;
  font-weight: ${({ status }) => (status === 'current' ? 700 : 400)};
  color: ${({ theme, status }) => {
    if (status === 'current') return theme.traders.ctaPrimary;
    if (status === 'past') return theme.traders.textSecondary;
    return theme.traders.textTertiary;
  }};
  font-variant-numeric: tabular-nums;
`;

const Connector = styled.div<{ active: boolean }>`
  width: 8px;
  height: 2px;
  background-color: ${({ theme, active }) =>
    active ? theme.traders.ctaPrimaryLight : theme.traders.borderSecondary};
  flex-shrink: 0;
`;

export { Container, YearDot, YearLabel, Connector };
