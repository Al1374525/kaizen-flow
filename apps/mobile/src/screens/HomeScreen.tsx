import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type TaskStatus = 'in_progress' | 'completed' | 'not_started';
type TaskCategory =
  | 'Work'
  | 'Health'
  | 'Learning'
  | 'Creative'
  | 'Social'
  | 'Other';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  difficulty: number;
  category: TaskCategory;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review security logs',
    status: 'in_progress',
    difficulty: 3,
    category: 'Work',
  },
  {
    id: '2',
    title: 'Call mom',
    status: 'completed',
    difficulty: 1,
    category: 'Social',
  },
  {
    id: '3',
    title: 'Study for Security+',
    status: 'not_started',
    difficulty: 5,
    category: 'Learning',
  },
];

const user = { firstName: 'Albert' };

const categoryColors: Record<TaskCategory, string> = {
  Work: '#64B5F6',
  Health: '#81C784',
  Learning: '#BA68C8',
  Creative: '#F48FB1',
  Social: '#FFB74D',
  Other: '#90A4AE',
};

const statusColors: Record<TaskStatus, string> = {
  in_progress: '#FFB74D',
  completed: '#4CAF50',
  not_started: '#E57373',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const completedTasks = mockTasks.filter(task => task.status === 'completed');
  const progressPercentage = Math.round(
    (completedTasks.length / mockTasks.length) * 100
  );
  const focusTask =
    mockTasks.find(task => task.status !== 'completed') ?? mockTasks[0];

  const handleSettingsPress = () => {
    // Placeholder for settings navigation once the screen exists
  };

  const handleMarkComplete = () => {
    // Placeholder for API integration / optimistic updates
  };

  const handleCreateTask = () => {
    void navigation;
    // Placeholder for create-task flow once the route is wired up
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Good morning, {user.firstName}! 👋
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

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Today&apos;s Focus</Text>
            <Text style={styles.focusTitle}>{focusTask.title}</Text>

            <View style={styles.focusMetaRow}>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>💪 {focusTask.difficulty}/5</Text>
              </View>
              <View
                style={[
                  styles.categoryChip,
                  { backgroundColor: categoryColors[focusTask.category] },
                ]}
              >
                <Text style={styles.categoryChipText}>
                  📁 {focusTask.category}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleMarkComplete}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          </View>

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
              {completedTasks.length} of {mockTasks.length} tasks today
            </Text>
          </View>

          <View style={styles.tasksSection}>
            <Text style={styles.tasksHeading}>
              Today's Tasks ({mockTasks.length})
            </Text>

            {mockTasks.map(task => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskLeftContent}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusColors[task.status] },
                    ]}
                  />

                  <View style={styles.taskTextContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.taskMetaRow}>
                      <View
                        style={[
                          styles.taskCategoryBadge,
                          { backgroundColor: categoryColors[task.category] },
                        ]}
                      >
                        <Text style={styles.taskCategoryText}>
                          {task.category}
                        </Text>
                      </View>
                      <Text style={styles.taskDifficulty}>
                        💪 {task.difficulty}/5
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.viewAllLink}>
            <Text style={styles.viewAllText}>View All Tasks →</Text>
          </TouchableOpacity>
        </ScrollView>

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
  viewAllLink: {
    alignSelf: 'center',
    paddingVertical: 16,
  },
  viewAllText: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '600',
  },
});
