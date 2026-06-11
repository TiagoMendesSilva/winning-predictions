import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {user?.pictureUrl && (
        <Image source={{ uri: user.pictureUrl }} style={styles.avatar} />
      )}
      <Text style={styles.name}>Olá, {user?.name}!</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' },
  button: { backgroundColor: '#FF4444', padding: 15, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});