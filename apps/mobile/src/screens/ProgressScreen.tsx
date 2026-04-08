/**
 * Progress/Stats Screen
 * User progress, XP, streaks, and achievements
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Mock user data
const mockUser = {
  level: 7,
  levelTitle: 'Habit Builder',
  currentXP: 2450,
  xpToNextLevel: 3000,
  streak: 7,
};

const mockWeekStats = {
  tasksCompleted: 12,
  tasksCreated: 8,
  completionRate: 67,
  bestDay: 'Wed',
};

const mockAchievements = [
  { id: 'first', icon: '🥉', label: 'First', earned: true },
  { id: 'streak', icon: '🔥', label: 'Streak', earned: true },
  { id: 'week', icon: '📅', label: 'Week', earned: true },
  { id: 'seven', icon: '7️⃣', label: '7-Day', earned: true },
  { id: 'mvp', icon: '🌟', label: 'MVP', earned: false },
];

export default function ProgressScreen() {
  const navigation = useNavigation<any>();

  const progressPercentage = Math.round(
    (mockUser.currentXP / mockUser.xpToNextLevel) * 100
  );
  const xpToNextLevel = mockUser.xpToNextLevel - mockUser.currentXP;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Level Badge */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelBadge}>🏆</Text>
          <Text style={styles.levelNumber}>LEVEL {mockUser.level}</Text>
          <Text style={styles.levelTitle}>"{mockUser.levelTitle}"</Text>
        </View>

        {/* XP Progress */}
        <View style={styles.xpCard}>
          <Text style={styles.xpText}>
            {mockUser.currentXP.toLocaleString()} /{' '}
            {mockUser.xpToNextLevel.toLocaleString()} XP
          </Text>
          <View style={styles.xpTrack}>
            <View
              style={[styles.xpFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.xpToNext}>{xpToNextLevel} XP to next level</Text>
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakRow}>
            <Text style={styles.streakLabel}>🔥 Current Streak</Text>
            <Text style={styles.streakIcon}>🌟</Text>
          </View>
          <Text style={styles.streakNumber}>{mockUser.streak} days</Text>
        </View>

        {/* This Week Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {mockWeekStats.tasksCompleted}
              </Text>
              <Text style={styles.statLabel}>Tasks Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockWeekStats.tasksCreated}</Text>
              <Text style={styles.statLabel}>Tasks Created</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {mockWeekStats.completionRate}%
              </Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockWeekStats.bestDay}</Text>
              <Text style={styles.statLabel}>Best Day</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>🏅 Achievements</Text>
          <View style={styles.achievementsRow}>
            {mockAchievements.map(achievement => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  !achievement.earned && styles.achievementLocked,
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text
                  style={[
                    styles.achievementLabel,
                    !achievement.earned && styles.achievementLabelLocked,
                  ]}
                >
                  {achievement.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2914',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(61, 41, 20, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingsIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  levelBadge: {
    fontSize: 48,
    marginBottom: 8,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3D2914',
  },
  levelTitle: {
    fontSize: 18,
    color: '#FF8C42',
    fontWeight: '600',
    marginTop: 4,
  },
  xpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3D2914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  xpText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2914',
    textAlign: 'center',
    marginBottom: 12,
  },
  xpTrack: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F3E3D4',
    overflow: 'hidden',
    marginBottom: 12,
  },
  xpFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#FF8C42',
  },
  xpToNext: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3D2914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2914',
  },
  streakIcon: {
    fontSize: 20,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF8C42',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3D2914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D2914',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2914',
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 4,
  },
  achievementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#3D2914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D2914',
    marginBottom: 16,
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
    opacity: 1,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 12,
    color: '#3D2914',
    fontWeight: '500',
  },
  achievementLabelLocked: {
    color: '#8B7355',
  },
});
