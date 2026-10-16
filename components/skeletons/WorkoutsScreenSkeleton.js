// components/skeletons/WorkoutsScreenSkeleton.js
import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Skeleton from "../Skeleton";
import { COLORS, SIZES } from "../../constants/theme";

export default function WorkoutsScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} scrollEnabled={false}>
        {/* Header */}
        <View style={styles.header}>
          <Skeleton width={140} height={24} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>

        {/* Category tabs */}
        <View style={styles.tabsRow}>
          <Skeleton width={60} height={36} borderRadius={20} />
          <Skeleton width={90} height={36} borderRadius={20} />
          <Skeleton width={70} height={36} borderRadius={20} />
          <Skeleton width={90} height={36} borderRadius={20} />
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Skeleton width={130} height={20} style={{ marginBottom: 12 }} />
          <Skeleton
            height={180}
            borderRadius={20}
            style={{ marginBottom: 24 }}
          />

          <View style={styles.sectionHeader}>
            <Skeleton width={80} height={20} />
            <Skeleton width={80} height={14} />
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridItem}>
                <Skeleton height={160} borderRadius={16} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 16,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: SIZES.padding,
  },
  body: { paddingHorizontal: SIZES.padding, marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "48%", marginBottom: 14 },
});
