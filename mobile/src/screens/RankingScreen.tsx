
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { MainTabParamList } from '../types/Navigation';
import { api } from '../api/api';

type Props = BottomTabScreenProps<
  MainTabParamList,
  'Ranking'
>;

/*
type RankingPlayer = {
  id: number;
  name: string;
  points: number;
  accuracy: number;
  isCurrentUser?: boolean;
};

// Dados demonstrativos.
// Posteriormente serão carregados do backend.

const rankingData: RankingPlayer[] = [
  {
    id: 1,
    name: 'João Victor',
    points: 45,
    accuracy: 72,
  },
  {
    id: 2,
    name: 'Maria Fernanda',
    points: 42,
    accuracy: 68,
  },
  {
    id: 3,
    name: 'Pedro Henrique',
    points: 38,
    accuracy: 63,
  },
  {
    id: 4,
    name: 'VOCÊ',
    points: 35,
    accuracy: 60,
    isCurrentUser: true,
  },
  {
    id: 5,
    name: 'Lucas Almeida',
    points: 32,
    accuracy: 59,
  },
  {
    id: 6,
    name: 'Rafael Oliveira',
    points: 28,
    accuracy: 55,
  },
  {
    id: 7,
    name: 'Ana Clara',
    points: 25,
    accuracy: 53,
  },
  {
    id: 8,
    name: 'Gabriel Lima',
    points: 22,
    accuracy: 51,
  },
];
*/
interface RankingPlayer {
  position: number;
  userId: number;
  name: string;
  pictureUrl: string | null;
  points: number;
  totalPredicitions: number;
  correctPredictions: number;
  exactPredictions: number;
  accuracy: number;
  currentUser: boolean;
}

export default function RankingScreen({ navigation }: Props) {
  const [rankingData, setRankingData] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/ranking', {
          params: {
            leagueId: 71,
            season: 2024,
          }
      });
      setRankingData(response.data);
    } catch(error) {
      console.error('Erro ao carregar ranking: ', error);
      setError('Não foi possível carregar o ranking');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRanking();
    }, [fetchRanking])
  );
 
  const renderPosition = (position: number) => {
    if (position === 1) {
      return (
        <View style={[styles.medal, styles.goldMedal]}>
          <Text style={styles.medalText}>1</Text>
        </View>
      );
    }

    if (position === 2) {
      return (
        <View style={[styles.medal, styles.silverMedal]}>
          <Text style={styles.medalText}>2</Text>
        </View>
      );
    }

    if (position === 3) {
      return (
        <View style={[styles.medal, styles.bronzeMedal]}>
          <Text style={styles.medalText}>3</Text>
        </View>
      );
    }

    return (
      <Text style={styles.positionText}>
        {position}
      </Text>
    );
  };

  const renderPlayer = ({
    item,
    index,
  }: {
    item: RankingPlayer;
    index: number;
  }) => {
    const position = item.position;

    return (
      <View
        style={[
          styles.playerRow,
          item.currentUser && styles.currentUserRow,
        ]}
      >
        <View style={styles.positionColumn}>
          {renderPosition(position)}
        </View>

        <View style={styles.playerColumn}>
          <Text
            numberOfLines={1}
            style={[
              styles.playerName,
              item.currentUser && styles.currentUserText,
            ]}
          >
            {item.name}
          </Text>
        </View>

        <View style={styles.pointsColumn}>
          <Text
            style={[
              styles.playerValue,
              item.currentUser && styles.currentUserText,
            ]}
          >
            {item.points}
          </Text>
        </View>

        <View style={styles.accuracyColumn}>
          <Text
            style={[
              styles.playerValue,
              item.currentUser && styles.currentUserText,
            ]}
          >
            {item.accuracy}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#250807"
      />

      <View style={styles.container}>

        {/* CABEÇALHO */}
        <View style={styles.header}>
            <TouchableOpacity
                onPress={()=> navigation.navigate('Campeonatos')}
                style={styles.backButton}
            >
                <Feather
                    name="arrow-left"
                    size={25}
                    color="#F4C542"
                />
            </TouchableOpacity>

          

          <View style={styles.headerTitle}>
            <Text style={styles.leagueName}>
              BRASILEIRÃO SÉRIE A
            </Text>

            <Text style={styles.season}>
              2024
            </Text>
          </View>

          <Feather
            name="award"
            size={25}
            color="#F4C542"
          />

        </View>

        {/* TABELA */}
        <View style={styles.table}>

          {/* CABEÇALHO DA TABELA */}
          <View style={styles.tableHeader}>

            <View style={styles.positionColumn}>
              <Text style={styles.columnHeader}>#</Text>
            </View>

            <View style={styles.playerColumn}>
              <Text style={styles.columnHeader}>
                JOGADOR
              </Text>
            </View>

            <View style={styles.pointsColumn}>
              <Text style={styles.columnHeader}>
                PONTOS
              </Text>
            </View>

            <View style={styles.accuracyColumn}>
              <Text style={styles.columnHeader}>
                APROV.%
              </Text>
            </View>

          </View>

          {loading && (
            <Text style={styles.demoNotice}>
              Carregando classificação...
            </Text>
          )}

          {!loading && error !== null && (
            <TouchableOpacity onPress={fetchRanking}>
              <Text style={styles.demoNotice}>
                {error} Toque para tentar novamente.
              </Text>
            </TouchableOpacity>
          )}

          {!loading && error === null && rankingData.length === 0 && (
            <Text style={styles.demoNotice}>
              Ainda não existem palpites para esta classificação.
            </Text>
          )}

          {/* CLASSIFICAÇÃO */}
          <FlatList
            data={rankingData}
            keyExtractor={(item) => String(item.userId)}
            renderItem={renderPlayer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />

        </View>

        {/* AVISO TEMPORÁRIO */}
        {/*
        <Text style={styles.demoNotice}>
          Dados demonstrativos
        </Text>
        */}  
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 38,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#250807',
  },

  container: {
    flex: 1,
    backgroundColor: '#250807',
    paddingHorizontal: 8,
    paddingTop: 5,
  },

  // Cabeçalho

  header: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },

  leagueName: {
    color: '#F4C542',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    textAlign: 'center',
  },

  season: {
    color: '#F3E3C1',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    marginTop: 2,
  },

  // Tabela

  table: {
    flex: 1,
    marginTop: 8,
    marginBottom: 5,
    backgroundColor: '#F3E3C1',
    borderWidth: 2,
    borderColor: '#C48D2A',
    borderRadius: 12,
    overflow: 'hidden',
  },

  tableHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9D5A9',
    borderBottomWidth: 1,
    borderBottomColor: '#C9AC75',
    paddingHorizontal: 10,
  },

  columnHeader: {
    color: '#17110B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10,
    textAlign: 'center',
  },

  // Colunas

  positionColumn: {
    width: '12%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playerColumn: {
    width: '43%',
    justifyContent: 'center',
  },

  pointsColumn: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  accuracyColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Jogadores

  listContent: {
    paddingBottom: 5,
  },

  playerRow: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D7C49B',
  },

  currentUserRow: {
    backgroundColor: '#17451D',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#B58A38',
  },

  playerName: {
    color: '#17110B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
  },

  playerValue: {
    color: '#17110B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
  },

  currentUserText: {
    color: '#F7E5B5',
  },

  // Medalhas

  medal: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A77A25',
  },

  goldMedal: {
    backgroundColor: '#E5A900',
  },

  silverMedal: {
    backgroundColor: '#A9A49A',
  },

  bronzeMedal: {
    backgroundColor: '#B96B24',
  },

  medalText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
  },

  positionText: {
    color: '#17110B',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
  },

  demoNotice: {
    color: '#D4A64A',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 9,
    textAlign: 'center',
    paddingVertical: 4,
  },
});
