import { invokeFunction } from '../../apis/utils';

export interface QuizQuestion {
  quiz_id: string;
  question_number: number;
  question: string;
  options: string[];
}

interface QuizAnswerResult {
  quiz_id: string;
  is_correct: boolean;
  correct_option: number;
  explanation: string;
}

interface HintItem {
  hint_id: string;
  year: number;
  level: number;
  content: string;
  stock_id: string | null;
}

export interface QuizAnswerResponse {
  results: QuizAnswerResult[];
  correct_count: number;
  reward: {
    hint_level: 0 | 1 | 2 | 3;
    hints: HintItem[];
  };
}

export interface HintEntry {
  year: number;
  level: number;
  content: string;
  stock_id: string | null;
  unlock_method: 'quiz' | 'ad' | 'minigame';
  unlocked_at: string;
}

export interface MinigameResultResponse {
  game_type: 'price_prediction' | 'card_match';
  score: number;
  hint_level: 0 | 1 | 2 | 3;
  hints: HintItem[];
}

export async function getQuizList(
  year: number,
  stockId?: string,
): Promise<{ year: number; quizzes: QuizQuestion[] }> {
  return invokeFunction<{ year: number; quizzes: QuizQuestion[] }>(
    'quiz-list',
    { year, ...(stockId ? { stock_id: stockId } : {}) },
  );
}

export async function submitQuizAnswers(
  sessionId: string,
  answers: Array<{ quiz_id: string; selected_option: number }>,
  stockId?: string,
): Promise<QuizAnswerResponse> {
  return invokeFunction<QuizAnswerResponse>('quiz-answer', {
    session_id: sessionId,
    answers,
    ...(stockId ? { stock_id: stockId } : {}),
  });
}

export async function unlockHintByAd(
  sessionId: string,
  year: number,
  stockId?: string,
): Promise<void> {
  return invokeFunction('hint-unlock', {
    session_id: sessionId,
    year,
    method: 'ad',
    level: 3,
    ...(stockId ? { stock_id: stockId } : {}),
  });
}

export async function getHints(sessionId: string): Promise<{ hints: HintEntry[] }> {
  return invokeFunction<{ hints: HintEntry[] }>('hints', {
    session_id: sessionId,
  });
}

export async function submitMinigameResult(
  sessionId: string,
  stockId: string,
  year: number,
  gameType: 'price_prediction' | 'card_match',
  score: number,
): Promise<MinigameResultResponse> {
  return invokeFunction<MinigameResultResponse>('minigame-result', {
    session_id: sessionId,
    stock_id: stockId,
    year,
    game_type: gameType,
    score,
  });
}
