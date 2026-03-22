/**
 * Authentication Service
 * Handles JWT token generation, validation, and user authentication
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/database';
import { getEnv } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    timezone: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateTokens(payload: JWTPayload): {
  accessToken: string;
  refreshToken: string;
} {
  const env = getEnv();
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  } as jwt.SignOptions);
  const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '30d',
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): JWTPayload {
  const env = getEnv();
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}

export async function registerUser(
  email: string,
  password: string,
  firstName?: string
): Promise<AuthResult> {
  const db = getDb();

  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db('users')
    .insert({
      email,
      password_hash: passwordHash,
      first_name: firstName || null,
      timezone: 'UTC',
    })
    .returning(['id', 'email', 'first_name', 'timezone']);

  const payload: JWTPayload = { userId: user.id, email: user.email };
  const tokens = generateTokens(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      timezone: user.timezone,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  const db = getDb();

  const user = await db('users').where({ email }).first();
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const payload: JWTPayload = { userId: user.id, email: user.email };
  const tokens = generateTokens(payload);

  await db('users')
    .where({ id: user.id })
    .update({ last_active_at: new Date() });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      timezone: user.timezone,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export function refreshAccessToken(refreshToken: string): {
  accessToken: string;
} {
  const payload = verifyToken(refreshToken);
  const env = getEnv();

  const accessToken = jwt.sign(
    { userId: payload.userId, email: payload.email },
    env.JWT_SECRET,
    { expiresIn: '7d' } as jwt.SignOptions
  );

  return { accessToken };
}

export async function getUserById(userId: string) {
  const db = getDb();
  const user = await db('users').where({ id: userId }).first();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    timezone: user.timezone,
    theme: user.theme,
    notificationPreferences: user.notification_preferences,
  };
}
