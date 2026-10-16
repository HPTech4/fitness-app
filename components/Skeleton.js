// components/Skeleton.js
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}) {
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(200, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.base, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#E8E8E8",
    overflow: "hidden",
  },
  shimmer: {
    width: 120,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
