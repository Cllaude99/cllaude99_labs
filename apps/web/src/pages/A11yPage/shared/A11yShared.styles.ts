import { Link } from 'react-router-dom';

import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 24px;

  &:hover {
    color: #3182f6;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonCard = styled.div<{ variant: 'bad' | 'good' }>`
  padding: 24px;
  border-radius: 12px;
  border: 1px solid
    ${({ variant }) => (variant === 'bad' ? '#fecaca' : '#bbf7d0')};
  background-color: ${({ variant }) =>
    variant === 'bad' ? '#fef2f2' : '#f0fdf4'};
`;

const CardLabel = styled.span<{ variant: 'bad' | 'good' }>`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 16px;
  color: ${({ variant }) => (variant === 'bad' ? '#dc2626' : '#16a34a')};
  background-color: ${({ variant }) =>
    variant === 'bad' ? '#fee2e2' : '#dcfce7'};
`;

const Hint = styled.p`
  margin-top: 16px;
  padding: 12px 16px;
  font-size: 13px;
  color: #4b5563;
  background-color: #eff6ff;
  border-radius: 8px;
  border-left: 3px solid #3182f6;
  line-height: 1.6;
`;

const VerificationSection = styled.section`
  margin-top: 40px;
`;

const VerificationTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const VerificationStep = styled.li`
  font-size: 14px;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 4px;
`;

const DivButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background-color: #3182f6;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
`;

const RealButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background-color: #3182f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }

  &:focus-visible {
    outline: 2px solid #3182f6;
    outline-offset: 2px;
  }
`;

export {
  Container,
  BackLink,
  Title,
  Description,
  ComparisonGrid,
  ComparisonCard,
  CardLabel,
  Hint,
  VerificationSection,
  VerificationTitle,
  VerificationStep,
  DivButton,
  RealButton,
};
