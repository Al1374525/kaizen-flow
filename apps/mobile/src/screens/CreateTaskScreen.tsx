/**
 * Create Task Screen
 * Form to create a new task
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { apiService } from '../services/api';

type TaskCategory =
  | 'Work'
  | 'Health'
  | 'Learning'
  | 'Creative'
  | 'Social'
  | 'Other';

type CreateTaskRouteParams = {
  CreateTask: { parentTaskId?: string } | undefined;
};

const CATEGORIES: TaskCategory[] = [
  'Work',
  'Health',
  'Learning',
  'Creative',
  'Social',
  'Other',
];

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Work: '#64B5F6',
  Health: '#81C784',
  Learning: '#BA68C8',
  Creative: '#F48FB1',
  Social: '#FFB74D',
  Other: '#90A4AE',
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Easy',
  2: 'Light effort',
  3: 'Some effort',
  4: 'Challenging',
  5: 'Stretch',
};

export default function CreateTaskScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<CreateTaskRouteParams, 'CreateTask'>>();
  const routeParentTaskId = route.params?.parentTaskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [difficulty, setDifficulty] = useState(1);
  const [isSubtask, setIsSubtask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const trimmedDescription = description.trim();
      const response = await apiService.createTask({
        title: title.trim(),
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
        category,
        emotionalDifficulty: difficulty,
        ...(isSubtask && routeParentTaskId
          ? { parentTaskId: routeParentTaskId }
          : {}),
      });

      if (response.success) {
        navigation.goBack();
      } else {
        Alert.alert('Error', response.error ?? 'Failed to create task');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Task</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
        >
          {/* Task Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Task Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder='What do you want to do?'
              placeholderTextColor='#B8A089'
              editable={!isLoading}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder='Add more details...'
              placeholderTextColor='#B8A089'
              multiline
              numberOfLines={4}
              textAlignVertical='top'
              editable={!isLoading}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor:
                        category === cat ? CATEGORY_COLORS[cat] : '#FFFFFF',
                    },
                    category === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color:
                          category === cat ? '#FFFFFF' : CATEGORY_COLORS[cat],
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Difficulty Slider */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Emotional Difficulty</Text>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Easy</Text>
                <Text style={styles.sliderLabel}>Stretch</Text>
              </View>
              <View style={styles.sliderButtons}>
                {[1, 2, 3, 4, 5].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.sliderButton,
                      difficulty === num && styles.sliderButtonSelected,
                    ]}
                    onPress={() => setDifficulty(num)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.sliderButtonText,
                        difficulty === num && styles.sliderButtonTextSelected,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.difficultyDisplay}>
                {difficulty} - {DIFFICULTY_LABELS[difficulty]}
              </Text>
            </View>
          </View>

          {/* Subtask Checkbox */}
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxRow}>
              <Switch
                value={isSubtask}
                onValueChange={setIsSubtask}
                trackColor={{ false: '#E8D5C4', true: '#FFB366' }}
                thumbColor={isSubtask ? '#FF8C42' : '#FFFFFF'}
                disabled={isLoading}
              />
              <TouchableOpacity onPress={() => setIsSubtask(!isSubtask)}>
                <Text style={styles.checkboxLabel}>Make this a subtask</Text>
              </TouchableOpacity>
            </View>

            {isSubtask && !routeParentTaskId && (
              <View style={styles.parentTaskContainer}>
                <Text style={styles.helperText}>
                  Open a task first to add a subtask
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Create Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              (isLoading || (isSubtask && !routeParentTaskId)) &&
                styles.createButtonDisabled,
            ]}
            onPress={handleCreateTask}
            disabled={isLoading || (isSubtask && !routeParentTaskId)}
          >
            {isLoading ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.createButtonText}>Create Task</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D2914',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#8B7355',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D2914',
    marginBottom: 8,
  },
  required: {
    color: '#E57373',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E8D5C4',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#3D2914',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#E57373',
    borderWidth: 2,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#E57373',
    fontSize: 12,
    marginTop: 4,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  categoryChipSelected: {
    borderColor: 'transparent',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#8B7355',
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D5C4',
  },
  sliderButtonSelected: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  sliderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D2914',
  },
  sliderButtonTextSelected: {
    color: '#FFFFFF',
  },
  difficultyDisplay: {
    textAlign: 'center',
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '600',
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#3D2914',
    marginLeft: 12,
  },
  parentTaskContainer: {
    marginTop: 16,
  },
  helperText: {
    fontSize: 13,
    color: '#8B7355',
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C4',
  },
  createButton: {
    height: 52,
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#FFB366',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
