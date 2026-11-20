import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFonts } from '@expo-google-fonts/cinzel';
import {
  Cinzel_700Bold,
  Cinzel_600SemiBold,
} from '@expo-google-fonts/cinzel';

import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';

import { AntDesign, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuth } from '../context/AuthContext';


// Configure uma vez fora do componente
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,  
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export default function LoginScreen() {

  const [fontsLoaded] = useFonts({
    Cinzel_700Bold,
    Cinzel_600SemiBold,
    Montserrat_500Medium,
  });

  const { signIn } =  useAuth();

  const insets = useSafeAreaInsets();

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />;
  }  

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
/*
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Winning Predictions</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>
    </View>
  );
*/
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 16 }]}>

        <Text style={styles.title}>
          TRANSFORME A{'\n'}
          RESENHA EM PONTOS.
        </Text>

        <Text style={styles.subtitle}>
          Participe dos campeonatos,{'\n'}
          faça seus palpites e dispute{'\n'}
          o topo do ranking!
        </Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <AntDesign
            name="google"
            size={24}
            color="#FFF"
          />

          <Text style={styles.googleButtonText}>
            ENTRAR COM GOOGLE
          </Text>
        </TouchableOpacity>
        <View style={styles.divider}>
          <View style={styles.line} />

          <Text style={styles.dividerText}>
            ✦
          </Text>

          <View style={styles.line} />
        </View>

        <View style={styles.termsContainer}>
          <Feather
            name="shield"
            size={18}
            color="#D4A64A"
          />


          <Text style={styles.terms}>
            Ao continuar, você concorda com os Termos de Uso e Política de {'\n'}Privacidade.
          </Text>       

        </View>

      </View>

        </SafeAreaView>
  </ImageBackground>
  );
}
/*
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, marginBottom: 20 },
  button: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,   
  },

  logoContainer: {
    flex: 1.8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: '110%',
    height: undefined,
    aspectRatio: 1
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',

    paddingBottom: 24,
  },

  title: {
    color: '#F3D38A',
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 1,
    fontFamily: 'Cinzel_700Bold',

    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 4,
  },

  subtitle: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    fontFamily: 'Montserrat_500Medium',
  },
  googleButton: {
    width: '100%',

    backgroundColor: '#0E5A34',

    borderWidth: 2,
    borderColor: '#D4A64A',

    borderRadius: 8,

    paddingVertical: 16,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    gap: 12,

    marginBottom: 20,

    shadowColor: '#D4A64A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,

    elevation: 6,
  },

  googleButtonText: {
    color: '#FFF',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: 'Cinzel_600SemiBold',
  },  

  safeArea: {
    flex: 1,
    margin: 0,
    
    borderRadius: 20,
    overflow: 'hidden',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginBottom: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4A64A',
  },

  dividerText: {
    color: '#D4A64A',
    marginHorizontal: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },

  terms: {
    color: '#D7C9A3',
    fontSize: 10,
    lineHeight: 15,
    flex: 1
  },
});