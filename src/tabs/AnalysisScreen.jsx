import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";

export default function AnalysisScreen() {
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState("system");
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [dateRange, setDateRange] = useState("month");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length) calculateTotals();
  }, [transactions, viewMode, dateRange]);

  // -----------------------------
  // Fetch Transactions
  // -----------------------------
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:4000/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // -----------------------------
  // Filter Transactions by Date
  // -----------------------------
  const filterByDateRange = (data) => {
    const now = new Date();
    const start = new Date();

    if (dateRange === "week") {
      start.setDate(now.getDate() - 7);
    } else if (dateRange === "month") {
      start.setMonth(now.getMonth() - 1);
    } else {
      return data;
    }

    return data.filter((tx) => new Date(tx.date) >= start);
  };

  // -----------------------------
  // Calculate Totals by Category
  // -----------------------------
  const calculateTotals = () => {
    const filtered = filterByDateRange(transactions);
    const field = viewMode === "system" ? "systemCategory" : "userCategory";

    const grouped = filtered.reduce((acc, tx) => {
      const key = tx[field] || "Uncategorized";
      acc[key] = (acc[key] || 0) + Number(tx.amount || 0);
      return acc;
    }, {});

    const data = Object.keys(grouped)
      .map((key) => ({ category: key, amount: grouped[key] }))
      .sort((a, b) => b.amount - a.amount);

    setCategoryTotals(data);
  };

  // -----------------------------
  // Derived Insights
  // -----------------------------
  const total = categoryTotals.reduce((sum, c) => sum + c.amount, 0);
  const topCategory = categoryTotals[0]?.category || "N/A";
  const leastCategory = categoryTotals.at(-1)?.category || "N/A";

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0d1a0d",
        padding: 16,
      }}
    >
      {/* Header */}
      <Text
        style={{
          color: "#b0f5b0",
          fontSize: 26,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Spending Analytics
      </Text>

      {/* Mode Switch */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "#1b2a1b",
          borderRadius: 25,
          marginBottom: 20,
          padding: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => setViewMode("system")}
          style={{
            flex: 1,
            backgroundColor: viewMode === "system" ? "#2e7d32" : "transparent",
            paddingVertical: 10,
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              color: viewMode === "system" ? "#fff" : "#b0f5b0",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            System Categories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setViewMode("user")}
          style={{
            flex: 1,
            backgroundColor: viewMode === "user" ? "#2e7d32" : "transparent",
            paddingVertical: 10,
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              color: viewMode === "user" ? "#fff" : "#b0f5b0",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            User Categories
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Range Filter */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        {["week", "month", "all"].map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => setDateRange(range)}
            style={{
              backgroundColor: dateRange === range ? "#2e7d32" : "#1b2a1b",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: dateRange === range ? "#fff" : "#b0f5b0",
                fontWeight: "600",
              }}
            >
              {range === "week"
                ? "This Week"
                : range === "month"
                ? "This Month"
                : "All Time"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Spending */}
      <View
        style={{
          backgroundColor: "#1b2a1b",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "#b0f5b0",
            textAlign: "center",
            fontSize: 16,
            marginBottom: 5,
          }}
        >
          Total Spending
        </Text>
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          KSH {total.toLocaleString()}
        </Text>
      </View>

      {/* Category Breakdown */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            color: "#b0f5b0",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 10,
          }}
        >
          Category Breakdown
        </Text>

        {categoryTotals.map((item, index) => {
          const percent = total ? (item.amount / total) * 100 : 0;
          return (
            <View key={index} style={{ marginBottom: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14 }}>
                  {item.category}
                </Text>
                <Text style={{ color: "#b0f5b0", fontWeight: "600" }}>
                  KSH {item.amount.toLocaleString()}
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: "#264d26",
                  borderRadius: 4,
                  marginTop: 5,
                }}
              >
                <View
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    backgroundColor: "#10b981",
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Insights */}
      <View
        style={{
          backgroundColor: "#1b2a1b",
          padding: 15,
          borderRadius: 15,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            color: "#b0f5b0",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 10,
          }}
        >
          Insights
        </Text>
        <Text style={{ color: "#fff", marginBottom: 5 }}>
          Top spending category: <Text style={{ color: "#b0f5b0" }}>{topCategory}</Text>
        </Text>
        <Text style={{ color: "#fff", marginBottom: 5 }}>
          Lowest spending category: <Text style={{ color: "#b0f5b0" }}>{leastCategory}</Text>
        </Text>
        <Text style={{ color: "#fff" }}>
          Tip: Review your top category to identify saving opportunities.
        </Text>
      </View>
    </ScrollView>
  );
}
