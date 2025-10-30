import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function ContactDetails({ route }) {
  const { contact } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{contact.name}</Text>
      <Text style={styles.subHeader}>
        {contact.transactions.length} total transactions
      </Text>

      <FlatList
        data={contact.transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.type}>
              {item.transactionType === "SENT" ? "Sent" : "Received"}
            </Text>
            <Text style={styles.amount}>Ksh {item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", color: "#059669" },
  subHeader: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  type: { color: "#059669", fontWeight: "bold" },
  amount: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  date: { color: "#6b7280", fontSize: 12, marginTop: 4 },
});

