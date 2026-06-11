import { api } from './api';
import { AuthResponse } from '../types/AuthResponse';
import { UserStorage } from '../storage/token.storage';
 
export async function loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/google', { token: googleToken});
    return response.data;
}

export async function fetchMe(): Promise<UserStorage> {
  const response = await api.get('/auth/me');
  return response.data;
}

