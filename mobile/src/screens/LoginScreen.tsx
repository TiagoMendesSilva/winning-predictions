import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';

// Configure uma vez fora do componente
GoogleSignin.configure({
  webClientId: '1094462266648-c3kjjpvviq5eastahvhpjkvogq4d6fc6.apps.googleusercontent.com',
  offlineAccess: true,
});

export default function LoginScreen() {

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log('userInfo:', userInfo);

      // Pega o idToken para enviar ao backend
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        Alert.alert('Erro', 'Não foi possível obter o token do Google.');
        return;
      }

      // Envia para o backend
      await loginWithBackend(idToken);

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login cancelado pelo usuário');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Login já em progresso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Erro', 'Google Play Services não disponível');
      } else {
        console.error('Erro no login:', error);
        Alert.alert('Erro', 'Erro ao fazer login com Google');
      }
    }
  };

  const loginWithBackend = async (idToken: string) => {
    try {
      const response = await fetch('http://localhost:8080/auth/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro no servidor');
      }

      console.log('Login no backend ok:', data);

      // Salvar token JWT retornado pelo backend
      // Ex: await AsyncStorage.setItem('token', data.token);

      // Navegar para tela principal
      // navigation.navigate('Home');

    } catch (error) {
      console.error('Erro ao autenticar no backend:', error);
      Alert.alert('Erro', 'Erro ao autenticar no servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Winning Predictions</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, marginBottom: 20 },
  button: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8 },
  buttonText: { fontSize: 16, fontWeight: 'bold' }
});