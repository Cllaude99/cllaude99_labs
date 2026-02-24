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

export interface QuizAnswerResponse {
  results: QuizAnswerResult[];
  correct_count: number;
  reward: {
    hint_level: 0 | 1 | 2;
    hint: {
      hint_id: string;
      year: number;
      level: number;
      content: string;
    } | null;
  };
}

export interface HintEntry {
  year: number;
  level: number;
  content: string;
  unlock_method: 'quiz' | 'ad';
  unlocked_at: string;
}

export async function getQuizList(year: number): Promise<{ year: number; quizzes: QuizQuestion[] }> {
  return invokeFunction<{ year: number; quizzes: QuizQuestion[] }>(
    'quiz-list',
    { year },
  );
}

export async function submitQuizAnswers(
  sessionId: string,
  answers: Array<{ quiz_id: string; selected_option: number }>,
): Promise<QuizAnswerResponse> {
  return invokeFunction<QuizAnswerResponse>('quiz-answer', {
    session_id: sessionId,
    answers,
  });
}

export async function unlockHintByAd(sessionId: string, year: number) {
  return invokeFunction('hint-unlock', {
    session_id: sessionId,
    year,
    method: 'ad',
  });
}

export async function getHints(sessionId: string): Promise<{ hints: HintEntry[] }> {
  return invokeFunction<{ hints: HintEntry[] }>('hints', {
    session_id: sessionId,
  });
}
