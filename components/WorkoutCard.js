// components/WorkoutCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function WorkoutCard({ title, duration, level, image, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={11} color="#fff" />
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.levelDot} />
          <Text style={styles.level}>{level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrapper: {
    height: 110,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  level: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});