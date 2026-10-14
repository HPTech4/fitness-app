// screens/WorkoutCompleteScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

export default function WorkoutCompleteScreen({ route, navigation }) {
  const { workoutTitle, durationCompleted, caloriesBurned } = route.params;

  const minutes = Math.floor(durationCompleted / 60);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="trophy" size={60} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Workout complete!</Text>
        <Text style={styles.subtitle}>Great job finishing {workoutTitle}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{minutes}</Text>
            <Text style={styles.statLabel}>minutes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{caloriesBurned}</Text>
            <Text style={styles.statLabel}>kcal</Text>
          </View>
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.primaryBtnText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  badge: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 32, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 16 },
  statBox: {
    backgroundColor: COLORS.card, borderRadius: 16,
    paddingHorizontal: 28, paddingVertical: 20, alignItems: 'center',
    minWidth: 120,
  },
  statValue: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  ctaContainer: { padding: SIZES.padding },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});