import { useFonts } from 'expo-font';

import {
  Cinzel_400Regular,
  Cinzel_600SemiBold,
  Cinzel_700Bold
} from '@expo-google-fonts/cinzel';
/*
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import LoginScreen from './src/screens/LoginScreen'
*/

import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {

   const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    Cinzel_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
     <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
    </SafeAreaProvider>
  );
}
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
