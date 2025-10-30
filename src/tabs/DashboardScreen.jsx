import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Replace this with your actual backend API endpoint
  const API_URL = "http://192.168.0.105:5000"; 
  // Example: "http://192.168.0.101:5000/api/dashboard"

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#00b894", "#10b981", "#059669"]} style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "white", marginTop: 10 }}>Loading Dashboard...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!userData) {
    return (
      <LinearGradient colors={["#00b894", "#10b981", "#059669"]} style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white" }}>Failed to load dashboard data.</Text>
        </View>
      </LinearGradient>
    );
  }

  const { name, balance, totalTransactions, recentTransactions } = userData;

  return (
    <LinearGradient colors={["#00b894", "#10b981", "#059669"]} style={styles.container}>
      <ScrollView style={styles.content}>
        
        
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {name}!</Text>
          <Text style={styles.subtitle}>Welcome back to Pesa-Tracker</Text>
        </View>

      
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>KSh {balance.toLocaleString()}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalTransactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>

        {/* 🔹 RECENT TRANSACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((txn, index) => (
              <View key={index} style={styles.transactionCard}>
                <Text style={styles.transactionText}>
                  {txn.sender} - KSh {txn.amount.toLocaleString()}
                </Text>
                <Text style={styles.transactionDate}>
                  {txn.date}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#fff" }}>No recent transactions.</Text>
          )}
        </View>

      
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("Transactions")}
          >
            <Text style={styles.actionText}>View All Transactions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("Analytics")}
          >
            <Text style={styles.actionText}>Analyze Spending</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#e8f5e8",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  transactionCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
});
