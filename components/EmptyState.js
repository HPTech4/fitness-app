// components/EmptyState.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants/theme";

export default function EmptyState({
  icon = "sparkles-outline",
  title = "Nothing here yet",
  subtitle = "Come back later.",
  actionLabel,
  onAction,
  variant = "card", // 'card' | 'full'
}) {
  const isFull = variant === "full";

  return (
    <View style={[styles.container, isFull && styles.containerFull]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={COLORS.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: 32,
    alignItems: "center",
  },
  containerFull: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF0EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
