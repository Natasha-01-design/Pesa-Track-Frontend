import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.option}>
        <Text style={styles.label}>Currency</Text>
        <Text style={styles.value}>KSh</Text>
      </View>
      <View style={styles.option}>
        <Text style={styles.label}>Language</Text>
        <Text style={styles.value}>English</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, color: "#10b981" },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: { fontSize: 16, color: "#333" },
  value: { fontSize: 16, color: "#10b981", fontWeight: "500" },
});
