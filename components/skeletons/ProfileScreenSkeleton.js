// components/skeletons/ProfileScreenSkeleton.js
import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Skeleton from "../Skeleton";
import { COLORS, SIZES } from "../../constants/theme";

export default function ProfileScreenSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} scrollEnabled={false}>
        {/* Avatar + name */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Skeleton width={100} height={100} borderRadius={50} />
          <Skeleton width={140} height={22} style={{ marginTop: 14 }} />
          <Skeleton width={200} height={14} style={{ marginTop: 8 }} />
        </View>

        {/* Menu */}
        <Skeleton height={280} borderRadius={20} style={{ marginBottom: 20 }} />

        {/* Logout button */}
        <Skeleton height={52} borderRadius={16} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SIZES.padding, paddingTop: 20 },
});
