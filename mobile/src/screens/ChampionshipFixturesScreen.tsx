
import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SectionList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


import { api } from '../api/api';
import { ChampionshipsStackParamList } from '../types/Navigation';

// Ajuste os nomes das rotas ao seu AppNavigator.
/*
type RootStackParamList = {
  Home: undefined;
  ChampionshipFixtures: {
    leagueId: number;
    leagueName: string;
    season: number;
  };

  MakePrediction: {
    fixtureId: number;
    leagueName: string;
    kickoffDate: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamLogo: string | null;
    awayTeamLogo: string | null;
  };
};
*/
type Props = NativeStackScreenProps<
  ChampionshipsStackParamList,
  'ChampionshipFixtures'
>;

type Fixture = {
  id: number;
  date: string;
  status: string;

  homeTeam: string;
  homeTeamId?: number;
  homeTeamLogo?: string | null;

  awayTeam: string;
  awayTeamId?: number;
  awayTeamLogo?: string | null;

  homeScore?: number | null;
  awayScore?: number | null;

  // Estado do palpite do usuário, não da partida.
  predictionStatus?: string | null;
};

type FixtureSection = {
  title: string;
  data: Fixture[];
};

type TabKey = 'UPCOMING' | 'LIVE' | 'FINISHED';

const TABS: { label: string; value: TabKey }[] = [
  { label: 'PRÓXIMOS', value: 'UPCOMING' },
  { label: 'AO VIVO', value: 'LIVE' },
  { label: 'FINALIZADOS', value: 'FINISHED' },
];

const normalizeStatus = (status?: string | null): string =>
  (status ?? '').trim().toUpperCase();

export default function ChampionshipFixturesScreen({
  navigation,
  route,
}: Props) {
  const { leagueId, leagueName, season } = route.params;

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('UPCOMING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
  const loadFixtures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Endpoint de consulta. Não execute /fixtures/sync
      // toda vez que o usuário abrir esta tela.
      const response = await api.get<Fixture[]>('/fixtures', {
        params: {
          leagueId,
          season,
        },
      });
      
      console.log(
        'RESPOSTA DA API:',
        JSON.stringify(response.data),
      );

      setFixtures(response.data);
    } catch (e) {
      console.error('Erro ao carregar partidas:', e);
      setError('Não foi possível carregar as partidas.');
    } finally {
      setLoading(false);
    }
  }, [leagueId, season]);
  */

  // 2. Função que busca as partidas no backend
const loadFixtures = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await api.get<Fixture[]>('/fixtures', {
      params: {
        leagueId,
        season,
      },
    });

    console.log(
      'RESPOSTA DA API:',
      JSON.stringify(response.data),
    );

    setFixtures(response.data);
  } catch (error) {
    console.error('Erro ao carregar partidas:', error);
    setError('Não foi possível carregar as partidas.');
  } finally {
    setLoading(false);
  }
}, [leagueId, season]);

// Atualiza a lista ao abrir ou retornar à tela.
useFocusEffect(
  useCallback(() => {
    loadFixtures();
  }, [loadFixtures])
);

const LIVE_STATUSES = [
  'LIVE',
  'IN_PLAY',
  '1H',
  '2H',
  'HT',
  'ET',
  'P',
  'LIVE_IN_PROGRESS',
];

  // 3. ADICIONE AQUI: depois de loadFixtures
  /*
  useFocusEffect(
    useCallback(() => {
      loadFixtures();
    }, [loadFixtures])
  );
  */
/*
  useEffect(() => {
    loadFixtures();
  }, [loadFixtures]);
*/
  
 const FINISHED_STATUSES = [
    'FINISHED',
    'FT',
    'AET',
    'PEN',
    'MATCH_FINISHED',
];

const filteredFixtures = useMemo(() => {
  const now = Date.now();

  return fixtures
    .filter((fixture) => {
      const status = normalizeStatus(fixture.status);

      const live = LIVE_STATUSES.includes(status);
      const finished = FINISHED_STATUSES.includes(status);
      const matchDate = new Date(fixture.date).getTime();

      if (activeTab === 'LIVE') {
        return live;
      }

      if (activeTab === 'FINISHED') {
        return finished;
      }

      return !live && !finished && matchDate >= now;
    })
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    );
}, [fixtures, activeTab]);


  const sections = useMemo<FixtureSection[]>(() => {
    const groups = new Map<string, Fixture[]>();

    filteredFixtures.forEach((fixture) => {
      const key = new Date(fixture.date).toLocaleDateString(
        'pt-BR',
        {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
        },
      );

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)!.push(fixture);
    });

    return Array.from(groups.entries()).map(([title, data]) => ({
      title: title.toUpperCase(),
      data,
    }));
  }, [filteredFixtures]);

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
/*
  const getPredictionLabel = (fixture: Fixture) => {
    const status = normalizeStatus(fixture.predictionStatus);

    if (status === 'MADE' || status === 'PREDICTED') {
      return 'PALPITE FEITO';
    }

    if (status === 'CLOSED' || status === 'EXPIRED') {
      return 'PRAZO ENCERRADO';
    }

    return 'SEM PALPITE';
  };
*/

  const getPredictionLabel = (fixture: Fixture) => {
    const status = normalizeStatus(fixture.predictionStatus);

    if (status === 'MADE' || status === 'PREDICTED') {
      return 'PALPITE FEITO';
    }

    if (status === 'CLOSED' || status === 'EXPIRED') {
      return 'PRAZO ENCERRADO';
    }

    return 'SEM PALPITE';
  };

  const getPredictionStyle = (fixture: Fixture) => {
    const label = getPredictionLabel(fixture);

    if (label === 'PALPITE FEITO') {
      return styles.predictionDone;
    }

    if (label === 'PRAZO ENCERRADO') {
      return styles.predictionClosed;
    }

    return styles.predictionEmpty;
  };

  const isFinished = (status: string) =>
    ['FINISHED', 'FT', 'AET', 'PEN', 'MATCH_FINISHED']
      .includes(status.toUpperCase());

  const isLive = (status: string) =>
    ['LIVE', 'IN_PLAY', '1H', '2H', 'HT', 'ET', 'P',
      'LIVE_IN_PROGRESS'].includes(status.toUpperCase());

  
      const renderTeamLogo = (
fixture: Fixture,
side: 'home' | 'away',
) => {
const teamName =
side === 'home'
? fixture.homeTeam
: fixture.awayTeam;

const logoBase64 =
side === 'home'
? fixture.homeTeamLogo
: fixture.awayTeamLogo;

// Sem imagem Base64, mostra o escudo padrão.
if (!logoBase64) {
return ( <View style={styles.logoPlaceholder}> <Feather
       name="shield"
       size={25}
       color="#8A5C22"
     /> </View>
);
}

// Evita duplicar o prefixo caso a API já o envie.
const logoUri = logoBase64.startsWith('data:image/')
? logoBase64
: `data:image/png;base64,${logoBase64}`;

return (
<Image
source={{ uri: logoUri }}
style={styles.teamLogo}
resizeMode="contain"
onError={(event) => {
console.log(
`Erro ao carregar escudo de ${teamName}:`,
event.nativeEvent.error,
);
}}
onLoad={() => {
console.log(`Escudo carregado: ${teamName}`);
}}
/>
);
};



  const renderFixture = ({ item }: { item: Fixture }) => {
  const finished = isFinished(item.status);
  const live = isLive(item.status);
  // ADICIONE AQUI

  const predictionLabel = getPredictionLabel(item);
  /*
  const predictionLabel =
    item.predictionStatus === 'MADE'
      ? 'PALPITE REGISTRADO'
      : 'SEM PALPITE';
*/

  return (
    <View style={styles.matchCard}>
      <View style={styles.matchInfo}>
        <Text style={styles.matchDate}>
          {activeTab === 'LIVE'
            ? 'AO VIVO'
            : `${formatTime(item.date)}${
                finished ? ' · ENCERRADO' : ''
              }`}
        </Text>

        {live && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        )}
      </View>

      <View style={styles.matchRow}>
        <View style={styles.teamColumn}>
          {renderTeamLogo(item, 'home')}
          <Text style={styles.teamName} numberOfLines={2}>
            {item.homeTeam}
          </Text>
        </View>

        <View style={styles.centerColumn}>
          {finished || live ? (
            <Text style={styles.score}>
              {item.homeScore ?? 0} - {item.awayScore ?? 0}
            </Text>
          ) : (
            <Text style={styles.vs}>X</Text>
          )}
        </View>

        <View style={styles.teamColumn}>
          {renderTeamLogo(item, 'away')}
          <Text style={styles.teamName} numberOfLines={2}>
            {item.awayTeam}
          </Text>
        </View>

        <View style={styles.predictionColumn}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.predictionBadge,
              getPredictionStyle(item),
            ]}
            onPress={() => {
              navigation.navigate('MakePrediction', {
                fixtureId: item.id,
                leagueName,
                kickoffDate: item.date,
                homeTeam: item.homeTeam,
                awayTeam: item.awayTeam,
                homeTeamLogo: item.homeTeamLogo ?? null,
                awayTeamLogo: item.awayTeamLogo ?? null,
              });
            }}
          >
            <Text style={styles.predictionText}>
              {predictionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
        {/* Cabeçalho do campeonato */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Feather name="arrow-left" size={27} color="#D4A64A" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {leagueName.toUpperCase()}
            </Text>

            <Text style={styles.season}>{season}</Text>
          </View>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              // Ponto de integração para abrir filtros.
            }}
          >
            <Feather name="filter" size={24} color="#D4A64A" />
          </TouchableOpacity>
        </View>

        {/* Abas */}
        <View style={styles.tabs}>
          {TABS.map((tab) => {
            const selected = activeTab === tab.value;

            return (
              <TouchableOpacity
                key={tab.value}
                style={[
                  styles.tab,
                  selected && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab.value)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selected && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#D4A64A" />
            <Text style={styles.feedbackText}>
              Carregando partidas...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.feedbackText}>{error}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadFixtures}
            >
              <Text style={styles.retryText}>TENTAR NOVAMENTE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeTab === 'UPCOMING'
                  ? 'PRÓXIMOS JOGOS'
                  : activeTab === 'LIVE'
                    ? 'PARTIDAS EM ANDAMENTO'
                    : 'PARTIDAS FINALIZADAS'}
              </Text>

              <Text style={styles.fixtureCount}>
                {filteredFixtures.length} jogos
              </Text>
            </View>

            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderFixture}
              renderSectionHeader={({ section }) => (
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>
                    {section.title}
                  </Text>
                </View>
              )}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Feather
                    name="calendar"
                    size={36}
                    color="#D4A64A"
                  />
                  <Text style={styles.emptyText}>
                    Nenhuma partida nesta categoria.
                  </Text>
                </View>
              }
              initialNumToRender={8}
              maxToRenderPerBatch={10}
              windowSize={7}
            />
          </>
        )}

        {/* Menu inferior */}
        {/*
        <View style={styles.bottomMenu}>
          <MenuItem icon="award" label="Campeonatos" />
          <MenuItem icon="edit-3" label="Palpites" />
          <MenuItem icon="bar-chart-2" label="Ranking" />
          <MenuItem icon="user" label="Perfil" />
        </View>
        */}
      </SafeAreaView>
    </ImageBackground>
  );
}
/*
function MenuItem({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Feather name={icon} size={22} color="#D4A64A" />
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#8A5C22',
    backgroundColor: 'rgba(58, 13, 13, 0.82)',
  },
  headerButton: {
    width: 38,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  title: {
    color: '#D4A64A',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 17,
    textAlign: 'center',
  },
  season: {
    color: '#F3E3C1',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    minHeight: 48,
    backgroundColor: 'rgba(58, 13, 13, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: '#8A5C22',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#D4A64A',
  },
  tabText: {
    color: '#C6A66A',
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
  },
  activeTabText: {
    color: '#F3D17A',
    fontFamily: 'Montserrat_500Medium',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingTop: 13,
    paddingBottom: 7,
  },
  sectionTitle: {
    color: '#D4A64A',
    fontSize: 13,
    fontFamily: 'Cinzel_700Bold',
  },
  fixtureCount: {
    color: '#F3E3C1',
    fontSize: 11,
  },
  dayHeader: {
    paddingHorizontal: 17,
    paddingTop: 7,
    paddingBottom: 6,
  },
  dayTitle: {
    color: '#E5C47A',
    fontSize: 11,
    fontFamily: 'Montserrat_500Medium',
  },
  listContent: {
    paddingBottom: 12,
  },
  matchCard: {
    backgroundColor: '#F3E3C1',
    marginHorizontal: 12,
    marginBottom: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C48D2A',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  matchInfo: {
    minHeight: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchDate: {
    color: '#4B3B2A',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B51F25',
  },
  liveText: {
    color: '#B51F25',
    fontSize: 10,
    fontFamily: 'Montserrat_500Medium',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    marginTop: 3,
  },
  teamColumn: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogo: {
    width: 34,
    height: 34,
  },
  logoPlaceholder: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    color: '#3A0D0D',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 3,
  },
  centerColumn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vs: {
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
  },
  score: {
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
  },
  predictionColumn: {
    width: 90,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  predictionBadge: {
    minHeight: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  predictionEmpty: {
    backgroundColor: '#C48D2A',
    borderColor: '#C6AE83',
  },
  predictionDone: {
    backgroundColor: '#16502F',
    borderColor: '#367A43',
  },
  predictionClosed: {
    backgroundColor: '#F5D7C5',
    borderColor: '#C45D4C',
  },
  predictionText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Montserrat_500Medium',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  feedbackText: {
    color: '#F3E3C1',
    textAlign: 'center',
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: '#D4A64A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 16,
  },
  retryText: {
    color: '#3A0D0D',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 35,
  },
  emptyText: {
    color: '#F3E3C1',
    marginTop: 12,
    textAlign: 'center',
  },
  /*
  bottomMenu: {
    height: 66,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#8A5C22',
    backgroundColor: '#3A0D0D',
  },
  menuItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    color: '#D4A64A',
    fontSize: 10,
    marginTop: 4,
  },
  */
});