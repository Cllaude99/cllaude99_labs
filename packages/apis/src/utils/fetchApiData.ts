import { AxiosRequestConfig } from 'axios';

import { instance } from './instance';

export const fetchApiData = async <ResponseData, RequestData>(
  option: AxiosRequestConfig<RequestData>,
) => {
  const { data } = await instance<ResponseData>(option);
  return data;
};
