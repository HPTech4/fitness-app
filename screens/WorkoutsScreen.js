// screens/WorkoutsScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import CategoryTabs from "../components/CategoryTabs";
import RecommendedCard from "../components/RecommendedCard";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutsScreenSkeleton from "../components/skeletons/WorkoutsScreenSkeleton";
import EmptyState from "../components/EmptyState";
import { fetchWorkouts } from "../api/workoutService";
import { COLORS, SIZES } from "../constants/theme";

const CATEGORIES = ["All", "Strength", "Cardio", "Mobility"];

export default function WorkoutsScreen({ navigation }) {
  const [category, setCategory] = useState("All");
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const loadWorkouts = async (selectedCategory) => {
    try {
      setError(null);
      const data = await fetchWorkouts(selectedCategory);
      setWorkouts(data);
    } catch (err) {
      console.error("Workout fetch error:", err);
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

  const query = search.trim().toLowerCase();
  const matchesSearch = (w) => !query || w.title.toLowerCase().includes(query);
  const filtered = workouts.filter(matchesSearch);

  const recommended = filtered.find((w) => w.isRecommended) || filtered[0];
  const rest = filtered.filter((w) => w !== recommended);

  if (loading && workouts.length === 0) {
    return <WorkoutsScreenSkeleton />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.primary} />
          <Text style={styles.errorText}>Couldn't load workouts</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => loadWorkouts(category)}
          >
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Explore</Text>
            <Text style={styles.title}>Workouts</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSearch(search ? "" : " ")}
          >
            <Ionicons
              name={search ? "close" : "search-outline"}
              size={20}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        {search !== "" && (
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

        {/* BODY */}
        <View style={styles.body}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={query ? "search-outline" : "barbell-outline"}
              title={query ? "No results found" : "Nothing here yet"}
              subtitle={
                query
                  ? `We couldn't find any workout matching "${query.trim()}". Try a different search.`
                  : "No workouts in this category yet. Try another category."
              }
              actionLabel={query ? "Clear search" : "Show all"}
              onAction={() => {
                if (query) setSearch("");
                else setCategory("All");
              }}
            />
          ) : (
            <>
              {/* RECOMMENDED */}
              {recommended && (
                <>
                  <Text style={styles.sectionTitle}>Recommended</Text>
                  <RecommendedCard
                    title={recommended.title}
                    subtitle={`${recommended.duration} min · ${recommended.level} · ${recommended.category}`}
                    image={recommended.image}
                    onPress={() =>
                      navigation.navigate("WorkoutDetail", {
                        workoutId: recommended._id,
                      })
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
                        navigation.navigate("WorkoutDetail", {
                          workoutId: item._id,
                        })
                      }
                    />
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 12,
  },
  errorSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: "#fff", fontWeight: "bold" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },

  // Body
  body: { paddingHorizontal: SIZES.padding, marginTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: { color: COLORS.primary, fontSize: 13, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "48%" },
});