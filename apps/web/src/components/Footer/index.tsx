import * as S from './Footer.styles';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <S.Container>
      &copy; {currentYear} Cllaude99 Labs. All rights reserved.
    </S.Container>
  );
};

export default Footer;
