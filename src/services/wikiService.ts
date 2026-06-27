import type { WikipediaData } from '../types';
import { extractWikiTitle } from '../utils/helpers';
import { isValidWikipediaUrl } from '../utils/validators';

const WIKI_API_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary';

export async function fetchCelebrityBio(wikipediaUrl: string, name: string): Promise<WikipediaData> {
  if (isValidWikipediaUrl(wikipediaUrl)) {
    const title = extractWikiTitle(wikipediaUrl);
    if (title) {
      try {
        const data = await fetchWikiSummary(title);
        if (data) return data;
      } catch { /* fall through */ }
    }
  }

  try {
    const searchTitle = name.trim().replace(/\s+/g, '_');
    const data = await fetchWikiSummary(searchTitle);
    if (data) return data;
  } catch { /* fall through */ }

  return {
    title: name,
    summary: `${name} is a well-known public figure.`,
    description: 'Public figure',
  };
}

async function fetchWikiSummary(title: string): Promise<WikipediaData | null> {
  const url = `${WIKI_API_BASE}/${encodeURIComponent(title)}`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) return null;

  const json = await response.json();
  return {
    title: json.title || title,
    summary: json.extract || '',
    description: json.description || '',
  };
}
