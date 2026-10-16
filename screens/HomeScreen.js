// screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import RoutineCard from '../components/RoutineCard';
import AddRoutineModal from '../components/AddRoutineModal';
import CircularProgress from '../components/CircularProgress';
import CountUpText from '../components/CountUpText';
import HomeScreenSkeleton from '../components/skeletons/HomeScreenSkeleton';
import EmptyState from '../components/EmptyState';
import { fetchRoutines, toggleRoutine } from '../api/routineService';
import { fetchTodayStats, fetchStreak } from '../api/statsService';
import { COLORS, SIZES } from '../constants/theme';
import { getGreeting, getGreetingIcon, getTodayLabel } from '../constants/dates';

// ---------------------------------------------------------------------------
// Animation wrappers
// ---------------------------------------------------------------------------
function FadeInUp({ delay = 0, children }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

function SlideInRight({ delay = 0, children }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(30);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

// ---------------------------------------------------------------------------
// Home screen
// ---------------------------------------------------------------------------
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
    return <HomeScreenSkeleton />;
  }

  const STEP_GOAL = stats?.stepGoal || 10000;
  const CALORIE_GOAL = 500;
  const ACTIVE_GOAL = 60;

  const stepsProgress = stats ? (stats.steps / STEP_GOAL) * 100 : 0;
  const caloriesProgress = stats ? (stats.calories / CALORIE_GOAL) * 100 : 0;
  const activeProgress = stats ? (stats.activeMinutes / ACTIVE_GOAL) * 100 : 0;

  const firstName = user?.name?.split(' ')[0] || 'there';
  const completedRoutines = routines.filter((r) => r.completed).length;
  const greeting = getGreeting();
  const greetingIcon = getGreetingIcon();
  const todayLabel = getTodayLabel();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* ================= HEADER ================= */}
        <FadeInUp delay={0}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={styles.dateChip}>
                <Ionicons name="calendar-outline" size={11} color={COLORS.textSecondary} />
                <Text style={styles.dateChipText}>{todayLabel}</Text>
              </View>

              <View style={styles.greetingRow}>
                <Text style={styles.greeting}>
                  {greeting}, {firstName}
                </Text>
                <Ionicons
                  name={greetingIcon}
                  size={22}
                  color={COLORS.primary}
                  style={{ marginLeft: 8 }}
                />
              </View>
              <Text style={styles.greetingSub}>Let's crush today's goals.</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => Alert.alert('Coming soon')}
              >
                <Ionicons name="search-outline" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => Alert.alert('Coming soon')}
              >
                <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </FadeInUp>

        {/* ================= STATS CARD ================= */}
        <FadeInUp delay={100}>
          <View style={styles.statsCard}>
            <View style={styles.statsCardHeader}>
              <View>
                <Text style={styles.statsCardLabel}>Today's activity</Text>
                <Text style={styles.statsCardSub}>Keep it up!</Text>
              </View>
              <View style={styles.statsCardBadge}>
                <Ionicons name="flash" size={12} color={COLORS.primary} />
                <Text style={styles.statsCardBadgeText}>Live</Text>
              </View>
            </View>

            <View style={styles.statsCardBody}>
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
                  <CountUpText value={stats?.steps || 0} style={styles.statValue} />
                </View>
                <View style={styles.statRow}>
                  <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
                  <Text style={styles.statLabel}>Calories</Text>
                  <CountUpText
                    value={stats?.calories || 0}
                    style={styles.statValue}
                    suffix=" kcal"
                  />
                </View>
                <View style={styles.statRow}>
                  <View style={[styles.dot, { backgroundColor: COLORS.info }]} />
                  <Text style={styles.statLabel}>Active</Text>
                  <CountUpText
                    value={stats?.activeMinutes || 0}
                    style={styles.statValue}
                    suffix=" min"
                  />
                </View>
              </View>
            </View>
          </View>
        </FadeInUp>

        {/* ================= STREAK BANNER ================= */}
        <FadeInUp delay={200}>
          <View style={styles.streakBanner}>
            <View style={styles.streakIconWrap}>
              <Ionicons name="flame" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakTitle}>
                {streak.streak > 0
                  ? `${streak.streak}-day streak`
                  : 'Start your streak'}
              </Text>
              <View style={styles.streakSubRow}>
                <Text style={styles.streakSub} numberOfLines={1}>
                  {streak.workedOutToday
                    ? 'Workout done today'
                    : streak.streak > 0
                      ? "Don't break the chain"
                      : 'Complete any workout'}
                </Text>
                {streak.workedOutToday && (
                  <Ionicons
                    name="checkmark-circle"
                    size={13}
                    color="#fff"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
            </View>

            {!streak.workedOutToday && (
              <TouchableOpacity
                style={styles.streakCta}
                onPress={() => navigation.navigate('Workouts')}
              >
                <Text style={styles.streakCtaText}>Go</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </FadeInUp>

        {/* ================= DAILY ROUTINE ================= */}
        <FadeInUp delay={300}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Daily routine</Text>
              {routines.length > 0 && (
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>
                    {completedRoutines}/{routines.length}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={14} color="#fff" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </FadeInUp>

        {routines.length === 0 ? (
          <FadeInUp delay={400}>
            <EmptyState
              icon="calendar-outline"
              title="No routines yet"
              subtitle="Add a morning stretch or an evening workout to build your daily flow."
              actionLabel="Add routine"
              onAction={() => setModalVisible(true)}
            />
          </FadeInUp>
        ) : (
          routines.map((item, index) => (
            <SlideInRight key={item._id} delay={400 + index * 60}>
              <RoutineCard
                title={item.title}
                time={item.time}
                duration={item.duration}
                isCompleted={item.completed}
                iconName={item.iconName}
                onPress={() => handleOpenRoutine(item)}
                onToggle={() => handleToggleRoutine(item._id)}
              />
            </SlideInRight>
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

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SIZES.padding, paddingTop: 16 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: SIZES.h1,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  greetingSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  headerIcons: { flexDirection: 'row', marginTop: 4 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Stats card
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.borderRadius,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statsCardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  statsCardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statsCardBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsInfo: { flex: 1, marginLeft: 20, gap: 14 },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  statValue: { fontSize: 13, fontWeight: '800', color: COLORS.text },

  // Streak banner
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: 16,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  streakIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  streakTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },
  streakSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  streakSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  streakCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  streakCtaText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  sectionBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});