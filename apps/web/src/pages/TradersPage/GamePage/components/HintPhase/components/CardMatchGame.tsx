import { useCallback, useEffect, useMemo, useState } from 'react';

import * as S from '../HintPhase.styles';

const CATEGORY_TERMS: Record<string, Array<[string, string]>> = {
  IT: [
    ['AI', '인공지능'],
    ['클라우드', 'SaaS'],
    ['빅데이터', '데이터분석'],
    ['IoT', '사물인터넷'],
    ['블록체인', '분산원장'],
    ['5G', '초고속통신'],
  ],
  반도체: [
    ['파운드리', '위탁생산'],
    ['메모리', 'DRAM'],
    ['팹리스', '설계전문'],
    ['웨이퍼', '실리콘판'],
    ['공정미세화', 'nm'],
    ['EUV', '극자외선'],
  ],
  자동차: [
    ['전기차', 'EV'],
    ['자율주행', 'ADAS'],
    ['배터리', '리튬이온'],
    ['수소차', 'FCEV'],
    ['모빌리티', 'MaaS'],
    ['OTA', '무선업데이트'],
  ],
  바이오: [
    ['신약개발', 'R&D'],
    ['임상시험', 'Phase3'],
    ['바이오시밀러', '복제약'],
    ['mRNA', '백신기술'],
    ['유전자치료', 'CGT'],
    ['CDM', '의약품개발'],
  ],
  금융: [
    ['핀테크', 'PayTech'],
    ['로보어드', '자동투자'],
    ['P2P', '대출중개'],
    ['인슈어테크', '보험혁신'],
    ['CBDC', '디지털화폐'],
    ['DeFi', '탈중앙금융'],
  ],
  에너지: [
    ['태양광', '솔라셀'],
    ['풍력', '터빈'],
    ['ESS', '에너지저장'],
    ['수소경제', '그린수소'],
    ['탄소중립', '넷제로'],
    ['RE100', '재생에너지'],
  ],
  엔터: [
    ['OTT', '스트리밍'],
    ['메타버스', '가상세계'],
    ['IP', '지적재산'],
    ['MCN', '크리에이터'],
    ['NFT', '디지털자산'],
    ['AR/VR', '실감콘텐츠'],
  ],
  유통: [
    ['이커머스', '온라인몰'],
    ['라이브커머스', '라방'],
    ['풀필먼트', '물류대행'],
    ['D2C', '직판'],
    ['구독경제', '정기배송'],
    ['퀵커머스', '즉시배송'],
  ],
};

const DEFAULT_TERMS: Array<[string, string]> = [
  ['GDP', '국내총생산'],
  ['CPI', '소비자물가'],
  ['금리', '이자율'],
  ['환율', '외화가치'],
  ['PER', '주가수익비율'],
  ['ROE', '자기자본수익률'],
];

interface Card {
  id: number;
  text: string;
  pairId: number;
}

interface CardMatchGameProps {
  category: string;
  onComplete: (attempts: number) => void;
}

const CardMatchGame = ({ category, onComplete }: CardMatchGameProps) => {
  const cards = useMemo(() => {
    const terms = CATEGORY_TERMS[category] ?? DEFAULT_TERMS;
    const selected = terms.slice(0, 6);

    const cardList: Card[] = [];
    selected.forEach(([a, b], idx) => {
      cardList.push({ id: idx * 2, text: a, pairId: idx });
      cardList.push({ id: idx * 2 + 1, text: b, pairId: idx });
    });

    for (let i = cardList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
    }

    return cardList;
  }, [category]);

  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [checking, setChecking] = useState(false);

  const handleClick = useCallback(
    (cardId: number) => {
      if (checking) return;
      if (flipped.has(cardId) || matched.has(cardId)) return;
      if (selected.length >= 2) return;

      const newSelected = [...selected, cardId];
      setSelected(newSelected);
      setFlipped((prev) => new Set([...prev, cardId]));

      if (newSelected.length === 2) {
        setAttempts((a) => a + 1);
        setChecking(true);

        const [first, second] = newSelected;
        const card1 = cards.find((c) => c.id === first);
        const card2 = cards.find((c) => c.id === second);

        if (card1 && card2 && card1.pairId === card2.pairId) {
          setMatched((prev) => new Set([...prev, first, second]));
          setSelected([]);
          setChecking(false);
        } else {
          setTimeout(() => {
            setFlipped((prev) => {
              const next = new Set(prev);
              next.delete(first);
              next.delete(second);
              return next;
            });
            setSelected([]);
            setChecking(false);
          }, 800);
        }
      }
    },
    [checking, flipped, matched, selected, cards],
  );

  useEffect(() => {
    if (matched.size !== cards.length) return;

    const timer = setTimeout(() => onComplete(attempts), 500);
    return () => clearTimeout(timer);
  }, [matched.size, cards.length, attempts, onComplete]);

  return (
    <S.MiniGameContainer>
      <S.Title>카드 뒤집기</S.Title>
      <S.AttemptsCounter>시도 횟수: {attempts}회</S.AttemptsCounter>
      <S.Subtitle>같은 뜻의 용어 짝을 맞추세요</S.Subtitle>
      <S.CardGrid>
        {cards.map((card) => (
          <S.FlipCard
            key={card.id}
            flipped={flipped.has(card.id)}
            matched={matched.has(card.id)}
            onClick={() => handleClick(card.id)}
            disabled={matched.has(card.id)}
          >
            {flipped.has(card.id) || matched.has(card.id) ? card.text : '?'}
          </S.FlipCard>
        ))}
      </S.CardGrid>
    </S.MiniGameContainer>
  );
};

export default CardMatchGame;
