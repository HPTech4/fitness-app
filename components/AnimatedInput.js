// components/AnimatedInput.js
import React, { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export default function AnimatedInput({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoFocus,
  style,
}) {
  const [focused, setFocused] = useState(false);

  const focusProgress = useSharedValue(0);

  const handleFocus = () => {
    setFocused(true);
    focusProgress.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  };

  const handleBlur = () => {
    setFocused(false);
    focusProgress.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  };

  const containerStyle = useAnimatedStyle(() => {
    const borderColor = focusProgress.value > 0.5 ? COLORS.primary : "#EEE";
    return {
      borderColor,
      borderWidth: 1 + focusProgress.value,
      transform: [{ scale: 1 + focusProgress.value * 0.01 }],
      shadowOpacity: focusProgress.value * 0.15,
    };
  });

  const labelStyle = useAnimatedStyle(() => ({
    color: focusProgress.value > 0.5 ? COLORS.primary : COLORS.textSecondary,
  }));

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
      )}
      <Animated.View style={[styles.container, containerStyle]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? COLORS.primary : COLORS.textSecondary}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || "none"}
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0,
    elevation: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
});
