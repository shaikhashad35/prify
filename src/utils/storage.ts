const STORAGE_KEY = 'prify_gemini_key';

export function saveApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function removeApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  const key = getApiKey();
  return key !== null && key.trim().length > 0;
}
