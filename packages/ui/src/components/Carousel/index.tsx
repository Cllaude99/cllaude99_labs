import { ReactNode, Children } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import * as S from './Carousel.styles';

interface Props {
  children: ReactNode;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const Carousel = ({ children, currentIndex, onIndexChange }: Props) => {
  const CarouselItems = Children.toArray(children);

  return (
    <S.Container>
      <S.PrevButton
        onClick={() => {
          const newIndex =
            currentIndex === 0 ? CarouselItems.length - 1 : currentIndex - 1;
          onIndexChange(newIndex);
        }}
      >
        ←
      </S.PrevButton>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{
            duration: 0.35,
          }}
          style={{ width: '100%' }}
        >
          {CarouselItems[currentIndex]}
        </motion.div>
      </AnimatePresence>

      <S.NextButton
        onClick={() => {
          const newIndex =
            currentIndex === CarouselItems.length - 1 ? 0 : currentIndex + 1;
          onIndexChange(newIndex);
        }}
      >
        →
      </S.NextButton>

      <S.DotsContainer>
        {[...Array(CarouselItems.length)].map((_, index) => (
          <S.Dot
            key={index}
            isActive={index === currentIndex}
            onClick={() => {
              if (index < 0 || index >= CarouselItems.length) return;
              onIndexChange(index);
            }}
            aria-label={`${index + 1}번째 슬라이드로 이동`}
          />
        ))}
      </S.DotsContainer>
    </S.Container>
  );
};

export default Carousel;
