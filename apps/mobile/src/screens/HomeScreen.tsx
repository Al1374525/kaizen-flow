/**
 * Home Screen
 * Dashboard with today's tasks and progress
 */

import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { apiService, Task } from '../services/api';

type TaskStatus = 'active' | 'completed' | 'paused';
type TaskCategory =
  | 'Work'
  | 'Health'
  | 'Learning'
  | 'Creative'
  | 'Social'
  | 'Other';

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Work: '#64B5F6',
  Health: '#81C784',
  Learning: '#BA68C8',
  Creative: '#F48FB1',
  Social: '#FFB74D',
  Other: '#90A4AE',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  active: '#FFB74D',
  completed: '#4CAF50',
  paused: '#E57373',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState<string>('User');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      // Get user info
      const user = await apiService.getStoredUser();
      if (user?.firstName) {
        setUserName(user.firstName);
      }

      // Fetch tasks
      const response = await apiService.getTasks();

      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Derived data
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const activeTasks = tasks.filter(task => task.status === 'active');
  const progressPercentage =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;
  const focusTask = activeTasks[0] || null;

  // Handlers
  const handleSettingsPress = () => {
    // Future: navigate to settings
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      // Optimistic update
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: 'completed' } : t))
      );

      const response = await apiService.markTaskComplete(taskId);
      if (!response.success) {
        // Revert on failure
        fetchTasks();
      }
    } catch (err) {
      fetchTasks();
    }
  };

  const handleCreateTask = () => {
    navigation.navigate('CreateTask');
  };

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#FF8C42' />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchTasks(true)}
              tintColor='#FF8C42'
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, {userName}! 👋
              </Text>
              <Text style={styles.subGreeting}>
                Let&apos;s make today count.
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSettingsPress}
              style={styles.settingsButton}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Error message */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Today's Focus Card */}
          {focusTask && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Today&apos;s Focus</Text>
              <Text style={styles.focusTitle}>{focusTask.title}</Text>

              <View style={styles.focusMetaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaText}>
                    💪 {focusTask.emotionalDifficulty}/5
                  </Text>
                </View>
                <View
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor:
                        CATEGORY_COLORS[focusTask.category as TaskCategory] ||
                        '#90A4AE',
                    },
                  ]}
                >
                  <Text style={styles.categoryChipText}>
                    {focusTask.category || 'Other'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleMarkComplete(focusTask.id)}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Progress Card */}
          <View style={styles.card}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionLabel}>Your Progress</Text>
              <Text style={styles.progressPercentage}>
                {progressPercentage}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {completedTasks.length} of {tasks.length} tasks today
            </Text>
          </View>

          {/* Tasks List */}
          <View style={styles.tasksSection}>
            <Text style={styles.tasksHeading}>
              Today&apos;s Tasks ({tasks.length})
            </Text>

            {tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => handleTaskPress(task.id)}
                activeOpacity={0.8}
              >
                <View style={styles.taskLeftContent}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: STATUS_COLORS[task.status] },
                    ]}
                  />

                  <View style={styles.taskTextContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.taskMetaRow}>
                      <View
                        style={[
                          styles.taskCategoryBadge,
                          {
                            backgroundColor:
                              CATEGORY_COLORS[task.category as TaskCategory] ||
                              '#90A4AE',
                          },
                        ]}
                      >
                        <Text style={styles.taskCategoryText}>
                          {task.category || 'Other'}
                        </Text>
                      </View>
                      <Text style={styles.taskDifficulty}>
                        💪 {task.emotionalDifficulty}/5
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tasks yet!</Text>
                <Text style={styles.emptySubtext}>
                  Tap the + button to create your first task
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.viewAllLink}>
            <Text style={styles.viewAllText}>View All Tasks →</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleCreateTask}
          style={styles.fab}
        >
          <Text style={styles.fabIcon}>⨁</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8B7355',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3D2914',
    lineHeight: 36,
    maxWidth: 280,
  },
  subGreeting: {
    fontSize: 15,
    color: '#8B7355',
    marginTop: 6,
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
  errorBanner: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#3D2914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C75B39',
    marginBottom: 10,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D2914',
    lineHeight: 30,
    marginBottom: 14,
  },
  focusMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  metaChip: {
    backgroundColor: '#FFF1E5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4F2D',
  },
  categoryChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D2914',
  },
  progressTrack: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: '#F3E3D4',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FF8C42',
  },
  progressText: {
    fontSize: 14,
    color: '#8B7355',
  },
  tasksSection: {
    marginTop: 6,
  },
  tasksHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3D2914',
    marginBottom: 14,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#3D2914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  taskLeftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    marginRight: 12,
  },
  taskTextContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2914',
    marginBottom: 10,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  taskCategoryBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  taskCategoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  taskDifficulty: {
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D2914',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
  },
  viewAllLink: {
    alignSelf: 'center',
    paddingVertical: 16,
  },
  viewAllText: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8C42',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C75B39',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 30,
  },
});
