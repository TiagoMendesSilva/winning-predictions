import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { api } from '../api/api';
import { getHomeScreen } from '../api/soccer.api'
import { HomeLeague } from '../types/HomeLeague';

import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  ChampionshipsStackParamList,
  MainTabParamList,
} from '../types/Navigation';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ChampionshipsStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList, 'Campeonatos'>
>;

export default function HomeScreen({navigation}: Props) {
  const [leagues, setLeagues] = useState<HomeLeague[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    loadLeagues();    
  }, []);

  const loadLeagues = async () => {
    
    try {
      const response = await getHomeScreen();
       console.log(
      JSON.stringify(response, null, 2)
    );
      setLeagues(response);     
    } catch (error) {
      console.error('Erro ao buscar ligas:', error);      
    } finally {
      setLoading(false)
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#D4A64A"
        />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            CAMPEONATOS
          </Text>

          <TouchableOpacity>
            <Feather
              name="bell"
              size={24}
              color="#D4A64A"
            />
          </TouchableOpacity>
        </View>

        {/* TÍTULO */}

        <Text style={styles.sectionTitle}>
          ATIVOS
        </Text>

        {/* LISTA */}

        <FlatList
          data={leagues}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              activeOpacity={0.8}         
                        
              onPress={() =>
                navigation.navigate('ChampionshipFixtures', {
                  leagueId: item.id,
                  leagueName:
                    item.name === 'Serie A'
                      ? 'Brasileirão Série A'
                      : item.name,
                  season: 2024,
                })
              }
            >
              {/* LOGO DA LIGA*/}

              
              <View style={styles.iconArea}>
                <Image
                  //source={{ uri: item.logoUrl }}
                  source={{ uri: `${api.defaults.baseURL}/leagues/${item.id}/logo` }}
                  //source={{ uri: `data:image/png;base64,${item.logo}` }}  
                  //source={{ uri: item.logo }}               
                  style={styles.leagueLogo}
                  resizeMode="contain"
                  onError={(e) => console.log('ERRO IMAGEM:', e.nativeEvent.error)}
                  //onLoad={() => console.log('IMAGEM CARREGOU:', item.logoUrl)}
                />
              </View>

              {/* CONTEÚDO */}

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {item.name === 'Serie A'
                    ? 'Brasileirão Série A'
                    : item.name}
                </Text>
                {/*    
                <Text style={styles.country}>
                  {item.country}                 
                </Text>
                */}    
                <Text style={styles.type}>
                   Próximo jogo
                </Text>
                
                {item.nextFixture ? (
                  <>
                    <View style={styles.matchRow}>

                      <View style={styles.teamColumn}>

                        <Image
                          source={{
                            uri: `data:image/png;base64,${item.nextFixture.homeTeamLogo}`,
                          }}
                          style={styles.teamLogo}
                          resizeMode="contain"
                        />

                        <Text
                          style={styles.teamName}
                          numberOfLines={2}
                        >
                          {item.nextFixture.homeTeam}
                        </Text>

                      </View>


                      <View style={styles.centerColumn}>
                        <Text style={styles.vs}>
                          X
                        </Text>
                      </View>


                      <View style={styles.teamColumn}>

                        <Image
                          source={{
                            uri: `data:image/png;base64,${item.nextFixture.awayTeamLogo}`,
                          }}
                          style={styles.teamLogo}
                          resizeMode="contain"
                        />

                        <Text
                          style={styles.teamName}
                          numberOfLines={2}
                        >
                          {item.nextFixture.awayTeam}
                        </Text>

                      </View>

                    </View>
                    <Text style={styles.matchDate}>
                      {formatDate(item.nextFixture.date)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.matchDate}>
                    Sem jogos programados
                  </Text>
                )}
                
              </View>

              <View style={styles.arrowContainer}>
                <Feather
                  name="chevron-right"
                  size={22}
                  color="#3A0D0D"
                />
              </View>
            </TouchableOpacity>
          )}
        />

        {/* MENU INFERIOR */}
        {/*
        <View style={styles.bottomMenu}>
          <MenuItem
            icon="award"
            label="Campeonatos"
          />

          <MenuItem
            icon="edit-3"
            label="Palpites"
          />

          <MenuItem
            icon="bar-chart-2"
            label="Ranking"
          />

          <MenuItem
            icon="user"
            label="Perfil"
          />
        </View>
        */}
      </SafeAreaView>
    </ImageBackground>
  );
}

function MenuItem({
  icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Feather
        name={icon}
        size={22}
        color="#D4A64A"
      />

      <Text style={styles.menuLabel}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A0D0D',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 20,
    paddingVertical: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#8A5C22',
  },

  title: {
    color: '#D4A64A',
    fontSize: 30,
    fontFamily: 'Cinzel_700Bold',
  },

  sectionTitle: {
    color: '#D4A64A',
    marginHorizontal: 20,
    marginVertical: 15,
    fontSize: 18,
    fontFamily: 'Cinzel_700Bold',
  },

  card: {
    flexDirection: 'row',

    backgroundColor: '#F3E3C1',

    marginHorizontal: 12,
    marginBottom: 12,

    borderRadius: 14,

    borderWidth: 2,
    borderColor: '#C48D2A',

    overflow: 'hidden',
  },

  iconArea: {
    width: 90,

    backgroundColor: '#0D472F',

    justifyContent: 'center',
    alignItems: 'center',
  },

  leagueLogo: {
    width: 55,
    height: 55,
  },

  cardContent: {
    flex: 1,
    padding: 14,
  },

  cardTitle: {
    color: '#3A0D0D',
    fontSize: 18,
    fontFamily: 'Cinzel_700Bold',
  },

  country: {
    color: '#555',
    fontSize: 14,
    marginTop: 6,
  },

  type: {
    color: '#777',
    fontSize: 12,
    marginTop: 4,
  },

  arrowContainer: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  bottomMenu: {
    height: 70,

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
    fontSize: 12,
    marginTop: 4,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },  
  teamLogo: {
    width: 48,
    height: 48,
  },

  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  matchDate: {
    marginTop: 12,
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
  },

  vs: {
    fontSize: 24,
    color: '#3A0D0D',
    fontFamily: 'Cinzel_700Bold',
  },
  teamName: {
    marginTop: 8,
    textAlign: 'center',
    color: '#3A0D0D',
    fontSize: 11,
    fontFamily: 'Cinzel_700Bold',
    lineHeight: 15,
  },

  teamColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerColumn: {
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});