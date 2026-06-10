import { api } from './api';

export async function testConnection() {
  const response = await api.get('/auth/me');
  return response.data;
}