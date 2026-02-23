import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import * as S from './GameTutorial.styles';

const TUTORIAL_STEPS = [
  {
    title: '게임 소개',
    content:
      '2010~2025년 한국 주식 시뮬레이션에 오신 것을 환영합니다!',
  },
  {
    title: '익명 종목',
    content:
      '10개 종목은 알파벳 코드(A~J)로만 표시됩니다. 카테고리만 참고하여 순수하게 분석하세요.',
  },
  {
    title: '힌트 시스템',
    content:
      '매년 1월에 퀴즈를 풀거나 광고를 보고 투자 힌트를 얻으세요.',
  },
  {
    title: '투자 방법',
    content:
      '매년 연초 가격을 보고 매수/매도하세요. 투자 완료 버튼을 누르면 즉시 결산됩니다.',
  },
  {
    title: '블러 차트',
    content:
      '2년마다 블러 차트로 연간 추세를 미리 볼 수 있습니다. 힌트를 해금하면 차트가 공개됩니다.',
  },
  {
    title: '연말 결산',
    content:
      '투자 완료를 누르면 즉시 결산되고 자산이 다음 해로 이월됩니다. 16년간 최대 수익률을 목표로 하세요!',
  },
] as const;

interface GameTutorialProps {
  onComplete: () => void;
}

const GameTutorial = ({ onComplete }: GameTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <S.Overlay>
      <S.Dialog>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <S.StepContent>
              <S.StepTitle>{TUTORIAL_STEPS[currentStep].title}</S.StepTitle>
              <S.StepDescription>
                {TUTORIAL_STEPS[currentStep].content}
              </S.StepDescription>
            </S.StepContent>
          </motion.div>
        </AnimatePresence>

        <S.StepIndicator>
          {TUTORIAL_STEPS.map((_, i) => (
            <S.Dot key={i} active={i === currentStep} />
          ))}
        </S.StepIndicator>

        <S.ButtonGroup>
          {currentStep > 0 && (
            <S.PrevButton onClick={() => setCurrentStep((s) => s - 1)}>
              이전
            </S.PrevButton>
          )}
          <S.NextButton
            onClick={
              isLastStep ? onComplete : () => setCurrentStep((s) => s + 1)
            }
          >
            {isLastStep ? '시작하기' : '다음'}
          </S.NextButton>
        </S.ButtonGroup>
      </S.Dialog>
    </S.Overlay>
  );
};

export default GameTutorial;
