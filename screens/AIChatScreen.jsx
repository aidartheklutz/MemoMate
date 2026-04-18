import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { colors } from "./assets/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const OPENROUTER_API_KEY =
  "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";
const MODEL = "deepseek/deepseek-chat";

function AIChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Здравствуйте! Я ваш помощник MemoMate. О чем вы хотели бы поговорить или что вам напомнить?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({ todos: [], contacts: [] });
  const flatListRef = useRef();

  useEffect(() => {
    loadUserContext();
  }, []);

  const loadUserContext = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("@todo_list");
      const storedContacts = await AsyncStorage.getItem("@phone_book");

      setContext({
        todos: storedTodos ? JSON.parse(storedTodos) : [],
        contacts: storedContacts ? JSON.parse(storedContacts) : [],
      });
    } catch (e) {
      console.error("Failed to load context for AI", e);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Refresh context before sending
      await loadUserContext();

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://memomate.app", // Optional
            "X-Title": "MemoMate", // Optional
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content: `Вы — MemoMate, терпеливый и заботливый помощник для пожилых людей с проблемами памяти (деменцией). 
              Ваша цель — помогать им вспоминать важные вещи, отвечать на вопросы и просто поддерживать беседу спокойным, дружелюбным тоном.
              Используйте простые предложения и ясный русский язык. 
              
              Вот текущие данные пользователя для контекста:
              - Список дел: ${context.todos.map((t) => `${t.text} (${t.completed ? "завершено" : "нужно сделать"})`).join(", ") || "Список пуст"}
              - Контакты: ${context.contacts.map((c) => `${c.name} (${c.phone})`).join(", ") || "Контакты не добавлены"}
              
              Если пользователь спрашивает о планах или людях, используйте эти данные. Если он чего-то не помнит, мягко напомните ему на основе этой информации.`,
              },
              ...messages.map((m) => ({
                role: m.sender === "ai" ? "assistant" : "user",
                content: m.text,
              })),
              { role: "user", content: input },
            ],
          }),
        },
      );

      const data = await response.json();
      const aiText = data.choices[0].message.content;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Request Failed", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Извините, сейчас я не могу ответить. Попробуйте еще раз позже.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const parseText = (text, isUser) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const content = part.slice(2, -2);
        return (
          <Text
            key={index}
            style={[styles.boldText, isUser ? styles.userBold : styles.aiBold]}
          >
            "{content}"
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageWrapper,
        item.sender === "user" ? styles.userWrapper : styles.aiWrapper,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === "user" ? styles.userText : styles.aiText,
          ]}
        >
          {parseText(item.text, item.sender === "user")}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent} size="small" />
          <Text style={styles.loadingText}>Минутку, я думаю...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Напишите здесь..."
          placeholderTextColor={colors.gray}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={24} color={colors.white} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageWrapper: {
    marginBottom: 20,
    maxWidth: "85%",
  },
  userWrapper: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  aiWrapper: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  userBubble: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 20,
    fontFamily: "medium",
    lineHeight: 26,
  },
  userText: {
    color: colors.dark,
  },
  aiText: {
    color: colors.white,
  },
  timestamp: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
    fontFamily: "regular",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  loadingText: {
    color: colors.gray,
    fontFamily: "italic",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 18,
    fontFamily: "regular",
    color: colors.black,
    maxHeight: 100,
  },
  sendBtn: {
    width: 50,
    height: 50,
    backgroundColor: colors.accent,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  boldText: {
    fontFamily: "bold",
  },
  aiBold: {
    color: colors.accent,
  },
  userBold: {
    color: colors.white,
  },
});

export default AIChatScreen;
