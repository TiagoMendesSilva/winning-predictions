
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../api/api';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { MainTabParamList } from '../types/Navigation';

type Props = BottomTabScreenProps<
  MainTabParamList,
  'Palpites'
>;

/**
 * Dados do palpite retornados pelo backend.
 *
 * Os campos de partida são opcionais para manter compatibilidade
 * com a resposta atual, caso ela ainda retorne somente os dados
 * básicos do Prediction.
 */
interface MyPrediction {
  id: number;
  fixtureId: number;
  homeGoals: number;
  awayGoals: number;
  createdAt: string;

  leagueName?: string;
  kickoffDate?: string;

  homeTeam?: string;
  awayTeam?: string;

  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;

  fixtureStatus?: string;

  homeScore?: number | null;
  awayScore?: number | null;
}



export default function UserPredictionScreen({}: Props) {
  const [predictions, setPredictions] = useState<MyPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca somente os palpites do usuário autenticado.
   */
  const loadPredictions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await api.get<MyPrediction[]>('/predictions/user');

      setPredictions(
        Array.isArray(response.data) ? response.data : [],
      );
    } catch (err: any) {
      console.error(
        'Erro ao carregar meus palpites:',
        err.response?.status,
        err.response?.data ?? err.message,
      );

      setError(
        err.response?.status === 401
          ? 'Sua sessão expirou. Faça login novamente.'
          : 'Não foi possível carregar seus palpites.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Atualiza a listagem sempre que o usuário acessar a aba.
   * Assim, um palpite recém-salvo aparece ao retornar para cá.
   */
  useFocusEffect(
    useCallback(() => {
      loadPredictions();
    }, [loadPredictions]),
  );

  function formatDate(date?: string): string {
    if (!date) {
      return 'Data não informada';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Data não informada';
    }

    return parsedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatCreatedAt(date?: string): string {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return `Registrado em ${parsedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  }

  function getStatus(status?: string): {
    label: string;
    color: string;
  } {
    const normalized = status?.trim().toUpperCase();

    const liveStatuses = [
      'LIVE',
      'IN_PLAY',
      '1H',
      '2H',
      'HT',
      'ET',
      'P',
      'LIVE_IN_PROGRESS',
    ];

    const finishedStatuses = [
      'FINISHED',
      'FT',
      'AET',
      'PEN',
      'MATCH_FINISHED',
    ];

    if (normalized && liveStatuses.includes(normalized)) {
      return {
        label: 'AO VIVO',
        color: '#0D472F',
      };
    }

    if (normalized && finishedStatuses.includes(normalized)) {
      return {
        label: 'FINALIZADA',
        color: '#5B2929',
      };
    }

    return {
      label: 'PALPITE REGISTRADO',
      color: '#8A6225',
    };
  }

  function getLogoUri(logo?: string | null): string | null {
    if (!logo) {
      return null;
    }

    return logo.startsWith('data:image/')
      ? logo
      : `data:image/png;base64,${logo}`;
  }

  function renderTeamLogo(
    logo: string | null | undefined,
    teamName: string,
  ) {
    const uri = getLogoUri(logo);

    if (!uri) {
      return (
        <View style={styles.logoPlaceholder}>
          <Feather
            name="shield"
            size={32}
            color="#D4A64A"
          />
        </View>
      );
    }

    return (
      <Image
        source={{ uri }}
        style={styles.teamLogo}
        resizeMode="contain"
        accessibilityLabel={`Escudo do ${teamName}`}
      />
    );
  }

  function renderPredictionCard(item: MyPrediction) {
    const status = getStatus(item.fixtureStatus);

    const hasResult =
      item.homeScore !== null &&
      item.homeScore !== undefined &&
      item.awayScore !== null &&
      item.awayScore !== undefined;

    const homeTeam = item.homeTeam || 'Mandante';
    const awayTeam = item.awayTeam || 'Visitante';

    return (
      <View key={item.id} style={styles.predictionCard}>
        {/* Campeonato e situação */}
        <View style={styles.cardHeader}>
          <View style={styles.leagueContainer}>
            <Feather
              name="award"
              size={15}
              color="#A87531"
            />

            <Text style={styles.leagueName} numberOfLines={1}>
              {item.leagueName || `Partida #${item.fixtureId}`}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status.color },
            ]}
          >
            <Text style={styles.statusText}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Data da partida */}
        <View style={styles.dateContainer}>
          <Feather
            name="calendar"
            size={14}
            color="#76552B"
          />

          <Text style={styles.matchDate}>
            {formatDate(item.kickoffDate)}
          </Text>
        </View>

        {/* Times */}
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            {renderTeamLogo(item.homeTeamLogo, homeTeam)}

            <Text style={styles.teamName} numberOfLines={2}>
              {homeTeam.toUpperCase()}
            </Text>
          </View>

          <View style={styles.versusContainer}>
            <Text style={styles.versus}>X</Text>
          </View>

          <View style={styles.team}>
            {renderTeamLogo(item.awayTeamLogo, awayTeam)}

            <Text style={styles.teamName} numberOfLines={2}>
              {awayTeam.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Palpite do usuário */}
        <View style={styles.scorePanel}>
          <View style={styles.scoreColumn}>
            <Text style={styles.scoreLabel}>
              SEU PALPITE
            </Text>

            <Text style={styles.predictionScore}>
              {item.homeGoals} x {item.awayGoals}
            </Text>
          </View>

          {hasResult && (
            <>
              <View style={styles.scoreDivider} />

              <View style={styles.scoreColumn}>
                <Text style={styles.scoreLabel}>
                  RESULTADO
                </Text>

                <Text style={styles.resultScore}>
                  {item.homeScore} x {item.awayScore}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Data de registro */}
        {!!item.createdAt && (
          <View style={styles.createdAtContainer}>
            <Feather
              name="check-circle"
              size={13}
              color="#76552B"
            />

            <Text style={styles.createdAt}>
              {formatCreatedAt(item.createdAt)}
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Feather
            name="target"
            size={48}
            color="#D4A64A"
          />
        </View>

        <Text style={styles.emptyTitle}>
          NENHUM PALPITE REGISTRADO
        </Text>

        <Text style={styles.emptyDescription}>
          Você ainda não registrou palpites.
          Acesse os campeonatos e escolha uma partida
          para começar.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadPredictions()}
          activeOpacity={0.85}
        >
          <Feather
            name="refresh-cw"
            size={16}
            color="#F3E3C1"
          />

          <Text style={styles.retryButtonText}>
            ATUALIZAR
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderErrorState() {
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name="alert-circle"
          size={48}
          color="#D4A64A"
        />

        <Text style={styles.emptyTitle}>
          NÃO FOI POSSÍVEL CARREGAR
        </Text>

        <Text style={styles.emptyDescription}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadPredictions()}
          activeOpacity={0.85}
        >
          <Feather
            name="refresh-cw"
            size={16}
            color="#F3E3C1"
          />

          <Text style={styles.retryButtonText}>
            TENTAR NOVAMENTE
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#3A0D0D"
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Feather
              name="target"
              size={25}
              color="#D4A64A"
            />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              MEUS PALPITES
            </Text>

            <Text style={styles.headerSubtitle}>
              Acompanhe seus palpites registrados
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => loadPredictions(true)}
            accessibilityLabel="Atualizar palpites"
          >
            <Feather
              name="refresh-cw"
              size={21}
              color="#D4A64A"
            />
          </TouchableOpacity>
        </View>

        {/* Resumo */}
        {!loading && !error && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryIcon}>
              <Feather
                name="award"
                size={22}
                color="#3A0D0D"
              />
            </View>

            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryNumber}>
                {predictions.length}
              </Text>

              <Text style={styles.summaryLabel}>
                {predictions.length === 1
                  ? 'PALPITE REGISTRADO'
                  : 'PALPITES REGISTRADOS'}
              </Text>
            </View>
          </View>
        )}

        {/* Conteúdo */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#D4A64A"
            />

            <Text style={styles.loadingText}>
              CARREGANDO SEUS PALPITES...
            </Text>
          </View>
        ) : error ? (
          renderErrorState()
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadPredictions(true)}
                tintColor="#D4A64A"
                colors={['#D4A64A']}
                progressBackgroundColor="#3A0D0D"
              />
            }
          >
            {predictions.length === 0
              ? renderEmptyState()
              : predictions.map(renderPredictionCard)}
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A0D0D',
  },

  safeArea: {
    flex: 1,
  },

  header: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 166, 74, 0.25)',
  },

  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A87531',
    borderRadius: 21,
    marginRight: 12,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    color: '#D4A64A',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 17,
  },

  headerSubtitle: {
    color: '#F3E3C1',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10,
    marginTop: 3,
  },

  refreshButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 15,
    marginBottom: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: '#C48D2A',
    borderRadius: 10,
    backgroundColor: '#F3E3C1',
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4A64A',
  },

  summaryTextContainer: {
    marginLeft: 12,
  },

  summaryNumber: {
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 21,
  },

  summaryLabel: {
    color: '#76552B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10,
  },

  scrollView: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 3,
    paddingBottom: 25,
    flexGrow: 1,
  },

  predictionCard: {
    marginBottom: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: '#C48D2A',
    borderRadius: 12,
    backgroundColor: '#F3E3C1',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leagueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },

  leagueName: {
    flex: 1,
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    marginLeft: 6,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 5,
  },

  statusText: {
    color: '#F3E3C1',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 8,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  matchDate: {
    color: '#76552B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10,
    marginLeft: 6,
  },

  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 18,
  },

  team: {
    flex: 1,
    alignItems: 'center',
  },

  teamLogo: {
    width: 55,
    height: 55,
  },

  logoPlaceholder: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  teamName: {
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 7,
  },

  versusContainer: {
    paddingHorizontal: 12,
  },

  versus: {
    color: '#A87531',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 17,
  },

  scorePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EAD8B5',
  },

  scoreColumn: {
    flex: 1,
    alignItems: 'center',
  },

  scoreLabel: {
    color: '#76552B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 9,
  },

  predictionScore: {
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 25,
    marginTop: 3,
  },

  resultScore: {
    color: '#0D472F',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 25,
    marginTop: 3,
  },

  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#C48D2A',
  },

  createdAtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  createdAt: {
    color: '#76552B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 9,
    marginLeft: 5,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#D4A64A',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    marginTop: 15,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 45,
  },

  emptyIcon: {
    marginBottom: 15,
  },

  emptyTitle: {
    color: '#D4A64A',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },

  emptyDescription: {
    color: '#F3E3C1',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 12,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 20,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#C48D2A',
    borderRadius: 7,
    backgroundColor: '#073D20',
  },

  retryButtonText: {
    color: '#F3E3C1',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    marginLeft: 8,
  },
});
