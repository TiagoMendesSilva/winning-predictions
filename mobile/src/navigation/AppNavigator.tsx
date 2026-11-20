
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UserPredictionScreen from '../screens/UserPredictionScreen';
import ChampionshipFixturesScreen from '../screens/ChampionshipFixturesScreen';
import MakePredictionScreen from '../screens/MakePredictionScreen';

import {
  RootStackParamList,
  MainTabParamList,
  ChampionshipsStackParamList,
} from '../types/Navigation';
import RankingScreen from '../screens/RankingScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Navegação principal
const Stack = createNativeStackNavigator<RootStackParamList>();

// Navegação das abas
const Tab = createBottomTabNavigator<MainTabParamList>();

// Navegação interna da aba Campeonatos
const ChampionshipsStack =
  createNativeStackNavigator<ChampionshipsStackParamList>();

function ChampionshipsNavigator() {
  return (
    <ChampionshipsStack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <ChampionshipsStack.Screen
        name="Home"
        component={HomeScreen}
      />

      <ChampionshipsStack.Screen
        name="ChampionshipFixtures"
        component={ChampionshipFixturesScreen}
      />

      <ChampionshipsStack.Screen
        name="MakePrediction"
        component={MakePredictionScreen}
      />
    </ChampionshipsStack.Navigator>
  );
}

// Navegação das abas inferiores
function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Campeonatos"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#D4A64A',
        tabBarInactiveTintColor: '#B9A078',

        // Distribui igualmente o espaço entre as quatro abas
        tabBarStyle: {
          height: 75 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
          backgroundColor: '#3A0D0D',
          borderTopColor: '#8A5C22',
          borderTopWidth: 1,
        },

        // Exibe os nomes completos
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Montserrat_500Medium',
          includeFontPadding: false,
        },

        tabBarAllowFontScaling: false,
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,

        // Impede que os nomes sejam abreviados
        tabBarLabel: route.name,

        tabBarIcon: ({ color, size }) => {
          const icons: Record<
            keyof MainTabParamList,
            keyof typeof Feather.glyphMap
          > = {
            Campeonatos: 'award',
            Palpites: 'edit-3',
            Ranking: 'bar-chart-2',
            Perfil: 'user',
          };

          return (
            <Feather
              name={icons[route.name]}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Campeonatos"
        component={ChampionshipsNavigator}
        options={{ tabBarLabel: 'Campeonatos' }}
      />

      <Tab.Screen
        name="Palpites"
        component={UserPredictionScreen}
        options={{ tabBarLabel: 'Palpites' }}
      />

      <Tab.Screen
        name="Ranking"
        component={RankingScreen}
        options={{ tabBarLabel: 'Ranking' }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Navegação para usuários não autenticados
function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
}

// Navegação principal da aplicação
/*
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#D4A64A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/

// Tela de carregamento da sessão
function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3A0D0D',
      }}
    >
      <ActivityIndicator
        size="large"
        color="#D4A64A"
      />
    </View>
  );
}

/*
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainTabNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
}
*/

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainTabNavigator />
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
}