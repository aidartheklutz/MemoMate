import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { colors } from "./assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import DateTimePicker from "@react-native-community/datetimepicker";

const STORAGE_KEY = "@todo_list";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function TodoListScreen() {
  const [task, setTask] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);

  useEffect(() => {
    loadTodos();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Внимание",
          "Без разрешений уведомления-напоминания не будут работать!",
        );
      }
    }
  };

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos !== null) {
        setTodoList(JSON.parse(storedTodos));
      }
    } catch (e) {
      console.error("Failed to load todos", e);
    }
  };

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos", e);
    }
  };

  const scheduleNotification = async (taskText, date) => {
    if (!date || date < new Date()) return null;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Напоминание от MemoMate 🧠",
        body: taskText,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: date,
      },
    });
    return identifier;
  };

  const cancelNotification = async (id) => {
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  };

  const addTask = async () => {
    console.log("Adding task START:", task);
    if (!task.trim()) return;

    let notificationId = null;
    try {
      if (reminderTime) {
        notificationId = await scheduleNotification(task, reminderTime);
      }
    } catch (error) {
      console.error("Notification Error:", error);
    }

    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: task,
      completed: false,
      reminderTime: reminderTime ? reminderTime.toISOString() : null,
      notificationId: notificationId,
    };

    const updatedTodos = [...todoList, newTask];
    setTodoList(updatedTodos);
    saveTodos(updatedTodos);

    console.log("Task Added. New Length:", updatedTodos.length);
    setTask("");
    setReminderTime(null);
  };

  const toggleTask = async (id) => {
    const updatedTodos = await Promise.all(
      todoList.map(async (item) => {
        if (item.id === id) {
          const newCompleted = !item.completed;
          let newNotificationId = item.notificationId;

          if (newCompleted && item.notificationId) {
            await cancelNotification(item.notificationId);
            newNotificationId = null;
          } else if (!newCompleted && item.reminderTime) {
            const rDate = new Date(item.reminderTime);
            if (rDate > new Date()) {
              newNotificationId = await scheduleNotification(item.text, rDate);
            }
          }
          return {
            ...item,
            completed: newCompleted,
            notificationId: newNotificationId,
          };
        }
        return item;
      }),
    );

    setTodoList(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTask = async (id) => {
    const taskToDelete = todoList.find((t) => t.id === id);
    if (taskToDelete?.notificationId) {
      await cancelNotification(taskToDelete.notificationId);
    }
    const newTodos = todoList.filter((item) => item.id !== id);
    setTodoList(newTodos);
    saveTodos(newTodos);
  };

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      // Ensure time is in the future
      if (selectedDate < new Date()) {
        Alert.alert("Ошибка", "Пожалуйста, выберите время в будущем");
      } else {
        setReminderTime(selectedDate);
      }
    }
  };

  const renderItem = ({ item }) => {
    let timeStr = null;
    try {
      if (item.reminderTime) {
        timeStr = new Date(item.reminderTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (e) {
      console.error("Time Format Error:", e);
    }

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => toggleTask(item.id)}
        >
          <Ionicons
            name={item.completed ? "checkbox" : "square-outline"}
            size={32}
            color={item.completed ? colors.success : colors.accent}
          />
          <View style={styles.textContainer}>
            <Text
              style={[styles.taskText, item.completed && styles.completedText]}
            >
              {item.text}
            </Text>
            {timeStr && !item.completed && (
              <View style={styles.reminderInfo}>
                <Ionicons
                  name="notifications"
                  size={14}
                  color={colors.accent}
                />
                <Text style={styles.reminderText}>{timeStr}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Ionicons name="trash-outline" size={28} color={colors.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои дела ({todoList.length})</Text>
      </View>

      <FlatList
        data={todoList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 150 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputArea}
      >
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[styles.optionBtn, reminderTime && styles.optionBtnActive]}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons
              name="time-outline"
              size={24}
              color={reminderTime ? colors.dark : colors.white}
            />
            <Text
              style={[
                styles.optionLabel,
                reminderTime && styles.optionLabelActive,
              ]}
            >
              {reminderTime
                ? reminderTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Напомнить"}
            </Text>
          </TouchableOpacity>
          {reminderTime && (
            <TouchableOpacity onPress={() => setReminderTime(null)}>
              <Ionicons name="close-circle" size={24} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={"Что нужно сделать?"}
            placeholderTextColor={colors.gray}
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity onPress={() => addTask()}>
            <View style={styles.addBtn}>
              <Ionicons name="add" size={35} color={colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {showTimePicker && (
        <DateTimePicker
          value={reminderTime || new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "bold",
    color: colors.white,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  taskText: {
    color: colors.white,
    fontFamily: "medium",
    fontSize: 20,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: colors.gray,
  },
  reminderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  reminderText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "regular",
  },
  inputArea: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 8,
  },
  optionBtnActive: {
    backgroundColor: colors.accent,
  },
  optionLabel: {
    color: colors.white,
    fontFamily: "medium",
  },
  optionLabelActive: {
    color: colors.dark,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: colors.white,
    borderRadius: 30,
    color: colors.black,
    fontFamily: "regular",
    fontSize: 18,
  },
  addBtn: {
    width: 60,
    height: 60,
    backgroundColor: colors.accent,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TodoListScreen;
