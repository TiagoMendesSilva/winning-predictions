import { api } from '../api/api';

export async function authenticateGoogle(
  googleToken: string
) {
  const response = await api.post('/auth/google', {
    token: googleToken
  });

  return response.data;
}