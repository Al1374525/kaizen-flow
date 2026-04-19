/**
 * AI Service
 * Resistance interventions powered by Claude
 */

import Anthropic from '@anthropic-ai/sdk';
import { getEnv } from '../config/env';

export interface InterventionTask {
  title: string;
  description?: string | null;
  difficulty: number;
}

export interface InterventionUserContext {
  streakDays: number;
  totalXp: number;
  level: number;
}

const FALLBACK_MESSAGE =
  "It's okay to feel stuck — that's a normal part of starting something hard. Try just opening the task for 30 seconds. You're not committing to finishing, just to looking. You've got this.";

const SYSTEM_PROMPT = `You are a compassionate anti-akrasia coach for a behavioral health app. Your role is to help users overcome procrastination and resistance.

Core principles:
- SHAME-FREE: Never shame, judge, or moralize. Resistance is a normal human experience.
- BREAK PARALYSIS: Suggest the smallest possible first step (30-60 seconds of effort).
- VALIDATE FEELINGS: Acknowledge the emotional difficulty before suggesting action.
- CONCRETE & WARM: Be specific, kind, and grounded — not vague or saccharine.
- BRIEF: 2-3 sentences maximum. The user is already overwhelmed.

Never use phrases like "just do it", "stop procrastinating", or anything that implies the user is failing. Speak as if to a dear friend who is exhausted.`;

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic | null {
  const env = getEnv();
  if (!env.ANTHROPIC_API_KEY) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return cachedClient;
}

export async function getResistanceIntervention(
  task: InterventionTask,
  userContext: InterventionUserContext
): Promise<string> {
  const client = getClient();
  if (!client) {
    return FALLBACK_MESSAGE;
  }

  const userMessage = `A user is resisting starting this task:

Title: ${task.title}
${task.description ? `Description: ${task.description}\n` : ''}Emotional difficulty: ${task.difficulty}/5

User context:
- Current streak: ${userContext.streakDays} day(s)
- Level: ${userContext.level}
- Total XP: ${userContext.totalXp}

Write a brief (2-3 sentence) intervention that acknowledges the emotional weight, then suggests the smallest possible first step they could take in the next 60 seconds. Speak warmly and directly to them.`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find(block => block.type === 'text');
    if (textBlock && textBlock.type === 'text') {
      return textBlock.text.trim();
    }
    return FALLBACK_MESSAGE;
  } catch (error) {
    console.error('AI intervention failed:', error);
    return FALLBACK_MESSAGE;
  }
}
