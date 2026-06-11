import axios from 'axios';
import { getToken } from '../storage/token.storage';

export const api = axios.create({
  baseURL: 'http://192.168.15.2:8080'
});

// Interceptor: adiciona o token em toda requisição automaticamente
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});