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
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.topContainer}>
          <Image
            source={require("./assets/icon.png")}
            style={{ width: 150, height: 150 }}
          />
          <View class="introduction">
            <Text style={styles.title}>MemoMate</Text>
            <Text style={styles.slogan}>Друг для вашей памяти</Text>
          </View>
        </View>
        <ScrollView>
          <TouchableOpacity
            style={styles.buttonTop}
            onPress={() => navigation.navigate("Details")}
          >
            <Text style={styles.text}>Список дел</Text>
            <Text style={styles.description}>Что вам нужно выполнить?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Details")}
          >
            <Text style={styles.text}>Разминка памяти</Text>
            <Text style={styles.description}>
              Освежите память о своих родственниках и знакомых
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Details")}
          >
            <Text style={styles.text}>Инструкции</Text>
            <Text style={styles.description}>
              В чём-то запутались? Здесь есть инструкции для выполнения
              ежедневных задач
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: 30,
    fontFamily: "serif",
    fontWeight: "regular",
  },
  description: {
    color: colors.white,
    fontSize: 22,
  },
  title: {
    color: colors.accent,
    fontSize: 30,
    fontFamily: "serif",
  },
  slogan: {
    fontSize: 15,
    color: colors.accent,
  },
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 10,
  },
  topContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: colors.secondary,
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonTop: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 40,
    marginBottom: 20,
  },
});

export default HomeScreen;
