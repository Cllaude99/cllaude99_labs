import styled from '@emotion/styled';

const ErrorImage = styled.img`
  margin-top: 13.75rem;
  width: 228px;
  height: 228px;
  object-fit: cover;
`;

const Title = styled.h1`
  margin-top: 1.4375rem;
  ${({ theme }) => theme.typography.title.display1};
  color: ${({ theme }) => theme.palette.common.black};
  margin-bottom: 8px;
`;

const Description = styled.p`
  ${({ theme }) => theme.typography.body.body2};
  color: ${({ theme }) => theme.palette.gray['gray-5']};
  white-space: pre-line;
  text-align: center;
`;

const ErrorText = styled.p`
  ${({ theme }) => theme.typography.body.body1};
  color: ${({ theme }) => theme.palette.gray['gray-5']};
  margin-top: 8px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: fixed;
  bottom: 40px;
  padding: 0px 20px;
  max-width: ${({ theme }) => theme.breakpoints.mobile};
  margin: 0 auto;

  button {
    width: 100%;
    margin-bottom: 6px;
  }
`;

export { ErrorImage, Title, Description, ErrorText, ButtonWrapper };
