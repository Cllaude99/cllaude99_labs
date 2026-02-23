import * as S from './YearTimeline.styles';
import { START_YEAR, END_YEAR } from '../../../constants/game';


interface YearTimelineProps {
  currentYear: number;
}

const years = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, i) => START_YEAR + i,
);

const YearTimeline = ({ currentYear }: YearTimelineProps) => {
  return (
    <S.Container>
      {years.map((year, index) => {
        const status =
          year < currentYear ? 'past' : year === currentYear ? 'current' : 'future';

        return (
          <div key={year} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <S.YearDot status={status}>
              <S.YearLabel status={status}>
                {String(year).slice(2)}
              </S.YearLabel>
            </S.YearDot>
            {index < years.length - 1 && (
              <S.Connector active={year < currentYear} />
            )}
          </div>
        );
      })}
    </S.Container>
  );
};

export default YearTimeline;
