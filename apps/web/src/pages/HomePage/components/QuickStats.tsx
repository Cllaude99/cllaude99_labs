import { useEffect, useState } from 'react';

import { PROJECTS } from '@/constants';

import * as S from './QuickStats.styles';

const TIME_UPDATE_INTERVAL_MS = 1000;
const KOREAN_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = KOREAN_DAYS[date.getDay()];
  return `${year}.${month}.${day} (${dayOfWeek})`;
}

const QuickStats = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, TIME_UPDATE_INTERVAL_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  return (
    <S.Container
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <S.Time>{formatTime(now)}</S.Time>
      <S.Date>{formatDate(now)}</S.Date>
      <S.ProjectCount>총 프로젝트 {PROJECTS.length}개</S.ProjectCount>
    </S.Container>
  );
};

export default QuickStats;
