/**
 * Task Detail Screen
 * View and manage individual task
 */

import React, { useState, useCallback } from 'react';
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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  RouteProp,
} from '@react-navigation/native';
import { apiService, Task } from '../services/api';

type TaskStatus = 'active' | 'completed' | 'paused';
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
  active: '#FFB74D',
  completed: '#4CAF50',
  paused: '#E57373',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  paused: 'Paused',
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Easy',
  2: 'Light effort',
  3: 'Some effort',
  4: 'Challenging',
  5: 'Stretch',
};

const CATEGORY_ICONS: Record<TaskCategory, string> = {
  Work: '📁',
  Health: '💪',
  Learning: '📚',
  Creative: '🎨',
  Social: '👥',
  Other: '📌',
};

const formatDate = (iso: string): string => {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
};

export default function TaskDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();
  const { taskId } = route.params;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTask = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getTaskById(taskId);

      if (response.success && response.data) {
        setTask(response.data);
        setEditTitle(response.data.title);
        setEditDescription(response.data.description ?? '');
      } else {
        setError(response.error || 'Failed to load task');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTask();
    }, [taskId])
  );

  const handleMarkComplete = async () => {
    if (!task) return;
    try {
      setIsMutating(true);
      const nextStatus: TaskStatus =
        task.status === 'completed' ? 'active' : 'completed';
      const response = await apiService.updateTask(taskId, {
        status: nextStatus,
      });

      if (response.success && response.data) {
        setTask(response.data);
      } else {
        Alert.alert('Error', response.error ?? 'Failed to update task');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleEdit = async () => {
    if (!task) return;

    if (!isEditing) {
      setEditTitle(task.title);
      setEditDescription(task.description ?? '');
      setIsEditing(true);
      return;
    }

    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      Alert.alert('Error', 'Task title is required');
      return;
    }

    try {
      setIsMutating(true);
      const response = await apiService.updateTask(taskId, {
        title: trimmedTitle,
        description: editDescription.trim() || null,
      });

      if (response.success && response.data) {
        setTask(response.data);
        setIsEditing(false);
      } else {
        Alert.alert('Error', response.error ?? 'Failed to update task');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsMutating(true);
            const response = await apiService.deleteTask(taskId);
            if (response.success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', response.error ?? 'Failed to delete task');
            }
          } catch (err) {
            Alert.alert('Error', 'Network error. Please try again.');
          } finally {
            setIsMutating(false);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#FF8C42' />
          <Text style={styles.loadingText}>Loading task...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{error ?? 'Task not found'}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const category = (task.category as TaskCategory) || 'Other';
  const status = task.status as TaskStatus;
  const completedAtDisplay =
    status === 'completed' ? formatDate(task.updatedAt) : null;

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
            disabled={isMutating}
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
            editable={!isMutating}
          />
        ) : (
          <Text style={styles.title}>{task.title}</Text>
        )}

        {/* Category + Status Badge */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: CATEGORY_COLORS[category] || '#90A4AE' },
            ]}
          >
            <Text style={styles.categoryBadgeText}>
              {CATEGORY_ICONS[category] || '📌'} {category}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[status] || '#90A4AE' },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {status === 'completed' ? '✅' : '⏳'} {STATUS_LABELS[status]}
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
              editable={!isMutating}
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
            <Text style={styles.dateValue}>{formatDate(task.createdAt)}</Text>
          </View>
          {completedAtDisplay && (
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Completed</Text>
              <Text style={styles.dateValue}>{completedAtDisplay}</Text>
            </View>
          )}
        </View>

        {/* Difficulty */}
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyLabel}>
            💪 Difficulty: {task.emotionalDifficulty}/5 &apos;
            {DIFFICULTY_LABELS[task.emotionalDifficulty] || ''}&apos;
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            isMutating && styles.primaryButtonDisabled,
          ]}
          onPress={handleMarkComplete}
          disabled={isMutating}
        >
          {isMutating ? (
            <ActivityIndicator color='#FFFFFF' />
          ) : (
            <Text style={styles.primaryButtonText}>
              {status === 'completed' ? '↩️ Undo Complete' : '✅ Mark Complete'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Edit/Delete Buttons */}
        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleEdit}
            disabled={isMutating}
          >
            <Text style={styles.secondaryButtonText}>
              {isEditing ? '💾 Save' : '✏️ Edit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={isMutating}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C62828',
    marginBottom: 24,
    textAlign: 'center',
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
