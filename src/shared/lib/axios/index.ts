import axios, { AxiosError } from 'axios';

import { env } from '@env';

export type ApiError = AxiosError & {
  config: { _retry?: boolean };
};

export const client = axios.create({
  baseURL: env.VITE_SERVER_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});
