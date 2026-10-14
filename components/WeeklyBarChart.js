// components/WeeklyBarChart.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function WeeklyBarChart({ data = [], goal = 500, highlightLast = true }) {
  const maxValue = Math.max(goal, ...data.map((d) => d.calories || 0), 1);

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {data.map((item, idx) => {
          const heightPercent = (item.calories / maxValue) * 100;
          const isLast = idx === data.length - 1;
          const isHighlighted = highlightLast && isLast;
          return (
            <View key={item.date || item.label || idx} style={styles.barColumn}>
              <Text style={styles.barValue}>
                {item.calories > 0 ? item.calories : ''}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(heightPercent, 4)}%`,
                      backgroundColor: isHighlighted ? COLORS.primary : '#FFC6B0',
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.dayLabel, isHighlighted && styles.dayLabelToday]}
                numberOfLines={1}
              >
                {item.dayLabel || item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
  },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
    height: 14,
  },
  barTrack: {
    width: 18,
    height: 130,
    backgroundColor: '#F5F5F5',
    borderRadius: 9,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 9 },
  dayLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
  dayLabelToday: { color: COLORS.primary, fontWeight: 'bold' },
});