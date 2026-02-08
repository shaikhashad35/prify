/**
 * orchestrator.js — Orchestrate the full tweet generation pipeline per celebrity
 */

import { fetchCelebrityBio } from './wikiService.js';
import { generatePersonalizedTweet } from './geminiService.js';
import { delay } from '../utils/helpers.js';

const WIKI_DELAY_MS = 200;
const GEMINI_DELAY_MS = 800;

/**
 * Process all celebrities sequentially: fetch bio → generate tweet
 * @param {Array<{name: string, contact: string, wikipediaLink: string}>} celebrities
 * @param {string} agenda - The PR agenda text
 * @param {string} apiKey - Gemini API key
 * @param {(progress: {current: number, total: number, name: string, status: string}) => void} onProgress - Progress callback
 * @returns {Promise<Array<{name: string, contact: string, wikipediaLink: string, message: string, status: string, error?: string}>>}
 */
export async function processCelebrities(celebrities, agenda, apiKey, onProgress) {
  const results = [];
  const total = celebrities.length;

  for (let i = 0; i < total; i++) {
    const celeb = celebrities[i];
    const current = i + 1;

    // Report: fetching bio
    onProgress({ current, total, name: celeb.name, status: 'fetching_bio' });

    // Step 1: Fetch Wikipedia bio
    const bio = await fetchCelebrityBio(celeb.wikipediaLink, celeb.name);
    await delay(WIKI_DELAY_MS);

    // Report: generating tweet
    onProgress({ current, total, name: celeb.name, status: 'generating_tweet' });

    // Step 2: Generate tweet via Gemini
    const { tweet, error } = await generatePersonalizedTweet(apiKey, celeb.name, bio, agenda);
    await delay(GEMINI_DELAY_MS);

    if (error) {
      results.push({
        name: celeb.name,
        contact: celeb.contact,
        wikipediaLink: celeb.wikipediaLink,
        message: '',
        status: 'error',
        error,
      });
      onProgress({ current, total, name: celeb.name, status: 'error' });
    } else {
      results.push({
        name: celeb.name,
        contact: celeb.contact,
        wikipediaLink: celeb.wikipediaLink,
        message: tweet,
        status: 'success',
      });
      onProgress({ current, total, name: celeb.name, status: 'success' });
    }
  }

  return results;
}
