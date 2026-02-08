/**
 * helpers.js — Generic utility functions for PRify
 */

/**
 * Extract the Wikipedia article title from a URL
 * @param {string} url - Full Wikipedia URL
 * @returns {string} The article title (decoded)
 */
export function extractWikiTitle(url) {
  try {
    const parsed = new URL(url.trim());
    const path = parsed.pathname;
    // /wiki/Shah_Rukh_Khan → Shah_Rukh_Khan
    const match = path.match(/\/wiki\/(.+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Delay execution for a given number of milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Truncate text to a max length, appending ellipsis if needed
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 280) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Sanitize a string for safe display (strip HTML tags)
 * @param {string} str
 * @returns {string}
 */
export function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.textContent;
}

/**
 * Format a date as YYYY-MM-DD_HHmm for filenames
 * @param {Date} [date]
 * @returns {string}
 */
export function formatDateForFilename(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}`;
}

/**
 * Create a short display version of a URL
 * @param {string} url
 * @param {number} maxLen
 * @returns {string}
 */
export function shortenUrl(url, maxLen = 40) {
  if (!url) return '';
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen - 3) + '...';
}
