// components/CircularProgress.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({
  size = 130,
  stepsProgress = 0,
  caloriesProgress = 0,
  activeProgress = 0,
}) {
  const ringGap = 6;
  const strokeWidth = 10;
  const outerRadius = (size - strokeWidth) / 2;
  const middleRadius = outerRadius - strokeWidth - ringGap;
  const innerRadius = middleRadius - strokeWidth - ringGap;
  const center = size / 2;

  const clamp = (n) => Math.min(Math.max(n, 0), 100);

  const outerCirc = 2 * Math.PI * outerRadius;
  const middleCirc = 2 * Math.PI * middleRadius;
  const innerCirc = 2 * Math.PI * innerRadius;

  const outerProgress = useSharedValue(0);
  const middleProgress = useSharedValue(0);
  const innerProgress = useSharedValue(0);

  useEffect(() => {
    outerProgress.value = withDelay(
      200,
      withTiming(clamp(stepsProgress), {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }),
    );
    middleProgress.value = withDelay(
      400,
      withTiming(clamp(caloriesProgress), {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }),
    );
    innerProgress.value = withDelay(
      600,
      withTiming(clamp(activeProgress), {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [stepsProgress, caloriesProgress, activeProgress]);

  const outerProps = useAnimatedProps(() => ({
    strokeDashoffset: outerCirc - (outerProgress.value / 100) * outerCirc,
  }));
  const middleProps = useAnimatedProps(() => ({
    strokeDashoffset: middleCirc - (middleProgress.value / 100) * middleCirc,
  }));
  const innerProps = useAnimatedProps(() => ({
    strokeDashoffset: innerCirc - (innerProgress.value / 100) * innerCirc,
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          stroke="#EEE"
          fill="none"
          cx={center}
          cy={center}
          r={outerRadius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#EEE"
          fill="none"
          cx={center}
          cy={center}
          r={middleRadius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#EEE"
          fill="none"
          cx={center}
          cy={center}
          r={innerRadius}
          strokeWidth={strokeWidth}
        />

        <AnimatedCircle
          stroke={COLORS.primary}
          fill="none"
          cx={center}
          cy={center}
          r={outerRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${outerCirc} ${outerCirc}`}
          animatedProps={outerProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <AnimatedCircle
          stroke="#4CAF50"
          fill="none"
          cx={center}
          cy={center}
          r={middleRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${middleCirc} ${middleCirc}`}
          animatedProps={middleProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <AnimatedCircle
          stroke="#2196F3"
          fill="none"
          cx={center}
          cy={center}
          r={innerRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${innerCirc} ${innerCirc}`}
          animatedProps={innerProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      <View style={styles.centerContent}>
        <Text style={styles.progressText}>Today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});
