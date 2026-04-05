import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
  gap: 1.5rem;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  color: #333333;
  margin: 0;
`;

const Message = styled.p`
  font-size: 1.25rem;
  color: #a0a0a0;
`;

const HomeLink = styled.a`
  padding: 0.75rem 2rem;
  border: 1px solid #333333;
  border-radius: 8px;
  color: #ffffff;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #1a1a1a;
  }
`;

export { Container, ErrorCode, Message, HomeLink };
