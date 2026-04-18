import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";

const MemoryTrainingSettings = () => {
  const route = useRoute();
  const { people, setPeople } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission needed", "We need access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const addPerson = () => {
    if (!name.trim()) {
      Alert.alert("Oops", "Please enter a name");
      return;
    }

    if (!selectedImage) {
      Alert.alert("Oops", "Please select a picture");
      return;
    }

    const newPerson = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      uri: selectedImage.uri,
    };

    setPeople((prev) => [...prev, newPerson]);

    setName("");
    setDescription("");
    setSelectedImage(null);

    Alert.alert("Success", `${newPerson.name} added!`);
  };

  const removePerson = (id) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Training Settings</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter person's name"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Short description or memory hook..."
          multiline
        />

        <Button title="Pick Picture" onPress={pickImage} />

        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
          />
        )}

        <Button title="Add to Memory List" onPress={addPerson} />
      </View>

      <Text style={styles.listTitle}>Memory List ({people.length})</Text>

      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.uri }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              {item.description ? (
                <Text style={styles.cardDescription}>{item.description}</Text>
              ) : null}
            </View>
            <Button
              title="Remove"
              onPress={() => removePerson(item.id)}
              color="#ff4444"
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No people yet. Add some above.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f8f8" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  listTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cardImage: { width: 70, height: 70, borderRadius: 8 },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardName: { fontSize: 18, fontWeight: "bold" },
  cardDescription: { fontSize: 14, color: "#555", marginTop: 4 },
  emptyText: { textAlign: "center", marginTop: 50, color: "#888" },
});

export default MemoryTrainingSettings;
