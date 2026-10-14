// components/RecommendedCard.js
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function RecommendedCard({ title, subtitle, image, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.card}
        imageStyle={styles.image}
      >
        <View style={styles.overlay}>
          <View style={styles.textWrapper}>
            <Text style={styles.badge}>RECOMMENDED</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.playButton}>
            <Ionicons name="play" size={22} color="#fff" />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textWrapper: { flex: 1 },
  badge: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#DDD',
    fontSize: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});