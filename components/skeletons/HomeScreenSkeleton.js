// components/skeletons/HomeScreenSkeleton.js
import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Skeleton from "../Skeleton";
import { COLORS, SIZES } from "../../constants/theme";

export default function HomeScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} scrollEnabled={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Skeleton width={140} height={24} />
            <Skeleton width={100} height={14} style={{ marginTop: 8 }} />
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <Skeleton width={40} height={40} borderRadius={20} />
          </View>
        </View>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <Skeleton width={130} height={130} borderRadius={65} />
          <View style={{ flex: 1, marginLeft: 20, gap: 12 }}>
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} />
          </View>
        </View>

        {/* Streak banner */}
        <Skeleton height={68} borderRadius={18} style={{ marginBottom: 24 }} />

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Skeleton width={120} height={20} />
          <Skeleton width={60} height={28} borderRadius={20} />
        </View>

        {/* Routine cards */}
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            height={74}
            borderRadius={16}
            style={{ marginBottom: 12 }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SIZES.padding, paddingTop: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
});
