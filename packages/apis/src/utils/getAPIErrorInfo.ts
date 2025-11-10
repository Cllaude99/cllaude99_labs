import { AxiosError } from 'axios';

/* 백엔드 에러 응답 타입 */
interface APIErrorResponse {
  status: number;
  error: string;
  code: string;
  reason: string[];
}

interface ErrorCodeType {
  [ErrorCode: string]: { status: string; message: string };
}

const ERROR_CODE: ErrorCodeType = {
  /* 백엔드 정의 에러 */
  'A-004': {
    status: '402',
    message: 'Access Token을 재발급해야합니다.',
  },

  /* axios 에러 */
  ERR_NETWORK: {
    status: '네트워크 에러',
    message:
      '서버가 응답하지 않습니다. \n프로그램을 재시작하거나 고객센터에 문의해주세요.',
  },
  ECONNABORTED: {
    status: '요청 시간 초과',
    message: '요청 시간을 초과했습니다.',
  },

  /* 알 수 없는 에러 */
  UNKNOWN: { status: 'ERROR', message: '알 수 없는 오류가 발생했습니다.' },
} as const;

export const getAPIErrorInfo = (
  error: AxiosError<APIErrorResponse>,
): (typeof ERROR_CODE)[keyof typeof ERROR_CODE] => {
  const serverErrorCode = error.response?.data?.code ?? '';
  const axiosErrorCode = error.code ?? '';

  if (serverErrorCode in ERROR_CODE) {
    return ERROR_CODE[serverErrorCode as keyof typeof ERROR_CODE];
  } else if (axiosErrorCode in ERROR_CODE) {
    return ERROR_CODE[axiosErrorCode as keyof typeof ERROR_CODE];
  } else return ERROR_CODE.UNKNOWN;
};
