import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { colors } from './screens/assets/colors';

// NAVIGATION
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  // screenOptions добавляет короче один и тот же option всем экранам
  screenOptions: {
    headerStyle: { backgroundColor: colors.secondary },
    headerTintColor: colors.white,
  },
  screens: {
    Home: {
       screen: HomeScreen,
       options: {
        title: 'Skibidi',
        headerShown: false,
       },
      },
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <Navigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
