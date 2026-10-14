// screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RoutineCard from '../components/RoutineCard';
import AddRoutineModal from '../components/AddRoutineModal';
import CircularProgress from '../components/CircularProgress';
import { fetchRoutines, toggleRoutine } from '../api/routineService';
import { fetchTodayStats, fetchStreak } from '../api/statsService';
import { COLORS, SIZES } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [streak, setStreak] = useState({ streak: 0, workedOutToday: false });

  const loadEverything = async () => {
    try {
      const [statsData, routinesData, streakData, storedUser] = await Promise.all([
        fetchTodayStats(),
        fetchRoutines(),
        fetchStreak(),
        AsyncStorage.getItem('user'),
      ]);
      setStats(statsData);
      setRoutines(routinesData || []);
      setStreak(streakData);
      if (storedUser) setUser(JSON.parse(storedUser).user);
    } catch (err) {
      console.error('Home load error:', err);
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEverything();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadEverything();
  };

  const handleToggleRoutine = async (routineId) => {
    setRoutines((prev) =>
      prev.map((r) => (r._id === routineId ? { ...r, completed: !r.completed } : r))
    );
    try {
      await toggleRoutine(routineId);
    } catch (err) {
      setRoutines((prev) =>
        prev.map((r) => (r._id === routineId ? { ...r, completed: !r.completed } : r))
      );
      Alert.alert('Could not update routine');
    }
  };

  const handleOpenRoutine = (routine) => {
    if (routine.workoutId) {
      navigation.navigate('WorkoutDetail', { workoutId: routine.workoutId });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const STEP_GOAL = stats?.stepGoal || 10000;
  const CALORIE_GOAL = 500;
  const ACTIVE_GOAL = 60;

  const stepsProgress = stats ? (stats.steps / STEP_GOAL) * 100 : 0;
  const caloriesProgress = stats ? (stats.calories / CALORIE_GOAL) * 100 : 0;
  const activeProgress = stats ? (stats.activeMinutes / ACTIVE_GOAL) * 100 : 0;

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Morning, {firstName}</Text>
            <View style={styles.greetingSubRow}>
              <Text style={styles.greetingSub}>Let's crush today</Text>
              <Ionicons name="flame" size={16} color={COLORS.primary} style={{ marginLeft: 6 }} />
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert('Coming soon')}>
              <Ionicons name="search-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert('Coming soon')}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS CARD */}
        <View style={styles.statsCard}>
          <CircularProgress
            size={130}
            stepsProgress={stepsProgress}
            caloriesProgress={caloriesProgress}
            activeProgress={activeProgress}
          />
          <View style={styles.statsInfo}>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.statLabel}>Steps</Text>
              <Text style={styles.statValue}>{(stats?.steps || 0).toLocaleString()}</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>{stats?.calories || 0} kcal</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.statLabel}>Active</Text>
              <Text style={styles.statValue}>{stats?.activeMinutes || 0} min</Text>
            </View>
          </View>
        </View>

        {/* STREAK BANNER */}
        <View style={styles.streakBanner}>
          <View style={styles.streakLeft}>
            <View style={styles.streakIconWrap}>
              <Ionicons name="flame" size={22} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakTitle}>
                {streak.streak > 0
                  ? `${streak.streak}-day streak!`
                  : 'Start your streak today'}
              </Text>
              <Text style={styles.streakSub}>
                {streak.workedOutToday
                  ? 'You already worked out today 🎉'
                  : streak.streak > 0
                  ? "Don't break it — do a quick session!"
                  : 'Complete any workout to begin.'}
              </Text>
            </View>
          </View>

          {!streak.workedOutToday && (
            <TouchableOpacity
              style={styles.streakCta}
              onPress={() => navigation.navigate('Workouts')}
            >
              <Text style={styles.streakCtaText}>Go</Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* DAILY ROUTINE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily routine</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {routines.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={40} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No routines yet</Text>
            <Text style={styles.emptySub}>
              Add a morning stretch or an evening workout to build your daily flow.
            </Text>
          </View>
        ) : (
          routines.map((item) => (
            <RoutineCard
              key={item._id}
              title={item.title}
              time={item.time}
              duration={item.duration}
              isCompleted={item.completed}
              iconName={item.iconName}
              onPress={() => handleOpenRoutine(item)}
              onToggle={() => handleToggleRoutine(item._id)}
            />
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <AddRoutineModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdded={(newRoutine) => setRoutines((prev) => [...prev, newRoutine])}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SIZES.padding, paddingTop: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  greetingSub: { fontSize: 13, color: COLORS.textSecondary },
  headerIcons: { flexDirection: 'row' },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 8,
  },

  // Stats card
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statsInfo: { flex: 1, marginLeft: 20, gap: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  statValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },

  // Streak banner
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F0',
    borderRadius: 18,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE0D1',
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  streakIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFE5D5',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  streakTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  streakSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  streakCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakCtaText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  // Add button
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },

  // Empty state
  emptyState: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: 28,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15, fontWeight: '700',
    color: COLORS.text, marginTop: 10,
  },
  emptySub: {
    fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: 6, lineHeight: 18,
  },
});