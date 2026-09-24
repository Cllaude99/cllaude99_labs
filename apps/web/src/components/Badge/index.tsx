import { Container, BadgeStyleProps } from './Badge.styles';

interface BadgeProps extends BadgeStyleProps {
  children: React.ReactNode;
}

const Badge = ({ variant = 'default', children }: BadgeProps) => {
  return <Container variant={variant}>{children}</Container>;
};

export default Badge;
