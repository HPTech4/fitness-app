// components/CircularProgress.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

export default function CircularProgress({
  size = 130,
  stepsProgress = 0,
  caloriesProgress = 0,
  activeProgress = 0,
}) {
  const ringGap = 6;                    // space between rings
  const strokeWidth = 10;
  const outerRadius = (size - strokeWidth) / 2;
  const middleRadius = outerRadius - strokeWidth - ringGap;
  const innerRadius = middleRadius - strokeWidth - ringGap;
  const center = size / 2;

  const clamp = (n) => Math.min(Math.max(n, 0), 100);

  const makeRing = (radius, progress, color) => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamp(progress) / 100) * circumference;
    return { circumference, offset, radius, color };
  };

  const outer = makeRing(outerRadius, stepsProgress, COLORS.primary);
  const middle = makeRing(middleRadius, caloriesProgress, '#4CAF50');
  const inner = makeRing(innerRadius, activeProgress, '#2196F3');

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background rings (light gray) */}
        <Circle stroke="#EEE" fill="none" cx={center} cy={center} r={outer.radius} strokeWidth={strokeWidth} />
        <Circle stroke="#EEE" fill="none" cx={center} cy={center} r={middle.radius} strokeWidth={strokeWidth} />
        <Circle stroke="#EEE" fill="none" cx={center} cy={center} r={inner.radius} strokeWidth={strokeWidth} />

        {/* Progress rings */}
        <Circle
          stroke={outer.color} fill="none"
          cx={center} cy={center} r={outer.radius} strokeWidth={strokeWidth}
          strokeDasharray={`${outer.circumference} ${outer.circumference}`}
          strokeDashoffset={outer.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <Circle
          stroke={middle.color} fill="none"
          cx={center} cy={center} r={middle.radius} strokeWidth={strokeWidth}
          strokeDasharray={`${middle.circumference} ${middle.circumference}`}
          strokeDashoffset={middle.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <Circle
          stroke={inner.color} fill="none"
          cx={center} cy={center} r={inner.radius} strokeWidth={strokeWidth}
          strokeDasharray={`${inner.circumference} ${inner.circumference}`}
          strokeDashoffset={inner.offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Center text — show overall completion (average) */}
      <View style={styles.centerContent}>
        <Text style={styles.progressText}>
          {Math.round((clamp(stepsProgress) + clamp(caloriesProgress) + clamp(activeProgress)) / 3)}%
        </Text>
        <Text style={styles.progressLabel}>today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  progressText: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  progressLabel: { fontSize: 11, color: COLORS.textSecondary },
});