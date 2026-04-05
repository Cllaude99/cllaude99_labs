import Badge from '@/components/Badge';
import Layout from '@/components/Layout';

import * as S from './StatusPage.styles';

const SERVICES = [
  { name: 'API Server', status: 'success' as const, label: '정상' },
  { name: 'Database', status: 'success' as const, label: '정상' },
  { name: 'CDN', status: 'warning' as const, label: '지연' },
  { name: 'Auth Service', status: 'error' as const, label: '장애' },
];

const StatusPage = () => {
  return (
    <Layout>
      <S.Container>
        <S.Title>서비스 상태</S.Title>
        <S.StatusList>
          {SERVICES.map((service) => (
            <S.StatusItem key={service.name}>
              <S.ServiceName>{service.name}</S.ServiceName>
              <Badge variant={service.status}>{service.label}</Badge>
            </S.StatusItem>
          ))}
        </S.StatusList>
      </S.Container>
    </Layout>
  );
};

export default StatusPage;
