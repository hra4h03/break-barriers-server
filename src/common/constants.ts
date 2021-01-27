import { config } from 'dotenv';
config();
export const isProd = process.env.NODE_ENV === 'production';

export enum TTL {
  FIFTEEN = 1000 * 60 * 15,
}

export const STRING_LENGTH = 64;
