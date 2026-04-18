import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Touchable, TouchableOpacity } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import MemoryTraining from './screens/MemoryTrainingScreen';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { colors } from './screens/assets/colors';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';



// NAVIGATION
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  // screenOptions добавляет короче один и тот же option всем экранам
  screenOptions: {
    headerStyle: { backgroundColor: colors.secondary },
    headerTintColor: colors.accent,
    headerTitleStyle: {
      fontFamily: 'medium'
    },
  },
  screens: {
    Home: {
       screen: HomeScreen,
       options: {
        headerTitle: (props) => (
          <View style={styles.header}>
            <View style={{flexDirection: 'row', gap: 20}}>
              <Image source={require('./screens/assets/icon_transparent.png')} style={{width: 45.5, height: 27.75}} />
              <Text style={styles.headerText}>MemoMate</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}><Text style={styles.settingsText}>О проекте</Text></TouchableOpacity>
          </View>
        ),
       },
      },
      MemoryTraining: {
       screen: MemoryTraining,
       options: {
        headerBackVisible: false,
        headerTitle: (props) => {
          const navigation = useNavigation();
          return (
          <View style={styles.header}>
            <View style={{flexDirection: 'row', gap: 20}}>
              <Text style={styles.headerText}>Разминка памяти</Text>
              
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.menuButton}><Image source={require('./screens/assets/menu.png')} style={{height: 13.25, width: 29.75}} /></TouchableOpacity>
          </View>
        )},
       },
       
      },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const [loaded, error] = useFonts({
    'regular': require('./screens/assets/fonts/Overpass-Regular.ttf'),
    'medium': require('./screens/assets/fonts/Overpass-Medium.ttf'),
    'semibold': require('./screens/assets/fonts/Overpass-SemiBold.ttf'),
    'bold': require('./screens/assets/fonts/Overpass-Bold.ttf'),
    'italic': require('./screens/assets/fonts/Overpass-Italic.ttf'),
  });
  

  if (!loaded && !error) return null;
  return (
    <Navigation />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  headerText: {
    color: colors.accent,
    fontFamily: 'medium',
    fontSize: 20,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
  menuButton: {
    padding: 8,
    
    borderRadius: 999,
  },
  settingsText: {
    fontFamily: 'regular',
    fontSize: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
