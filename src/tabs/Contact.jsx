import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import SmsAndroid from "react-native-get-sms-android";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ContactScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestSmsPermission();
  }, []);

  const requestSmsPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: "SMS Permission",
            message: "We need access to your SMS to read M-PESA messages.",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          fetchAllSms();
        } else {
          Alert.alert("Permission denied", "Cannot read messages.");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const parseMpesaSms = (body, timestamp) => {
    const amountMatch = body.match(/Ksh[\s]*([\d,]+\.\d{2}|\d+)/);
    const counterpartyMatch = body.match(/sent to ([A-Za-z\s]+)|from ([A-Za-z\s]+)/i);
    const balanceMatch = body.match(/Balance: Ksh[\s]*([\d,]+\.\d{2}|\d+)/);

    // Convert timestamp to readable date
    const dateObj = new Date(timestamp);
    const readableDate = dateObj.toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      transactionType: body.includes("sent to")
        ? "SENT"
        : body.includes("received")
        ? "RECEIVED"
        : "OTHER",
      amount: amountMatch ? amountMatch[1] : null,
      counterparty:
        counterpartyMatch?.[1] || counterpartyMatch?.[2] || "Unknown",
      balance: balanceMatch ? balanceMatch[1] : null,
      date: readableDate,
    };
  };

  // Fetch SMS from both inbox and sent
  const fetchAllSms = async () => {
    const boxes = ["inbox", "sent"];
    let allMessages = [];

    for (const box of boxes) {
      await new Promise((resolve) => {
        SmsAndroid.list(
          JSON.stringify({
            box,
            maxCount: 2000, 
          }),
          (fail) => {
            console.log("Failed to read SMS:", fail);
            resolve();
          },
          (count, smsList) => {
            try {
              const messages = JSON.parse(smsList);
              allMessages = allMessages.concat(messages);
              resolve();
            } catch (err) {
              console.log("Error parsing SMS:", err);
              resolve();
            }
          }
        );
      });
    }

    const mpesaMessages = allMessages
      .filter((msg) => msg.body && msg.body.includes("M-PESA"))
      .map((msg) => ({
        ...msg,
        parsed: parseMpesaSms(msg.body, msg.date),
      }));

    // Group by contact name
    const contactMap = {};
    mpesaMessages.forEach((msg) => {
      const name = msg.parsed.counterparty || "Unknown";
      if (!contactMap[name]) {
        contactMap[name] = {
          name,
          transactions: [],
        };
      }
      contactMap[name].transactions.push(msg.parsed);
    });

    setContacts(Object.values(contactMap));
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LinearGradient
      colors={["#059669", "#10b981", "#34d399"]}
      style={[styles.container, { paddingTop: insets.top + 10 }]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>M-PESA Contacts</Text>
        <Text style={styles.headerSubtitle}>
          View all people you’ve transacted with
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#059669" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contact..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {permissionGranted ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() =>
                navigation.navigate("ContactDetails", { contact: item })
              }
            >
              <Ionicons name="person-circle-outline" size={40} color="#059669" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactNumber}>
                  {item.transactions.length} transaction
                  {item.transactions.length > 1 ? "s" : ""}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No M-PESA contacts found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <Text style={styles.permissionText}>
          Grant SMS permission to view your M-PESA contacts.
        </Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  headerSubtitle: { color: "#e8f5e9", fontSize: 14, marginTop: 4 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  contactName: { fontSize: 16, fontWeight: "600", color: "#333" },
  contactNumber: { fontSize: 14, color: "#666", marginTop: 2 },
  emptyText: {
    color: "#f0fdf4",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
  permissionText: {
    textAlign: "center",
    color: "#fff",
    marginTop: 30,
    fontSize: 16,
  },
});
