import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuth } from '../context/AuthContext';

// Configure uma vez fora do componente
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,  
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export default function LoginScreen() {
    const { signIn } =  useAuth();

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

      await signIn(idToken);      

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login cancelado');
      } else {
        console.error('Erro no login:', error);
        Alert.alert('Erro', 'Erro ao fazer login com Google');
      }
    }
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Winning Predictions</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, marginBottom: 20 },
  button: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});