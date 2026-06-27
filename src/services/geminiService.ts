import type { WikipediaData, ValidationResult } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

function buildPrompt(name: string, summary: string, description: string, agenda: string): string {
  return `You are a PR copywriting specialist who writes authentic social media posts for celebrities.

Celebrity: ${name}
Background: ${summary}
Description: ${description}
PR Agenda: ${agenda}

Instructions:
1. Write a tweet (≤ 280 characters) promoting the agenda
2. Sound like ${name} naturally wrote it
3. Reference specific details from their background
4. Avoid PR clichés like "excited to announce"
5. Include 1-2 natural hashtags
6. Return ONLY the tweet text — no quotes, no labels, no explanation`;
}

export async function generatePersonalizedTweet(
  apiKey: string,
  name: string,
  bio: WikipediaData,
  agenda: string
): Promise<{ tweet: string; error: string | null }> {
  const prompt = buildPrompt(name, bio.summary, bio.description, agenda);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const errMsg = errBody?.error?.message || `HTTP ${response.status}`;
      if (response.status === 429) {
        return { tweet: '', error: 'Rate limit exceeded. Please wait and try again.' };
      }
      if (response.status === 400 || response.status === 403) {
        return { tweet: '', error: `API key error: ${errMsg}` };
      }
      return { tweet: '', error: `Gemini API error: ${errMsg}` };
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { tweet: '', error: 'Gemini returned an empty response.' };
    }

    const cleaned = text.trim().replace(/^["']|["']$/g, '');
    const tweet = cleaned.length > 280 ? cleaned.slice(0, 279) + '…' : cleaned;

    return { tweet, error: null };
  } catch (err) {
    return { tweet: '', error: `Network error: ${(err as Error).message}` };
  }
}

export async function testApiKey(apiKey: string): Promise<ValidationResult> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Reply with OK' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });

    if (response.ok) {
      return { valid: true, message: '✅ API key is valid and working.' };
    }

    const errBody = await response.json().catch(() => ({}));
    const errMsg = errBody?.error?.message || `HTTP ${response.status}`;
    return { valid: false, message: `❌ Invalid API key: ${errMsg}` };
  } catch (err) {
    return { valid: false, message: `❌ Connection error: ${(err as Error).message}` };
  }
}
