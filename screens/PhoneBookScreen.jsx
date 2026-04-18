import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import { colors } from "./assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const STORAGE_KEY = "@phone_book";
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

function PhoneBookScreen() {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedContacts !== null) {
        setContacts(
          JSON.parse(storedContacts).sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        );
      }
    } catch (e) {
      console.error("Failed to load contacts", e);
    }
  };

  const saveContacts = async (newContacts) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
    } catch (e) {
      console.error("Failed to save contacts", e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Ошибка",
        "Этому приложению требуется разрешение на доступ к вашим фотографиям.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addContact = () => {
    if (name.trim() && phone.trim()) {
      const newContacts = [
        ...contacts,
        {
          id: Date.now().toString(),
          name,
          phone,
          image,
        },
      ].sort((a, b) => a.name.localeCompare(b.name));

      setContacts(newContacts);
      saveContacts(newContacts);
      resetModal();
    } else {
      Alert.alert("Ошибка", "Пожалуйста, введите имя и номер телефона");
    }
  };

  const resetModal = () => {
    setName("");
    setPhone("");
    setImage(null);
    setModalVisible(false);
  };

  const deleteContact = (id) => {
    Alert.alert("Удаление", "Вы уверены, что хотите удалить этот контакт?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          const newContacts = contacts.filter((c) => c.id !== id);
          setContacts(newContacts);
          saveContacts(newContacts);
        },
      },
    ]);
  };

  const makeCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Ошибка", "Звонки не поддерживаются на этом устройстве");
        }
      })
      .catch((err) => console.error(err));
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.contactCard}
        onPress={() => makeCall(item.phone)}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.placeholderImage]}>
            <Ionicons name="person" size={60} color={colors.gray} />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.contactName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBadge}
        onPress={() => deleteContact(item.id)}
      >
        <Ionicons name="close-circle" size={28} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Контакты</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="person-add" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>У вас пока нет контактов</Text>
        }
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новый контакт</Text>

            <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.pickedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color={colors.gray} />
                  <Text style={styles.imagePickerText}>Добавить фото</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Имя"
              placeholderTextColor={colors.gray}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Номер телефона"
              placeholderTextColor={colors.gray}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={resetModal}
              >
                <Text style={styles.btnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={addContact}
              >
                <Text style={styles.btnText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "bold",
    color: colors.white,
  },
  addBtn: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 15,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    position: "relative",
  },
  contactCard: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH,
    resizeMode: "cover",
  },
  placeholderImage: {
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    padding: 12,
    alignItems: "center",
  },
  contactName: {
    fontSize: 18,
    color: colors.white,
    fontFamily: "bold",
    textAlign: "center",
  },
  contactPhone: {
    fontSize: 14,
    color: colors.accent,
    fontFamily: "medium",
    marginTop: 2,
  },
  deleteBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: colors.dark,
    borderRadius: 15,
  },
  emptyText: {
    color: colors.accent,
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    fontFamily: "regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    width: "100%",
    padding: 25,
    borderRadius: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: colors.dark,
    marginBottom: 20,
  },
  imagePickerBtn: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#f0f0f0",
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.dark,
    borderStyle: "dashed",
  },
  pickedImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePickerText: {
    fontSize: 12,
    color: colors.dark,
    marginTop: 5,
    fontFamily: "medium",
  },
  input: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 15,
    fontSize: 18,
    marginBottom: 15,
    color: colors.dark,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: colors.accent,
  },
  saveBtn: {
    backgroundColor: colors.dark,
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "semibold",
  },
});

export default PhoneBookScreen;
