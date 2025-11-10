import { useQuery } from '@tanstack/react-query';

import { fetchApiData } from '../../utils/fetchApiData';
import { QUERY_KEY } from '../queryKey';

interface MemeQuizQuestion {
  message: string;
  isRight: boolean;
}

interface MemeQuizSuccessItem {
  question: string;
  image: string;
  questions: MemeQuizQuestion[];
}

interface MemeQuizErrorResponse {
  code: string;
  message: string;
  data: string;
}

interface MemeQuizResponse {
  resultType: string;
  success: MemeQuizSuccessItem[];
  error: MemeQuizErrorResponse;
}

const useMemeQuizQuery = () => {
  return useQuery({
    queryKey: QUERY_KEY.MEME_QUIZ(),
    queryFn: () =>
      fetchApiData<MemeQuizResponse, void>({
        method: 'GET',
        url: 'https://api.meme-wiki.net/api/quizzes',
      }),
  });
};

export default useMemeQuizQuery;
