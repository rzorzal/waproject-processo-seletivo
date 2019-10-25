import { AxiosRequestConfig, AxiosResponse } from 'axios';

import ServiceError from './serviceError';

interface IApiErrorMeta {
  request: {
    baseURL: string;
    url: string;
    method: string;
    params: any;
    data: any;
    headers: any;
  };
  response?: {
    status: number;
    data?: any;
  };
  err: any;
}

export default class ApiError extends ServiceError<IApiErrorMeta> {
  public readonly status: number;
  public readonly data: any;

  constructor(request: AxiosRequestConfig, axiosResponse: AxiosResponse, err: any) {
    const response = !axiosResponse
      ? { status: -1, data: '' }
      : { status: axiosResponse.status, data: axiosResponse.data };

    delete err.request;
    delete err.response;
    delete err.config;

    const message = response.data && response.data.message;
    super(
      message || 'api-error',
      {
        request: {
          baseURL: request.baseURL,
          url: request.url,
          method: request.method,
          params: request.params,
          data: request.data,
          headers: request.headers
        },
        response,
        err
      },
      response.status < 500
    );

    this.status = response.status;
    this.data = response.data;
  }
}
