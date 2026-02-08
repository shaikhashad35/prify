/**
 * wikiService.js — Fetch celebrity bios from Wikipedia REST API
 */

import { extractWikiTitle } from '../utils/helpers.js';
import { isValidWikipediaUrl } from '../utils/validators.js';

const WIKI_API_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary';

/**
 * Fetch a celebrity's bio from Wikipedia
 * @param {string} wikipediaUrl - Full Wikipedia URL
 * @param {string} name - Celebrity name (used as fallback search)
 * @returns {Promise<{ title: string, summary: string, description: string }>}
 */
export async function fetchCelebrityBio(wikipediaUrl, name) {
  // Try direct URL first
  if (isValidWikipediaUrl(wikipediaUrl)) {
    const title = extractWikiTitle(wikipediaUrl);
    if (title) {
      try {
        const data = await fetchWikiSummary(title);
        if (data) return data;
      } catch {
        // Fall through to name-based search
      }
    }
  }

  // Fallback: search by name
  try {
    const searchTitle = name.trim().replace(/\s+/g, '_');
    const data = await fetchWikiSummary(searchTitle);
    if (data) return data;
  } catch {
    // Fall through to generic fallback
  }

  // Final fallback: return generic data
  return {
    title: name,
    summary: `${name} is a well-known public figure.`,
    description: 'Public figure',
  };
}

/**
 * Fetch the summary for a given Wikipedia article title
 * @param {string} title - Wikipedia article title (e.g. "Shah_Rukh_Khan")
 * @returns {Promise<{ title: string, summary: string, description: string }|null>}
 */
async function fetchWikiSummary(title) {
  const url = `${WIKI_API_BASE}/${encodeURIComponent(title)}`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  return {
    title: json.title || title,
    summary: json.extract || '',
    description: json.description || '',
  };
}
