import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors } from "../assets/colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MemoryTraining() {
  const [people, setPeople] = useState([]);
  const navigation = useNavigation();

  // Load saved data
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const stored = await AsyncStorage.getItem("people");
        if (stored) {
          setPeople(JSON.parse(stored));
        }
      } catch (e) {
        console.log("Error loading people:", e);
      }
    };

    loadPeople();
  }, []);

  // Save whenever people changes
  useEffect(() => {
    const savePeople = async () => {
      try {
        await AsyncStorage.setItem("people", JSON.stringify(people));
      } catch (e) {
        console.log("Error saving people:", e);
      }
    };

    savePeople();
  }, [people]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/brainMuscle.png")}
        style={{ height: 200, width: 200, alignSelf: "center" }}
      />

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MemoryTrainingGame", { people })}
        >
          <Text style={styles.text}>Начать разминку</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() =>
            navigation.navigate("MemoryTrainingSettings", {
              people,
              setPeople,
            })
          }
        >
          <Text style={styles.textSmaller}>Настроить</Text>
        </TouchableOpacity>

        <Text style={styles.counter}>Людей в списке: {people.length}</Text>
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
    alignItems: "center", // fixed "start" (which doesn't exist, by the way)
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
  counter: {
    color: colors.white,
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
  },
});

export default MemoryTraining;
