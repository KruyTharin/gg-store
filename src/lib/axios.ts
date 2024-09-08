import axios from 'axios';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_BASE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
