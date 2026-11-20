
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api/api';

import { ChampionshipsStackParamList } from '../types/Navigation';

/*
type RootStackParamList = {
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
  'MakePrediction'
>;

const DEADLINE_MINUTES = 10;

// TEMPORÁRIO: permitir palpites em partidas antigas para testar o backend.
const TESTING_ALLOW_EXPIRED_PREDICTIONS = true;

export default function MakePredictionScreen({
  navigation,
  route,
}: Props) {
  const {
    fixtureId,
    leagueName,
    kickoffDate,
    homeTeam,
    awayTeam,
    homeTeamLogo,
    awayTeamLogo,
  } = route.params;

  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [remainingSeconds, setRemainingSeconds] =
  useState(() =>
    TESTING_ALLOW_EXPIRED_PREDICTIONS
      ? 3600
      : getRemainingSeconds(kickoffDate)
  );  

  const [loadingPredicition, setLoadingPrediction] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function loadPrediction() {
        setLoadingPrediction(true);
        try {
          const response = await api.get(`/predictions/fixture/${fixtureId}`);
          if(!active) return;
          setHomeGoals(response.data.homeGoals);
          setAwayGoals(response.data.awayGoals);
          setSaved(true);
        } catch(error: any) {
          if(!active) return;
          if(error.response?.status === 404) {
            setHomeGoals(0);
            setAwayGoals(0);
            setSaved(false);            
          } else {
             console.error(
              'Erro ao carregar palpite:',
              error.response?.data ?? error.message
            );
          }         
        } finally {
          if(active) {
            setLoadingPrediction(false);
          }
        }
      }
      loadPrediction();
      return () => {
        active = false;
      };
    }, [fixtureId])
  );


  /*
  const [remainingSeconds, setRemainingSeconds] =
    useState(() => getRemainingSeconds(kickoffDate));
  const [saved, setSaved] = useState(false);
  */

  useEffect(() => {
    if (TESTING_ALLOW_EXPIRED_PREDICTIONS) {
        setRemainingSeconds(3600);
        return;
    }

    const interval = setInterval(() => {
        setRemainingSeconds(getRemainingSeconds(kickoffDate));
    }, 1000);

    return () => clearInterval(interval);
    }, [kickoffDate]);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(kickoffDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [kickoffDate]);

  */
  function getRemainingSeconds(date: string): number {
    const kickoff = new Date(date).getTime();
    const deadline =
      kickoff - DEADLINE_MINUTES * 60 * 1000;

    return Math.max(
      0,
      Math.floor((deadline - Date.now()) / 1000),
    );
  }

  function formatCountdown(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(secs).padStart(2, '0'),
    ].join('h ') + '';
  }

  function formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatMatchDay(date: string): string {
    const matchDate = new Date(date);
    const today = new Date();

    const isToday =
      matchDate.getDate() === today.getDate() &&
      matchDate.getMonth() === today.getMonth() &&
      matchDate.getFullYear() === today.getFullYear();

    const dayLabel = isToday
      ? 'Hoje'
      : matchDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        });

    return `${dayLabel} · ${formatTime(date)}`;
  }

  async function savePrediction() {
    if (saving || saved) {
        return;
    }

    if (!TESTING_ALLOW_EXPIRED_PREDICTIONS && remainingSeconds <= 0) {
        Alert.alert(
        'Prazo encerrado',
        'Não é mais possível palpitar nesta partida.',
        );
        return;
    }

    try {
        setSaving(true);

        const response = await api.post('/predictions', {
        fixtureId,
        homeGoals,
        awayGoals,
        });

        // Só marca como salvo depois da confirmação da API.
        setSaved(true);

        Alert.alert(
        'Palpite registrado!',
        `${homeTeam} ${homeGoals} x ${awayGoals} ${awayTeam}`,
        );

        console.log('Palpite salvo no backend:', response.data);
    } catch (error: any) {
        console.error(
        'Erro ao salvar palpite:',
        error.response?.status,
        error.response?.data ?? error.message,
        );

        const status = error.response?.status;
        const message =
        error.response?.data?.detail ??
        error.response?.data?.message;

        if (status === 401) {
        Alert.alert(
            'Sessão expirada',
            'Faça login novamente para registrar seu palpite.',
        );
        } else if (status === 409) {
        Alert.alert(
            'Não foi possível salvar',
            message ??
            'O palpite já existe ou o prazo para esta partida foi encerrado.',
        );
        } else if (status === 400 || status === 422) {
        Alert.alert(
            'Dados inválidos',
            message ?? 'Verifique os dados da partida e tente novamente.',
        );
        } else {
        Alert.alert(
            'Erro ao salvar',
            'Não foi possível registrar o palpite. Tente novamente.',
        );
        }
    } finally {
        setSaving(false);
    }
  }
  

  /*
  function savePrediction() {
    if (remainingSeconds <= 0) {
      return;
    }

    // Nesta etapa, o salvamento é apenas local.
    // A integração com o backend será implementada depois.
    setSaved(true);
  }

  */
  function renderTeamLogo(
    logo: string | null,
    teamName: string,
  ) {
    const uri = logo
      ? logo.startsWith('data:image/')
        ? logo
        : `data:image/png;base64,${logo}`
      : null;

    if (!uri) {
      return (
        <View style={styles.logoPlaceholder}>
          <Feather
            name="shield"
            size={48}
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

  function renderScoreControl(
    value: number,
    onChange: React.Dispatch<React.SetStateAction<number>>,
  ) {
    return (
      <View style={styles.scoreColumn}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{value}</Text>
        </View>

        <View style={styles.adjustmentRow}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() =>
              onChange((current) => Math.max(0, current - 1))
            }
            disabled={remainingSeconds <= 0}
            accessibilityLabel="Diminuir gols"
          >
            <Feather name="minus" size={20} color="#3A0D0D" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() =>
              onChange((current) => current + 1)
            }
            disabled={remainingSeconds <= 0}
            accessibilityLabel="Aumentar gols"
          >
            <Feather name="plus" size={20} color="#3A0D0D" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const deadlineClosed = remainingSeconds <= 0;

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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Voltar"
          >
            <Feather
              name="arrow-left"
              size={26}
              color="#D4A64A"
            />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.leagueName} numberOfLines={1}>
              {leagueName.toUpperCase()}
            </Text>

            <Text style={styles.matchDate}>
              {formatMatchDay(kickoffDate)}
            </Text>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            {renderTeamLogo(homeTeamLogo, homeTeam)}
            <Text style={styles.teamName} numberOfLines={2}>
              {homeTeam.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.versus}>X</Text>

          <View style={styles.team}>
            {renderTeamLogo(awayTeamLogo, awayTeam)}
            <Text style={styles.teamName} numberOfLines={2}>
              {awayTeam.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.predictionPanel}>
          <Text style={styles.panelTitle}>SEU PALPITE</Text>

          <View style={styles.scoreRow}>
            {renderScoreControl(homeGoals, setHomeGoals)}

            <Text style={styles.scoreVersus}>X</Text>

            {renderScoreControl(awayGoals, setAwayGoals)}
          </View>

          <TouchableOpacity
            style={[
                styles.saveButton,
                (
                  loadingPredicition ||
                  (!TESTING_ALLOW_EXPIRED_PREDICTIONS && deadlineClosed) ||
                  saved ||
                  saving
                ) && styles.saveButtonDisabled,
            ]}
            onPress={savePrediction}
            disabled={
                loadingPredicition ||
                saving ||
                saved ||
                (!TESTING_ALLOW_EXPIRED_PREDICTIONS && deadlineClosed)
            }
            activeOpacity={0.85}
            >
            <Text style={styles.saveButtonText}>
                {saving
                ? 'SALVANDO...'
                : saved
                    ? 'PALPITE REGISTRADO'
                    : !TESTING_ALLOW_EXPIRED_PREDICTIONS && deadlineClosed
                    ? 'PRAZO ENCERRADO'
                    : 'SALVAR PALPITE'}
            </Text>
        </TouchableOpacity>

          <View style={styles.countdownRow}>
            <Feather
              name="clock"
              size={23}
              color="#3A0D0D"
            />

            <Text style={styles.countdownLabel}>
              {deadlineClosed ? 'Prazo encerrado' : 'Faltam '}
            </Text>

            {!deadlineClosed && (
              <Text style={styles.countdown}>
                {String(Math.floor(remainingSeconds / 3600)).padStart(2, '0')}
                h{' '}
                {String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0')}
                m{' '}
                {String(remainingSeconds % 60).padStart(2, '0')}s
              </Text>
            )}
          </View>

          <Text style={styles.deadlineText}>
            Prazo encerra 10 min antes da partida
          </Text>
        </View>
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
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backButton: {
    width: 38,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginRight: 38,
  },
  leagueName: {
    color: '#D4A64A',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  matchDate: {
    color: '#F3E3C1',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    marginTop: 4,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 24,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 76,
    height: 76,
  },
  logoPlaceholder: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    color: '#F3E3C1',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  versus: {
    color: '#D4A64A',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    marginHorizontal: 10,
  },
  predictionPanel: {
    marginHorizontal: 5,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 25,
    borderWidth: 2,
    borderColor: '#C48D2A',
    borderRadius: 13,
    backgroundColor: '#F3E3C1',
  },
  panelTitle: {
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
  },
  scoreBox: {
    width: '88%',
    height: 58,
    borderWidth: 1,
    borderColor: '#A87531',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8EBD1',
  },
  scoreText: {
    color: '#24180F',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 34,
  },
  adjustmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  adjustButton: {
    width: 43,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A87531',
    borderRadius: 5,
    backgroundColor: '#EAD8B5',
  },
  scoreVersus: {
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    marginHorizontal: 8,
  },
  saveButton: {
    minHeight: 48,
    marginTop: 25,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C48D2A',
    backgroundColor: '#073D20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#F3D17A',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  countdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  countdownLabel: {
    color: '#24180F',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    marginLeft: 8,
  },
  countdown: {
    color: '#16502F',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
  },
  deadlineText: {
    color: '#24180F',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
  },
});