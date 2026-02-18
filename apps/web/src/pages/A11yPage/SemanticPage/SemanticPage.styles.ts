import styled from '@emotion/styled';

const NavList = styled.ul`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  list-style: none;
  padding: 0;
`;

const DivNavList = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const DivNavItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  color: #374151;
  background-color: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
`;

const RealNavItem = styled.a`
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  color: #374151;
  background-color: #f3f4f6;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }

  &:focus-visible {
    outline: 2px solid #3182f6;
    outline-offset: 2px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DivLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const DivInput = styled.div`
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #9ca3af;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;

const RealLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const RealInput = styled.input`
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #1a1a1a;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #3182f6;
    box-shadow: 0 0 0 2px rgba(49, 130, 246, 0.2);
  }
`;

export {
  NavList,
  DivNavList,
  DivNavItem,
  RealNavItem,
  FormGroup,
  DivLabel,
  DivInput,
  RealLabel,
  RealInput,
};
