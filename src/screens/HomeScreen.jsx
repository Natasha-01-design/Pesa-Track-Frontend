import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }) {
  const [loginPressed, setLoginPressed] = useState(false);
  const [registerPressed, setRegisterPressed] = useState(false);

  return (
    <LinearGradient
      colors={['#00b894', '#10b981', '#059669']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Hero Image */}
        <View style={styles.imageSection}>
          <Image
            source={require("../../assets/images/home.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Pesa-Tracker</Text>
          <Text style={styles.welcomeDescription}>
            This app will help you track your money and spending while also providing insight as per the spending to help you make wise money driven decisions.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton, loginPressed && styles.loginButtonPressed]}
            onPressIn={() => setLoginPressed(true)}
            onPressOut={() => setLoginPressed(false)}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton, registerPressed && styles.registerButtonPressed]}
            onPressIn={() => setRegisterPressed(true)}
            onPressOut={() => setRegisterPressed(false)}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={[styles.buttonText, styles.registerText]}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 80,
  },
  heroImage: {
    width: "100%",
    height: 350,
    borderRadius: 25,
  },
  welcomeSection: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0c452aff",
    textAlign: "center",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  welcomeDescription: {
    fontSize: 15,
    color: "#f0fff0",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
    opacity: 0.9,
  },
  buttonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 60,
    left: 30,
    right: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 8,
  },
  loginButton: {
    backgroundColor: "#ffffff",
  },
  loginButtonPressed: {
    backgroundColor: "#e8e8e8",
    transform: [{ scale: 0.98 }],
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  registerButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.3)",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    color: "#10b981",
  },
  registerText: {
    color: "#ffffff",
  },
});