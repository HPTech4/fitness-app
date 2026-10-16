// components/AnimatedButton.js
import React from "react";
import { StyleSheet, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { COLORS } from "../constants/theme";

export default function AnimatedButton({
  label,
  onPress,
  icon,
  iconRight,
  loading = false,
  disabled = false,
  variant = "primary", // 'primary' | 'secondary' | 'danger'
  style,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 14,
      stiffness: 200,
      mass: 0.6,
    });
  };

  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    danger: styles.danger,
  };
  const variantTextStyles = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    danger: styles.dangerText,
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.base,
          variantStyles[variant],
          isDisabled && { opacity: 0.5 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon && (
              <Ionicons
                name={icon}
                size={18}
                color={variant === "secondary" ? COLORS.text : "#fff"}
                style={{ marginRight: label ? 8 : 0 }}
              />
            )}
            {label ? (
              <Text style={[styles.label, variantTextStyles[variant]]}>
                {label}
              </Text>
            ) : null}
            {iconRight && (
              <Ionicons
                name={iconRight}
                size={18}
                color={variant === "secondary" ? COLORS.text : "#fff"}
                style={{ marginLeft: 8 }}
              />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  primary: { backgroundColor: COLORS.primary },
  secondary: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  danger: { backgroundColor: "#E53935" },
  label: { fontSize: 15, fontWeight: "bold" },
  primaryText: { color: "#fff" },
  secondaryText: { color: COLORS.text },
  dangerText: { color: "#fff" },
});
