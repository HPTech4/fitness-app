// components/skeletons/StatsScreenSkeleton.js
import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Skeleton from "../Skeleton";
import { COLORS, SIZES } from "../../constants/theme";

export default function StatsScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} scrollEnabled={false}>
        <Skeleton width={140} height={24} style={{ marginBottom: 20 }} />

        {/* Tabs */}
        <Skeleton height={44} borderRadius={14} style={{ marginBottom: 20 }} />

        {/* Goal card */}
        <Skeleton height={120} borderRadius={20} style={{ marginBottom: 20 }} />

        {/* Chart */}
        <Skeleton height={220} borderRadius={20} style={{ marginBottom: 20 }} />

        {/* Two summary cards */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Skeleton height={130} borderRadius={20} style={{ flex: 1 }} />
          <Skeleton height={130} borderRadius={20} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SIZES.padding, paddingTop: 20 },
});
