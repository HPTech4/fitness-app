// screens/WorkoutsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity,
  ActivityIndicator, RefreshControl, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import CategoryTabs from '../components/CategoryTabs';
import RecommendedCard from '../components/RecommendedCard';
import WorkoutCard from '../components/WorkoutCard';
import { fetchWorkouts } from '../api/workoutService';
import { COLORS, SIZES } from '../constants/theme';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Mobility'];

export default function WorkoutsScreen({ navigation }) {
  const [category, setCategory] = useState('All');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const loadWorkouts = async (selectedCategory) => {
    try {
      setError(null);
      const data = await fetchWorkouts(selectedCategory);
      setWorkouts(data);
    } catch (err) {
      console.error('Workout fetch error:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadWorkouts(category);
  }, [category]);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts(category);
    }, [category])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadWorkouts(category);
  };

  // Filter by search
  const query = search.trim().toLowerCase();
  const matchesSearch = (w) => !query || w.title.toLowerCase().includes(query);
  const filtered = workouts.filter(matchesSearch);

  const recommended = filtered.find((w) => w.isRecommended) || filtered[0];
  const rest = filtered.filter((w) => w !== recommended);

  if (loading && workouts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.primary} />
          <Text style={styles.errorText}>Couldn't load workouts</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadWorkouts(category)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Workouts</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSearch(search ? '' : ' ')}
          >
            <Ionicons
              name={search ? 'close' : 'search-outline'}
              size={22}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        {search !== '' && (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workouts..."
              placeholderTextColor="#999"
              value={search.trim()}
              onChangeText={setSearch}
              autoFocus
            />
          </View>
        )}

        {/* CATEGORY TABS */}
        <CategoryTabs
          categories={CATEGORIES}
          selected={category}
          onSelect={setCategory}
        />

        <View style={styles.body}>
          {/* RECOMMENDED */}
          {recommended && (
            <>
              <Text style={styles.sectionTitle}>Recommended</Text>
              <RecommendedCard
                title={recommended.title}
                subtitle={`${recommended.duration} min · ${recommended.level} · ${recommended.category}`}
                image={recommended.image}
                onPress={() =>
                  navigation.navigate('WorkoutDetail', { workoutId: recommended._id })
                }
              />
            </>
          )}

          {/* GRID */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For you</Text>
            <Text style={styles.seeAll}>{rest.length} workouts</Text>
          </View>

          <View style={styles.grid}>
            {rest.map((item) => (
              <View key={item._id} style={styles.gridItem}>
                <WorkoutCard
                  title={item.title}
                  duration={`${item.duration} min`}
                  level={item.level}
                  image={item.image}
                  onPress={() =>
                    navigation.navigate('WorkoutDetail', { workoutId: item._id })
                  }
                />
              </View>
            ))}
          </View>

          {rest.length === 0 && (
            <View style={styles.center}>
              <Text style={styles.errorSub}>
                {query ? 'No workouts match your search' : 'No workouts in this category yet'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 12, color: COLORS.textSecondary },
  errorText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginTop: 12 },
  errorSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6 },
  retryBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: '#fff', fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center', alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  body: { paddingHorizontal: SIZES.padding, marginTop: 20 },
  sectionTitle: {
    fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%' },
});