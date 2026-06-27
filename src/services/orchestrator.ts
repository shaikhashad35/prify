import type { CelebInput, CelebResult, ProgressInfo } from '../types';
import { fetchCelebrityBio } from './wikiService';
import { generatePersonalizedTweet } from './geminiService';
import { delay } from '../utils/helpers';

const WIKI_DELAY_MS = 200;
const GEMINI_DELAY_MS = 800;

export async function processCelebrities(
  celebrities: CelebInput[],
  agenda: string,
  apiKey: string,
  onProgress: (progress: ProgressInfo) => void
): Promise<CelebResult[]> {
  const results: CelebResult[] = [];
  const total = celebrities.length;

  for (let i = 0; i < total; i++) {
    const celeb = celebrities[i];
    const current = i + 1;

    onProgress({ current, total, name: celeb.name, status: 'fetching_bio' });
    const bio = await fetchCelebrityBio(celeb.wikipediaLink, celeb.name);
    await delay(WIKI_DELAY_MS);

    onProgress({ current, total, name: celeb.name, status: 'generating_tweet' });
    const { tweet, error } = await generatePersonalizedTweet(apiKey, celeb.name, bio, agenda);
    await delay(GEMINI_DELAY_MS);

    if (error) {
      results.push({ ...celeb, message: '', status: 'error', error });
      onProgress({ current, total, name: celeb.name, status: 'error' });
    } else {
      results.push({ ...celeb, message: tweet, status: 'success' });
      onProgress({ current, total, name: celeb.name, status: 'success' });
    }
  }

  return results;
}
