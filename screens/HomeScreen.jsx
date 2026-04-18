import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  createStaticNavigation,
  useNavigation,
  Link,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Background, Button } from "@react-navigation/elements";
import { colors } from "./assets/colors";
import { SafeAreaView } from "react-native-safe-area-context";

function HomeScreen(props) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MemoryTraining")}
        >
          <Text style={styles.title}>Разминка памяти</Text>
          <Text style={styles.description}>
            Угадай кто изображён на фотографии
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MemoryTraining")}
        >
          <Text style={styles.title}>Список дел</Text>
          <Text style={styles.description}>
            Что вы запланировали на сегодня?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MemoryTraining")}
        >
          <Text style={styles.title}>Инструкции</Text>
          <Text style={styles.description}>
            Пошаговое объяснение ежедневных задач
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MemoryTraining")}
        >
          <Text style={styles.title}>Телефонная книга</Text>
          <Text style={styles.description}>Удобный список ваших контактов</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 28,
    fontFamily: "semibold",
  },
  description: {
    color: colors.white,
    fontFamily: "regular",
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 25,
    borderRadius: 30,
    marginBottom: 20,
  },
});

export default HomeScreen;
