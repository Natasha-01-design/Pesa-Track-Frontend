import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Button,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import SmsAndroid from "react-native-get-sms-android";

export default function DisplayMessages({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  const BACKEND_URL = "http://192.168.0.101:5000/save_message"; 
  //192.168.0.101:5000
  // * Running on http://192.168.0.101:5000
 
  // Request SMS permission
  const requestSmsPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: "SMS Permission",
            message:
              "App needs access to your SMS messages to analyze M-PESA transactions.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          fetchSmsMessages();
        } else {
          Alert.alert("Permission denied", "Cannot access SMS messages.");
        }
      } else {
        setPermissionGranted(true);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestSmsPermission();
  }, []);

  // Fetch and parse SMS
  const fetchSmsMessages = () => {
    setLoading(true);
    SmsAndroid.list(
      JSON.stringify({
        box: "inbox",
        maxCount: 2000,
      }),
      (fail) => {
        console.log("Failed to read SMS:", fail);
        Alert.alert("Error", "Failed to access your SMS messages.");
        setLoading(false);
      },
      async (count, smsList) => {
        try {
          const rawMessages = JSON.parse(smsList);

          const mpesaMessages = rawMessages
            .filter((msg) => msg.body && msg.body.includes("M-PESA"))
            .map((msg) => {
              const parsed = parseMpesaSms(msg.body, msg.date);
              return { ...msg, parsed };
            });

          console.log(`Fetched ${mpesaMessages.length} M-PESA messages`);
          setMessages(mpesaMessages);

          // Send to backend
          await sendToBackend(mpesaMessages);
        } catch (error) {
          console.error("Parsing error:", error);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Parse M-PESA message
  const parseMpesaSms = (body, timestamp) => {
    const amountMatch = body.match(/Ksh\s?([\d,]+\.\d{2})/);
    const balanceMatch = body.match(/(?:Balance(?:\s+is)?|M-PESA\s+balance(?:\s+is)?)[^K]*Ksh\s?([\d,]+\.\d{2})/i);
    const recipient = body.match(/to\s([A-Za-z\s]+)|from\s([A-Za-z\s]+)/i);

    let transactionType = "Transaction";
    if (body.includes("sent to")) transactionType = "SENT";
    else if (body.includes("received from")) transactionType = "RECEIVED";
    else if (body.includes("Pay Bill")) transactionType = "PAY BILL";
    else if (body.includes("Buy Goods")) transactionType = "BUY GOODS";

    const dateObj = new Date(timestamp);
    const readableDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD

    return {
      amount: amountMatch ? amountMatch[1] : null,
      balance: balanceMatch ? balanceMatch[1] : null,
      date: readableDate,
      recipient:
        recipient?.[1] || recipient?.[2] || "Unknown",
      transactionType,
    };
  };

  // Send messages to backend
  const sendToBackend = async (mpesaMessages) => {
    try {
      for (const msg of mpesaMessages) {
        const data = msg.parsed;
        if (!data.amount || !data.date) continue; // skip incomplete data

        const response = await fetch(BACKEND_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: data.amount,
            balance: data.balance,
            recipient: data.recipient,
            date: data.date,
            transactionType: data.transactionType,
          }),
        });

        if (!response.ok) {
          console.log(" Failed to send message:", data);
        } else {
          console.log("Sent to backend:", data);
        }
      }

      Alert.alert("Success", "All M-PESA messages uploaded successfully!");
    } catch (error) {
      console.error("Error sending to backend:", error);
      Alert.alert("Error", "Failed to send data to backend.");
    }
  };

  // Group messages by month/day for display
  const groupByMonthAndDay = (msgs) => {
    const grouped = {};
    msgs.forEach((msg) => {
      const dateStr = msg.parsed.date;
      if (!dateStr) return;

      const date = new Date(dateStr);
      const monthName = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const fullDate = date.toLocaleDateString("en-KE");

      if (!grouped[monthName]) grouped[monthName] = {};
      if (!grouped[monthName][fullDate]) grouped[monthName][fullDate] = [];
      grouped[monthName][fullDate].push(msg);
    });
    return grouped;
  };

  const groupedData = groupByMonthAndDay(messages);

  // UI
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 40 }} />
        ) : permissionGranted ? (
          Object.keys(groupedData).length > 0 ? (
            Object.entries(groupedData).map(([month, days], mIndex) => (
              <View key={mIndex}>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedMonth(expandedMonth === month ? null : month)
                  }
                >
                  <Text style={styles.monthTitle}>{month}</Text>
                </TouchableOpacity>

                {expandedMonth === month &&
                  Object.entries(days).map(([day, msgs], dIndex) => (
                    <View key={dIndex}>
                      <TouchableOpacity
                        onPress={() =>
                          setExpandedDay(expandedDay === day ? null : day)
                        }
                      >
                        <Text style={styles.dayTitle}>{day}</Text>
                      </TouchableOpacity>

                      {expandedDay === day &&
                        msgs.map((msg, index) => (
                          <View key={index} style={styles.card}>
                            <Text style={styles.title}>
                              {msg.parsed.transactionType}
                            </Text>
                            <Text style={styles.amount}>
                              Ksh {msg.parsed.amount || "N/A"}
                            </Text>
                            <Text style={styles.recipient}>
                              {msg.parsed.transactionType === "SENT"
                                ? `To: ${msg.parsed.recipient}`
                                : `From: ${msg.parsed.recipient}`}
                            </Text>
                            <Text style={styles.balance}>
                              Balance: Ksh {msg.parsed.balance || "N/A"}
                            </Text>
                            <Text style={styles.date}>Date: {msg.parsed.date}</Text>
                          </View>
                        ))}
                    </View>
                  ))}
              </View>
            ))
          ) : (
            <Text style={styles.noMessages}>No M-PESA messages found.</Text>
          )
        ) : (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              SMS access is required to display your M-PESA messages.
            </Text>
            <Button title="Grant Permission" onPress={requestSmsPermission} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
    marginVertical: 10,
    textTransform: "uppercase",
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#047857",
    marginLeft: 12,
    marginVertical: 6,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    marginLeft: 24,
    elevation: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  recipient: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },
  balance: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  noMessages: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    color: "#6b7280",
  },
  permissionContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#374151",
    marginBottom: 12,
  },
});
