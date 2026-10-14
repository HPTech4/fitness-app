// screens/StatsScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import WeeklyBarChart from '../components/WeeklyBarChart';
import {
  fetchTodayStats,
  fetchRangeStats,
} from '../api/statsService';
import { COLORS, SIZES } from '../constants/theme';

const CALORIE_GOAL = 500;
const ACTIVE_GOAL = 60;
const WEEK_GOAL = 5;

export default function StatsScreen() {
  const [range, setRange] = useState('Week'); // 'Day' | 'Week' | 'Month'
  const [data, setData] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (rangeKey = range) => {
    try {
      setLoading(true);

      if (rangeKey === 'Day') {
        const today = await fetchTodayStats();
        setTodayStats(today);
      } else {
        const days = rangeKey === 'Week' ? 7 : 30;
        const fetched = await fetchRangeStats(days);
        setData(fetched);
      }
    } catch (err) {
      console.error('Stats load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats(range);
    }, [range])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadStats(range);
  };

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    loadStats(newRange);
  };

  // Aggregate for Month view — 4 weekly buckets
  const monthBuckets = (() => {
    if (range !== 'Month' || data.length === 0) return [];
    const buckets = [];
    for (let i = 0; i < 4; i++) {
      const slice = data.slice(i * 7, i * 7 + 7);
      if (slice.length === 0) break;
      const calories = slice.reduce((s, d) => s + d.calories, 0);
      buckets.push({
        label: `W${i + 1}`,
        calories,
        date: `w${i}`,
      });
    }
    return buckets;
  })();

  if (loading && data.length === 0 && !todayStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ---- DAY VIEW ----
  const renderDayView = () => {
    const s = todayStats || {};
    const calPct = Math.min(((s.calories || 0) / CALORIE_GOAL) * 100, 100);
    const minPct = Math.min(((s.activeMinutes || 0) / ACTIVE_GOAL) * 100, 100);

    return (
      <>
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Today's progress</Text>

          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Calories</Text>
            <Text style={styles.goalValue}>
              {s.calories || 0} / {CALORIE_GOAL} kcal
            </Text>
          </View>
          <View style={styles.goalTrack}>
            <View style={[styles.goalFill, { width: `${calPct}%`, backgroundColor: COLORS.primary }]} />
          </View>

          <View style={[styles.goalRow, { marginTop: 16 }]}>
            <Text style={styles.goalLabel}>Active minutes</Text>
            <Text style={styles.goalValue}>
              {s.activeMinutes || 0} / {ACTIVE_GOAL} min
            </Text>
          </View>
          <View style={styles.goalTrack}>
            <View style={[styles.goalFill, { width: `${minPct}%`, backgroundColor: '#4CAF50' }]} />
          </View>

          <View style={[styles.goalRow, { marginTop: 16 }]}>
            <Text style={styles.goalLabel}>Steps</Text>
            <Text style={styles.goalValue}>
              {(s.steps || 0).toLocaleString()} / {(s.stepGoal || 10000).toLocaleString()}
            </Text>
          </View>
          <View style={styles.goalTrack}>
            <View
              style={[
                styles.goalFill,
                {
                  width: `${Math.min(((s.steps || 0) / (s.stepGoal || 10000)) * 100, 100)}%`,
                  backgroundColor: '#2196F3',
                },
              ]}
            />
          </View>
        </View>
      </>
    );
  };

  // ---- WEEK / MONTH VIEW ----
  const weeklyData = range === 'Week' ? data : monthBuckets;
  const totalCalories = data.reduce((sum, d) => sum + (d.calories || 0), 0);
  const totalMinutes = data.reduce((sum, d) => sum + (d.activeMinutes || 0), 0);
  const activeDays = data.filter((d) => d.calories > 0).length;

  const renderRangeView = () => (
    <>
      {/* Weekly workouts card — only for Week */}
      {range === 'Week' && (
        <View style={styles.workoutsCard}>
          <Text style={styles.workoutsLabel}>Workouts this week</Text>
          <View style={styles.workoutsRow}>
            <Text style={styles.workoutsBig}>{activeDays}</Text>
            <Text style={styles.workoutsSub}>/ {WEEK_GOAL} goal</Text>
          </View>
          <View style={styles.goalTrack}>
            <View
              style={[
                styles.goalFill,
                { width: `${Math.min((activeDays / WEEK_GOAL) * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.goalHint}>
            {activeDays >= WEEK_GOAL
              ? '🎉 Goal reached!'
              : `${WEEK_GOAL - activeDays} to go — keep pushing!`}
          </Text>
        </View>
      )}

      {/* Bar chart */}
      <Text style={styles.chartTitle}>
        {range === 'Week' ? 'Calories — last 7 days' : 'Calories — last 4 weeks'}
      </Text>
      <WeeklyBarChart data={weeklyData} goal={CALORIE_GOAL} />

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#FFF0EB' }]}>
            <Ionicons name="flame" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.summaryValue}>{totalCalories}</Text>
          <Text style={styles.summaryLabel}>
            kcal {range === 'Week' ? 'this week' : 'this month'}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="time" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.summaryValue}>{totalMinutes}</Text>
          <Text style={styles.summaryLabel}>active minutes</Text>
        </View>
      </View>

      {range === 'Month' && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="calendar" size={20} color="#2196F3" />
            </View>
            <Text style={styles.summaryValue}>{activeDays}</Text>
            <Text style={styles.summaryLabel}>active days</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="trending-up" size={20} color="#9C27B0" />
            </View>
            <Text style={styles.summaryValue}>
              {activeDays > 0 ? Math.round(totalCalories / activeDays) : 0}
            </Text>
            <Text style={styles.summaryLabel}>avg kcal / active day</Text>
          </View>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
        </View>

        {/* RANGE TABS */}
        <View style={styles.tabsRow}>
          {['Day', 'Week', 'Month'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, range === tab && styles.tabActive]}
              onPress={() => handleRangeChange(tab)}
            >
              <Text style={[styles.tabText, range === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {range === 'Day' ? renderDayView() : renderRangeView()}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: SIZES.padding, paddingTop: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#fff' },

  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },

  // Workouts card
  workoutsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  workoutsLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  workoutsRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  workoutsBig: { fontSize: 32, fontWeight: 'bold', color: COLORS.text },
  workoutsSub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 6, marginLeft: 6 },
  goalTrack: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  goalHint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 10 },

  // Day view
  goalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  goalTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  goalValue: { fontSize: 13, color: COLORS.text, fontWeight: '700' },

  // Summary
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 20,
    padding: 16, alignItems: 'center',
  },
  summaryIcon: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  summaryValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  summaryLabel: {
    fontSize: 11, color: COLORS.textSecondary,
    marginTop: 4, textAlign: 'center',
  },
});