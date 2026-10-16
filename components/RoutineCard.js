// components/RoutineCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

export default function RoutineCard({
  title, time, duration, isCompleted, iconName, onPress, onToggle,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={iconName || 'fitness'}
          size={20}
          color={isCompleted ? COLORS.success : COLORS.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[styles.title, isCompleted && styles.completedText]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={11} color={COLORS.textSecondary} />
          <Text style={styles.subtitle}>
            {time} · {duration}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkBtn,
          isCompleted && styles.checkBtnActive,
        ]}
        onPress={onToggle}
        hitSlop={10}
      >
        <Ionicons
          name={isCompleted ? 'checkmark' : 'play'}
          size={16}
          color={isCompleted ? '#fff' : COLORS.primary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  checkBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkBtnActive: {
    backgroundColor: COLORS.success,
  },
});