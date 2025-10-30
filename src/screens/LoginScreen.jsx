import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

const API_URL = "http://10.1.10.92:5000";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("Navigation prop:", navigation);
  }, []);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, { email, password });
      const token = response.data.access_token;

      // Save JWT token securely
      await SecureStore.setItemAsync("userToken", token);

      Alert.alert("Login Successful", "Welcome back!");
      //navigation.navigate("Home"); 
      navigation.navigate( "MainApp")
    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <LinearGradient colors={["#00b894", "#10b981", "#059669"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.subtitle}>Welcome back! We've missed you</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.registerSection}>
          <Text style={styles.registerQuestion}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.registerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#e8f5e8",
    textAlign: "center",
    fontStyle: "italic",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
  },
  input: {
    backgroundColor: "#aae2cdff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#10b981",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerQuestion: {
    color: "#719487ff",
    fontSize: 16,
  },
  registerLink: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
