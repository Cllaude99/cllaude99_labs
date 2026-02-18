import { Link } from 'react-router-dom';

import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;

  &:hover {
    border-color: #3182f6;
    box-shadow: 0 4px 12px rgba(49, 130, 246, 0.1);
  }
`;

const Badge = styled.span`
  display: inline-block;
  width: fit-content;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  color: #3182f6;
  background-color: #eff6ff;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  flex: 1;
`;

const CardLink = styled.span`
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #3182f6;
`;

export {
  Container,
  Title,
  Subtitle,
  CardGrid,
  Card,
  Badge,
  CardTitle,
  CardDescription,
  CardLink,
};
