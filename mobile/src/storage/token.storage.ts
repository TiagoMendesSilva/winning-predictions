import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'jwt';
const USER_KEY = 'user';

export interface UserStorage {
  id: number;
  name: string;
  email: string;
  pictureUrl: string;
}

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  return AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveUser(user: UserStorage) {
  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

export async function getUser(): Promise<UserStorage | null> {
  const user = await AsyncStorage.getItem(USER_KEY);

  return user ? (JSON.parse(user) as UserStorage) : null;
}