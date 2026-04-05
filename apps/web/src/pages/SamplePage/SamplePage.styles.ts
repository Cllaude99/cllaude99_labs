import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  font-size: 1.125rem;
  color: #a0a0a0;
  max-width: 480px;
  text-align: center;
  line-height: 1.6;
`;
