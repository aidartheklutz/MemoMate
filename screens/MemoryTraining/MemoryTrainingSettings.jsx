import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../assets/colors";
import { useNavigation } from "@react-navigation/native";

function MemoryTraining(props) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/brainMuscle.png")}
        style={{ height: 200, width: 200, alignSelf: "center" }}
      />
      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Начать разминку</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("MemoryTrainingSettings")}
        >
          <Text style={styles.textSmaller}>Настроить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: 28,
    fontFamily: "semibold",
  },
  text: {
    color: colors.white,
    fontFamily: "regular",
    fontSize: 30,
  },
  textSmaller: {
    color: colors.white,
    fontFamily: "regular",
    fontSize: 25,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "start",
    backgroundColor: colors.dark,
    padding: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 25,
    borderRadius: 30,
    marginBottom: 20,
  },
  settingsButton: {
    backgroundColor: colors.primary,
    padding: 25,
    borderRadius: 30,
    marginBottom: 20,
  },
});

export default MemoryTraining;
