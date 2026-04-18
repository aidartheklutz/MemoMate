import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const MemoryTrainingGame = () => {
  const route = useRoute();
  const { people = [] } = route.params || {};

  const [currentPerson, setCurrentPerson] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);

  // Get random item
  const getRandomPerson = () => {
    return people[Math.floor(Math.random() * people.length)];
  };

  // Shuffle array
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const generateRound = () => {
    if (people.length < 1) return;

    const correct = getRandomPerson();

    // Get 3 random wrong answers
    let wrong = people.filter((p) => p.id !== correct.id);

    wrong = shuffleArray(wrong).slice(0, 3);

    const allOptions = shuffleArray([correct, ...wrong]);

    setCurrentPerson(correct);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateRound();
  }, [people]);

  const handleAnswer = (selected) => {
    if (selected.id === currentPerson.id) {
      setScore((prev) => prev + 1);
    } else {
      setScore(0); // reset because life is cruel
    }

    generateRound();
  };

  if (!people.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No people found. Go add some first.</Text>
      </View>
    );
  }

  if (!currentPerson) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>

      <Image source={{ uri: currentPerson.uri }} style={styles.image} />

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MemoryTrainingGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
  score: {
    color: "white",
    fontSize: 22,
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 30,
  },
  optionsContainer: {
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  optionText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
