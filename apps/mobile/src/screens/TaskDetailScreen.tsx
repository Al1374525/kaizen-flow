/**
 * Task Detail Screen
 * View and manage individual task
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type TaskStatus = 'in_progress' | 'completed' | 'not_started';
type TaskCategory =
  | 'Work'
  | 'Health'
  | 'Learning'
  | 'Creative'
  | 'Social'
  | 'Other';

type RootStackParamList = {
  TaskDetail: { taskId: string };
};

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Work: '#64B5F6',
  Health: '#81C784',
  Learning: '#BA68C8',
  Creative: '#F48FB1',
  Social: '#FFB74D',
  Other: '#90A4AE',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  in_progress: '#FFB74D',
  completed: '#4CAF50',
  not_started: '#E57373',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  completed: 'Completed',
  not_started: 'Not Started',
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Easy',
  2: 'Light effort',
  3: 'Some effort',
  4: 'Challenging',
  5: 'Stretch',
};

// Mock task data - in real app, fetch from API
const mockTask: {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  difficulty: number;
  category: TaskCategory;
  createdAt: string;
  completedAt: string | null;
} = {
  id: '1',
  title: 'Review security logs',
  description:
    'Check the latest security logs for any suspicious activity. Look for failed login attempts, unusual access patterns, and potential security threats.',
  status: 'in_progress' as TaskStatus,
  difficulty: 3,
  category: 'Work' as TaskCategory,
  createdAt: 'Mar 22, 2026',
  completedAt: '',
};

export default function TaskDetailScreen() {
  const navigation = useNavigation<any>();
  void useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();

  const [task, setTask] = useState(mockTask);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleMarkComplete = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTask(prev => ({
        ...prev,
        status: prev.status === 'completed' ? 'in_progress' : 'completed',
        completedAt: prev.status === 'completed' ? null : 'Apr 5, 2026',
      }));
      setIsLoading(false);
    }, 500);
  };

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      setTask(prev => ({
        ...prev,
        title: editTitle,
        description: editDescription,
      }));
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Simulate API call
          navigation.goBack();
        },
      },
    ]);
  };

  const categoryIcon = (cat: TaskCategory) => {
    const icons: Record<TaskCategory, string> = {
      Work: '📁',
      Health: '💪',
      Learning: '📚',
      Creative: '🎨',
      Social: '👥',
      Other: '📌',
    };
    return icons[cat];
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={handleEdit}
            style={styles.menuButton}
            disabled={isLoading}
          >
            <Text style={styles.menuButtonText}>{isEditing ? '💾' : '✏️'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        {isEditing ? (
          <TextInput
            style={styles.titleInput}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder='Task title'
            placeholderTextColor='#B8A089'
          />
        ) : (
          <Text style={styles.title}>{task.title}</Text>
        )}

        {/* Category + Status Badge */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: CATEGORY_COLORS[task.category] },
            ]}
          >
            <Text style={styles.categoryBadgeText}>
              {categoryIcon(task.category)} {task.category}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[task.status] },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {task.status === 'completed' ? '✅' : '⏳'}{' '}
              {STATUS_LABELS[task.status]}
            </Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          {isEditing ? (
            <TextInput
              style={styles.descriptionInput}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder='Description'
              placeholderTextColor='#B8A089'
              multiline
              numberOfLines={4}
              textAlignVertical='top'
            />
          ) : (
            <>
              <Text style={styles.cardTitle}>Description</Text>
              <Text style={styles.description}>
                {task.description || 'No description provided.'}
              </Text>
            </>
          )}
        </View>

        {/* Dates */}
        <View style={styles.datesRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Created</Text>
            <Text style={styles.dateValue}>{task.createdAt}</Text>
          </View>
          {task.completedAt && (
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Completed</Text>
              <Text style={styles.dateValue}>{task.completedAt}</Text>
            </View>
          )}
        </View>

        {/* Difficulty */}
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyLabel}>
            💪 Difficulty: {task.difficulty}/5 '
            {DIFFICULTY_LABELS[task.difficulty]}'
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonDisabled,
          ]}
          onPress={handleMarkComplete}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='#FFFFFF' />
          ) : (
            <Text style={styles.primaryButtonText}>
              {task.status === 'completed'
                ? '↩️ Undo Complete'
                : '✅ Mark Complete'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Edit/Delete Buttons */}
        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleEdit}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>
              {isEditing ? '💾 Save' : '✏️ Edit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={isLoading}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#3D2914',
  },
  headerRight: {
    flexDirection: 'row',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3D2914',
    lineHeight: 36,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3D2914',
    lineHeight: 36,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8C42',
    paddingBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#3D2914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C75B39',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#3D2914',
    lineHeight: 24,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#3D2914',
    lineHeight: 24,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E8D5C4',
    borderRadius: 10,
    padding: 12,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  dateItem: {},
  dateLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2914',
  },
  difficultyContainer: {
    backgroundColor: '#FFF1E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4F2D',
  },
  primaryButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: '#FFB366',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  secondaryButtonText: {
    color: '#3D2914',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    borderColor: '#E57373',
  },
  deleteButtonText: {
    color: '#E57373',
    fontSize: 14,
    fontWeight: '600',
  },
});
