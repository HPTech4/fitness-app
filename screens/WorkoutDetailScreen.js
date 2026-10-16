// screens/WorkoutDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchWorkoutById } from '../api/workoutService';
import { COLORS, SIZES } from '../constants/theme';

export default function WorkoutDetailScreen({ route, navigation }) {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWorkoutById(workoutId);
        setWorkout(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workoutId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'Workout not found'}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HERO IMAGE */}
        <View style={styles.hero}>
          <Image source={{ uri: workout.image }} style={styles.heroImage} />
          <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
  <Ionicons name="arrow-back" size={20} color="#fff" />
</TouchableOpacity>
        </View>

        {/* BODY */}
        <View style={styles.body}>
          <Text style={styles.category}>{workout.category.toUpperCase()}</Text>
          <Text style={styles.title}>{workout.title}</Text>
          {workout.description ? (
            <Text style={styles.description}>{workout.description}</Text>
          ) : null}

          {/* META */}
          <View style={styles.metaRow}>
            <View style={styles.metaRow}>
  <View style={styles.metaChip}>
    <Ionicons name="time-outline" size={15} color={COLORS.primary} />
    <Text style={styles.metaChipText}>{workout.duration} min</Text>
  </View>
  <View style={styles.metaChip}>
    <Ionicons name="flame-outline" size={15} color={COLORS.primary} />
    <Text style={styles.metaChipText}>{workout.calories} kcal</Text>
  </View>
  <View style={styles.metaChip}>
    <Ionicons name="speedometer-outline" size={15} color={COLORS.primary} />
    <Text style={styles.metaChipText}>{workout.level}</Text>
  </View>
</View>
          </View>

          {/* EXERCISES */}
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((ex, i) => (
            <View key={i} style={styles.exerciseCard}>
              <View style={styles.exerciseIndex}>
                <Text style={styles.exerciseIndexText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {ex.sets && ex.reps
                    ? `${ex.sets} sets × ${ex.reps} reps`
                    : ex.duration
                    ? `${ex.duration}s`
                    : ''}
                  {ex.restTime ? ` · ${ex.restTime}s rest` : ''}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* STICKY CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('WorkoutPlayer', { workoutId: workout._id })}
        >
          <Ionicons name="play" size={18} color="#fff" />
          <Text style={styles.ctaText}>Start workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: COLORS.text, fontSize: 16, marginBottom: 20 },
  backBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.primary, borderRadius: 12 },
  backBtnText: { color: '#fff', fontWeight: 'bold' },
  hero: { height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  backIcon: {
    position: 'absolute', top: 20, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  body: { padding: SIZES.padding, marginTop: -20, backgroundColor: COLORS.background, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  category: { color: COLORS.primary, fontWeight: '800', fontSize: 11, letterSpacing: 1, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  description: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 20 },
metaRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
metaChip: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
  backgroundColor: COLORS.primarySoft,
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 12,
},
metaChipText: { fontSize: 12, color: COLORS.text, fontWeight: '700' },
  sectionTitle: {
  fontSize: 18,
  fontWeight: '800',
  color: COLORS.text,
  marginBottom: 12,
  letterSpacing: -0.3,
},
  exerciseCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 14,
    padding: 14, marginBottom: 10,
  },
  exerciseIndex: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  exerciseIndexText: { color: COLORS.primary, fontWeight: 'bold' },
  exerciseName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  exerciseMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  ctaContainer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: '#EEE',
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});