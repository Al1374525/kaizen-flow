/**
 * Register Screen
 * User registration with validation
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.0.2.2:3000'; // Android emulator localhost
// Use 'http://localhost:3000' for iOS simulator

interface RegisterResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string | null;
      timezone: string;
    };
  };
  error?: string;
}

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    firstName?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validate inputs
  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'Name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'Name must be at least 2 characters';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName: firstName.trim(),
        }),
      });

      const data: RegisterResponse = await response.json();

      if (data.success && data.data) {
        // Store tokens securely
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
        await SecureStore.setItemAsync('user', JSON.stringify(data.data.user));

        // Navigate to Home
        navigation.replace('Home');
      } else {
        Alert.alert(
          'Registration Failed',
          data.error || 'Unable to create account. Please try again.'
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CREATE</Text>
          <Text style={styles.subtitle}>ACCOUNT</Text>
          <Text style={styles.tagline}>
            Join thousands building{'\n'}better habits
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder='email@example.com'
              placeholderTextColor='#B8A089'
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              value={firstName}
              onChangeText={text => {
                setFirstName(text);
                if (errors.firstName)
                  setErrors({ ...errors, firstName: undefined });
              }}
              placeholder='Enter your name'
              placeholderTextColor='#B8A089'
              autoCapitalize='words'
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  errors.password && styles.inputError,
                ]}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                placeholder='Create a password'
                placeholderTextColor='#B8A089'
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Text style={styles.helperText}>Must be at least 8 characters</Text>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  errors.confirmPassword && styles.inputError,
                ]}
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
                placeholder='Confirm your password'
                placeholderTextColor='#B8A089'
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Every journey begins{'\n'}with a single step 👣
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2914',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8C42',
    letterSpacing: 4,
    marginTop: -4,
  },
  tagline: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3D2914',
    marginBottom: 8,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 60,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  showPasswordText: {
    color: '#8B7355',
    fontSize: 14,
  },
  errorText: {
    color: '#E57373',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#B8A089',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    height: 52,
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#FFB366',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signInText: {
    color: '#8B7355',
    fontSize: 14,
  },
  signInLink: {
    color: '#C75B39',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#B8A089',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
