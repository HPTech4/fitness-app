// screens/WorkoutPlayerScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { fetchWorkoutById } from '../api/workoutService';
import { logWorkoutSession } from '../api/sessionService';
import { COLORS, SIZES } from '../constants/theme';

export default function WorkoutPlayerScreen({ route, navigation }) {
  const { workoutId } = route.params;

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef(null);
  const elapsedRef = useRef(null);

  // ---------- LOAD WORKOUT ----------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWorkoutById(workoutId);
        setWorkout(data);
        const first = data.exercises[0];
        setTimeLeft(Number(first.duration) || 0);
      } catch (err) {
        console.error('Load workout error:', err);
        Alert.alert('Error', 'Could not load workout');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workoutId]);

  // ---------- TRACK TOTAL ELAPSED TIME ----------
  useEffect(() => {
    elapsedRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(elapsedRef.current);
  }, []);

  // ---------- COUNTDOWN TIMER ----------
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, timeLeft]);

  // ---------- HELPERS ----------
  const currentExercise = workout?.exercises[currentIndex];
  const totalExercises = workout?.exercises.length || 0;
  const progressPercent = totalExercises ? ((currentIndex + 1) / totalExercises) * 100 : 0;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const loadExercise = (index) => {
    const ex = workout.exercises[index];
    setCurrentIndex(index);
    setCurrentSet(1);
    setTimeLeft(Number(ex.duration) || 0);
    setIsRunning(false);
  };

  const handleNext = () => {
    if (currentIndex < totalExercises - 1) {
      loadExercise(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) loadExercise(currentIndex - 1);
  };

  const handleCompleteSet = () => {
    if (!currentExercise.sets) return;
    if (currentSet < currentExercise.sets) {
      setCurrentSet((s) => s + 1);
    } else {
      handleNext();
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await logWorkoutSession({
        workoutId: workout._id,
        durationCompleted: elapsedSeconds,
        caloriesBurned: workout.calories,
      });
      navigation.replace('WorkoutComplete', {
        workoutTitle: workout.title,
        durationCompleted: elapsedSeconds,
        caloriesBurned: workout.calories,
      });
    } catch (err) {
      Alert.alert('Save failed', err.response?.data?.message || err.message);
      setSaving(false);
    }
  };

  const handleQuit = () => {
    Alert.alert('Quit workout?', 'Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const isTimed = !!currentExercise.duration;
  const isRepBased = !!currentExercise.reps;

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleQuit} style={styles.iconBtn}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.progressText}>
          Exercise {currentIndex + 1} of {totalExercises}
        </Text>
        <View style={styles.iconBtn} />
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.main}>
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        <Text style={styles.exerciseSub}>
          {isRepBased
            ? `Set ${currentSet} of ${currentExercise.sets} · ${currentExercise.reps} reps`
            : `Rest ${currentExercise.restTime || 0}s after`}
        </Text>

        {isTimed ? (
          <TimedCircle
            timeLeft={timeLeft}
            total={currentExercise.duration}
            isRunning={isRunning}
          />
        ) : (
          <View style={styles.repCircle}>
            <Text style={styles.repBig}>{currentExercise.reps}</Text>
            <Text style={styles.repLabel}>reps</Text>
          </View>
        )}

        {/* CONTROLS */}
        {isTimed ? (
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setTimeLeft((t) => Math.max(0, t - 10))}
            >
              <Text style={styles.secondaryBtnText}>-10s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => setIsRunning((r) => !r)}
            >
              <Ionicons name={isRunning ? 'pause' : 'play'} size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setTimeLeft((t) => t + 10)}
            >
              <Text style={styles.secondaryBtnText}>+10s</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.repDoneBtn} onPress={handleCompleteSet}>
            <Ionicons name="checkmark" size={22} color="#fff" />
            <Text style={styles.repDoneText}>
              {currentSet < currentExercise.sets ? 'Complete set' : 'Next exercise'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentIndex === 0 ? '#BBB' : COLORS.text} />
          <Text style={[styles.navBtnText, currentIndex === 0 && { color: '#BBB' }]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtnPrimary} onPress={handleNext} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.navBtnPrimaryText}>
                {currentIndex === totalExercises - 1 ? 'Finish' : 'Next'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------- TIMED CIRCLE COMPONENT ----------
function TimedCircle({ timeLeft, total, isRunning }) {
  const size = 240;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? timeLeft / total : 0;
  const offset = circumference - progress * circumference;

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#EEE"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={COLORS.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: COLORS.text }}>
          {m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
        </Text>
        <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>
          {isRunning ? 'Running' : 'Paused'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingVertical: 12,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  progressText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  progressBarBg: {
    height: 4, backgroundColor: '#EEE', marginHorizontal: SIZES.padding, borderRadius: 2,
  },
  progressBarFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding },
  exerciseName: {
  fontSize: 26,
  fontWeight: '800',
  color: COLORS.text,
  textAlign: 'center',
  letterSpacing: -0.4,
},
  exerciseSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, marginBottom: 20 },
  repCircle: {
    width: 240, height: 240, borderRadius: 120,
    borderWidth: 14, borderColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginVertical: 20,
  },
  repBig: { fontSize: 72, fontWeight: 'bold', color: COLORS.text },
  repLabel: { fontSize: 16, color: COLORS.textSecondary, marginTop: -4 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 20 },
secondaryBtn: {
  paddingHorizontal: 18,
  paddingVertical: 12,
  backgroundColor: COLORS.card,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: COLORS.border,
},
  secondaryBtnText: { color: COLORS.text, fontWeight: '600' },
  playBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  repDoneBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 14, marginTop: 20,
  },
  repDoneText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#EEE',
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  navBtnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14,
    minWidth: 120, justifyContent: 'center',
  },
  navBtnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});