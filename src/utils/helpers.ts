export function extractWikiTitle(url: string): string {
  try {
    const parsed = new URL(url.trim());
    const match = parsed.pathname.match(/\/wiki\/(.+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return '';
  } catch {
    return '';
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDateForFilename(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}`;
}

export function shortenUrl(url: string, maxLen = 40): string {
  if (!url) return '';
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen - 3) + '...';
}
