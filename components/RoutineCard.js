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
        <Ionicons name={iconName || 'fitness'} size={20} color={COLORS.primary} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>
          {title}
        </Text>
        <Text style={styles.subtitle}>{time} • {duration}</Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onToggle} hitSlop={10}>
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={isCompleted ? COLORS.success : COLORS.primary}
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
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 15, fontWeight: '600',
    color: COLORS.text, marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  subtitle: { fontSize: 12, color: COLORS.textSecondary },
  actionButton: { padding: 4 },
});