
import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../api/api';
import { Prediction } from '../api/soccer.api';

import { useAuth } from '../context/AuthContext';

// ==========================================
// INTERFACE DO USUÁRIO
// ==========================================

interface UserProfile {
  id: number;
  name: string;
  email: string;
  pictureUrl: string | null;
  createdAt: string | null;
}

interface Ranking {
  position: number;
  userId: number;
  name: string;
  points: number;
  totalPredictions: number;
  correctPredictions: number;
  exactPredictions: number;
  accuracy: number;
  currentUser: boolean;
}

// ==========================================
// COMPONENTE DE MENU
// ==========================================

interface ProfileMenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress: () => void;
}

const ProfileMenuItem = ({
  icon,
  title,
  onPress,
}: ProfileMenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <Feather name={icon} size={17} color="#3A0D0D" />

    <Text style={styles.menuText}>{title}</Text>

    <Feather
      name="chevron-right"
      size={19}
      color="#A66A20"
    />
  </TouchableOpacity>
);

// ==========================================
// FORMATAÇÃO DA DATA DE CADASTRO
// ==========================================

const formatMemberSince = (
  date: string | null
): string => {

  if (!date) {
    return '--/----';
  }

  const months = [
    'Jan', 'Fev', 'Mar', 'Abr',
    'Mai', 'Jun', 'Jul', 'Ago',
    'Set', 'Out', 'Nov', 'Dez',
  ];

  const month = Number(date.substring(5, 7));
  const year = date.substring(0, 4);

  if (month < 1 || month > 12) {
    return '--/----';
  }

  return `${months[month - 1]}/${year}`;
};

// ==========================================
// PROFILE SCREEN
// ==========================================

export default function ProfileScreen() {

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const [ranking, setRanking] = useState<Ranking | null>(null);

  const { user, signOut } = useAuth();

  // ========================================
  // CHAMADA DA API
  // ========================================

  const loadProfile = useCallback(async () => {

    try {

      setError(false);

      const [
      userResponse,
      predictionsResponse,
      rankingResponse,
    ] = await Promise.all([

      api.get<UserProfile>('/auth/me'),

      api.get<Prediction[]>('/predictions/user'),

      api.get<Ranking[]>('/ranking', {
        params: {
          leagueId: 71,
          season: 2024,
        },
      }),

    ]);

    setProfile(userResponse.data);

    setPredictions(predictionsResponse.data ?? []);

    const currentUser = rankingResponse.data.find(
      item => item.currentUser
    );

    setRanking(currentUser ?? null);

    } catch (err) {

      console.error(
        'Erro ao carregar perfil:',
        err
      );

      setError(true);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  }, []);

  // ========================================
  // CARREGAR AO ABRIR A ABA PERFIL
  // ========================================

  useFocusEffect(
    useCallback(() => {

      setLoading(true);

      loadProfile();

    }, [loadProfile])
  );

  // ========================================
  // ATUALIZAR MANUALMENTE
  // ========================================

  const onRefresh = () => {

    setRefreshing(true);

    loadProfile();

  };

  // ========================================
  // MENU
  // ========================================

  const showComingSoon = (feature: string) => {

    Alert.alert(
      feature,
      'Esta funcionalidade será implementada nas próximas etapas.'
    );

  };
  /*
  const handleLogout = () => {

    Alert.alert(
      'Sair',
      'A integração com o encerramento da sessão será adicionada na etapa de autenticação.',
      [{ text: 'OK' }]
    );

  };
  */
 const handleLogout = () => {

  Alert.alert(
    'Sair da conta',
    'Deseja realmente encerrar sua sessão?',
        [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {

                try {

                    await signOut();

                } catch (error) {

                    console.error(
                    'Erro ao encerrar sessão:',
                    error
                    );

                    Alert.alert(
                    'Erro',
                    'Não foi possível encerrar a sessão.'
                    );

                }

                },
            },
        ],
        { cancelable: true }
        );

    };

  // ========================================
  // TELA DE CARREGAMENTO
  // ========================================

  if (loading) {

    return (
      <ImageBackground
        source={require('../../assets/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>

          <View style={styles.loadingContainer}>

            <ActivityIndicator
              size="large"
              color="#D4A64A"
            />

            <Text style={styles.loadingText}>
              Carregando perfil...
            </Text>

          </View>

        </SafeAreaView>
      </ImageBackground>
    );

  }

  // ========================================
  // TELA DE ERRO
  // ========================================

  if (error && !profile) {

    return (
      <ImageBackground
        source={require('../../assets/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>

          <View style={styles.loadingContainer}>

            <Feather
              name="alert-circle"
              size={35}
              color="#D4A64A"
            />

            <Text style={styles.loadingText}>
              Não foi possível carregar seu perfil.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadProfile}
            >
              <Text style={styles.retryText}>
                Tentar novamente
              </Text>
            </TouchableOpacity>

          </View>

        </SafeAreaView>
      </ImageBackground>
    );

  }

  // ========================================
  // LAYOUT PRINCIPAL
  // ========================================

  return (

    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >

      <SafeAreaView style={styles.safeArea} edges={['top']}>

        <View style={styles.header}>

          <Text style={styles.headerTitle}>
            PERFIL
          </Text>

          <TouchableOpacity
            onPress={() => showComingSoon('Configurações')}
            style={styles.settingsButton}
          >
            <Feather
              name="settings"
              size={21}
              color="#D4A64A"
            />
          </TouchableOpacity>

        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D4A64A"
            />
          }
        >

          <View style={styles.profileCard}>

            {/* DADOS DO USUÁRIO */}

            <View style={styles.userSection}>

              <View style={styles.avatarContainer}>

                {user?.pictureUrl ? (

                  <Image
                    source={{
                      uri: user.pictureUrl,
                    }}
                    style={styles.avatar}
                  />

                ) : (

                  <View style={styles.avatarPlaceholder}>

                    <Feather
                      name="user"
                      size={43}
                      color="#D4A64A"
                    />

                  </View>

                )}

              </View>

              <View style={styles.userInfo}>

                <Text style={styles.userName}>
                  {user?.name ?? 'Usuário'}
                </Text>

                <Text style={styles.userEmail}>
                  {user?.email ?? ''}
                </Text>

                <Text style={styles.memberLabel}>
                  Membro desde
                </Text>

                <Text style={styles.memberDate}>
                  {formatMemberSince(
                    profile?.createdAt ?? null
                  )}
                </Text>

              </View>

            </View>

            {/* ESTATÍSTICAS */}

            <View style={styles.statisticsSection}>

              <Text style={styles.sectionTitle}>
                ESTATÍSTICAS
              </Text>

              <View style={styles.statisticsRow}>

                <View style={styles.statistic}>

                  <Text style={styles.statisticValue}>
                    {predictions.length}
                  </Text>

                  <Text style={styles.statisticLabel}>
                    PALPITES
                  </Text>

                </View>

                <View style={styles.statisticDivider} />

                <View style={styles.statistic}>

                  <Text style={styles.statisticValue}>
                   {Number(ranking?.accuracy ?? 0).toFixed(0)}%
                  </Text>

                  <Text style={styles.statisticLabel}>
                    APROVEITAMENTO
                  </Text>

                </View>

                <View style={styles.statisticDivider} />

                <View style={styles.statistic}>

                  <Text style={styles.statisticValue}>
                    {ranking?.exactPredictions ?? 0}
                  </Text>

                  <Text style={styles.statisticLabel}>
                    ACERTOS EXATOS
                  </Text>

                </View>

              </View>

            </View>

            {/* OPÇÕES DO PERFIL */}

            <View style={styles.menuSection}>

              <ProfileMenuItem
                icon="users"
                title="Meus Amigos"
                onPress={() => showComingSoon('Meus Amigos')}
              />

              <ProfileMenuItem
                icon="settings"
                title="Configurações"
                onPress={() => showComingSoon('Configurações')}
              />

              <ProfileMenuItem
                icon="help-circle"
                title="Ajuda e Suporte"
                onPress={() => showComingSoon('Ajuda e Suporte')}
              />

              <ProfileMenuItem
                icon="book-open"
                title="Termos de Uso"
                onPress={() => showComingSoon('Termos de Uso')}
              />

              <TouchableOpacity
                style={styles.logoutButton}
                activeOpacity={0.7}
                onPress={handleLogout}
              >

                <Feather
                  name="log-out"
                  size={17}
                  color="#C62828"
                />

                <Text style={styles.logoutText}>
                  Sair
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>

      </SafeAreaView>

    </ImageBackground>

  );

}

// ==========================================
// ESTILOS ORIGINAIS
// ==========================================

const styles = StyleSheet.create({

  background: {
    flex: 1,
    backgroundColor: '#250807',
  },

  safeArea: {
    flex: 1,
  },

  header: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  headerTitle: {
    color: '#D4A64A',
    fontFamily: 'Cinzel-Bold',
    fontSize: 19,
    letterSpacing: 1,
  },

  settingsButton: {
    position: 'absolute',
    right: 17,
    padding: 5,
  },

  scrollContent: {
    paddingHorizontal: 9,
    paddingTop: 2,
    paddingBottom: 18,
  },

  profileCard: {
    backgroundColor: '#F3E3C1',
    borderWidth: 1.5,
    borderColor: '#D4A64A',
    borderRadius: 9,
    overflow: 'hidden',
  },

  userSection: {
    minHeight: 94,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D5B982',
  },

  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#B78335',
    padding: 3,
    marginRight: 12,
    overflow: 'hidden',
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },

  avatarPlaceholder: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: '#3A0D0D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: '#1D160E',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },

  userEmail: {
    color: '#241C14',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginBottom: 7,
  },

  memberLabel: {
    color: '#241C14',
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
  },

  memberDate: {
    color: '#241C14',
    fontFamily: 'Montserrat-Medium',
    fontSize: 10,
    marginTop: 2,
  },

  statisticsSection: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#D5B982',
  },

  sectionTitle: {
    color: '#3A2A16',
    fontFamily: 'Cinzel-Bold',
    fontSize: 12,
    marginBottom: 8,
  },

  statisticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  statistic: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statisticValue: {
    color: '#21180F',
    fontFamily: 'Cinzel-Bold',
    fontSize: 22,
  },

  statisticLabel: {
    color: '#352719',
    fontFamily: 'Montserrat-Medium',
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
  },

  statisticDivider: {
    height: 40,
    width: 1,
    backgroundColor: '#C99A50',
  },

  menuSection: {
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 5,
  },

  menuItem: {
    minHeight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    borderBottomColor: '#D9C49B',
  },

  menuText: {
    flex: 1,
    color: '#21180F',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginLeft: 12,
  },

  logoutButton: {
    height: 37,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutText: {
    color: '#C62828',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 12,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#D4A64A',
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    marginTop: 14,
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D4A64A',
    borderRadius: 8,
  },

  retryText: {
    color: '#D4A64A',
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },

});
