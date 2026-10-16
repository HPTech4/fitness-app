// components/SocialButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function SocialButton({ provider, onPress }) {
  const config = {
    google: { icon: 'logo-google', label: 'Google', color: '#DB4437' },
    apple: { icon: 'logo-apple', label: 'Apple', color: '#000' },
  }[provider];

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={config.icon} size={20} color={config.color} />
      <Text style={styles.label}>{config.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});