import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";


const API_URL = "http://10.1.10.92:5000";


export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const handleSignup = async () => {
    const data = {
      username,
      phone_number,
      email,
      password,
      password_confirmation,
    };

    try {
      const response = await axios.post(`${API_URL}/user/signup`, data);
      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Signup Failed", error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <LinearGradient colors={['#00b894', '#10b981', '#059669']} style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Phone Number"
          keyboardType="number-pad"
          style={styles.input}
          value={phone_number}
          onChangeText={setPhoneNumber}
        />
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
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={password_confirmation}
          onChangeText={setPasswordConfirmation}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleSignup}>
          <Text style={styles.registerText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginSection}>
          <Text style={styles.loginQuestion}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Log in</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
  },
  input: {
    backgroundColor: "#b6e1d3ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#10b981",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginQuestion: {
    color: "#666",
    fontSize: 16,
  },
  loginLink: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
