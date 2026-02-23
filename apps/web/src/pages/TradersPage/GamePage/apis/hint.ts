import { supabase } from '@/lib/supabase';

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
  const { data, error } = await supabase.functions.invoke('quiz-list', {
    body: { year },
  });
  if (error) throw error;
  return data;
}

export async function submitQuizAnswers(
  sessionId: string,
  answers: Array<{ quiz_id: string; selected_option: number }>,
): Promise<QuizAnswerResponse> {
  const { data, error } = await supabase.functions.invoke('quiz-answer', {
    body: { session_id: sessionId, answers },
  });
  if (error) throw error;
  return data;
}

export async function unlockHintByAd(sessionId: string, year: number) {
  const { data, error } = await supabase.functions.invoke('hint-unlock', {
    body: { session_id: sessionId, year, method: 'ad' },
  });
  if (error) throw error;
  return data;
}

export async function getHints(sessionId: string): Promise<{ hints: HintEntry[] }> {
  const { data, error } = await supabase.functions.invoke('hints', {
    body: { session_id: sessionId },
  });
  if (error) throw error;
  return data;
}
