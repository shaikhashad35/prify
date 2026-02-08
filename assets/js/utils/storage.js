/**
 * storage.js — localStorage wrapper for PRify
 */

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'prify_gemini_key',
};

/**
 * Save the Gemini API key to localStorage
 * @param {string} key - The Gemini API key
 */
export function saveApiKey(key) {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
}

/**
 * Retrieve the Gemini API key from localStorage
 * @returns {string|null}
 */
export function getApiKey() {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
}

/**
 * Remove the Gemini API key from localStorage
 */
export function removeApiKey() {
  localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
}

/**
 * Check if an API key is currently stored
 * @returns {boolean}
 */
export function hasApiKey() {
  const key = getApiKey();
  return key !== null && key.trim().length > 0;
}
