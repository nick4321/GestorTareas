import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <View style={styles.contenedor}>
      <StatusBar style="dark" />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#f2f2f2',
  },
});