import { AnimatePresence, motion } from 'motion/react';

import * as S from './StockRevealAnimation.styles';
import type { RevealedStock } from '../../../interfaces/stock';


interface StockRevealAnimationProps {
  stocks: RevealedStock[];
}

const StockRevealAnimation = ({ stocks }: StockRevealAnimationProps) => {
  return (
    <S.Container>
      <S.Title>종목 공개</S.Title>
      <AnimatePresence>
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.alias_code}
            initial={{ opacity: 0, rotateY: 180 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{
              delay: index * 0.5,
              duration: 0.8,
              type: 'spring',
            }}
          >
            <S.StockCard>
              <S.AliasSection>
                <S.AliasCode>{stock.alias_code}</S.AliasCode>
                <S.Category>{stock.category}</S.Category>
              </S.AliasSection>
              <S.Arrow>→</S.Arrow>
              <S.RealNameSection>
                <S.RealName>{stock.real_name}</S.RealName>
              </S.RealNameSection>
            </S.StockCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </S.Container>
  );
};

export default StockRevealAnimation;
