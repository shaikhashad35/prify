export interface CelebInput {
  name: string;
  contact: string;
  wikipediaLink: string;
}

export interface WikipediaData {
  title: string;
  summary: string;
  description: string;
}

export interface CelebResult extends CelebInput {
  message: string;
  status: 'success' | 'error';
  error?: string;
}

export interface ProgressInfo {
  current: number;
  total: number;
  name: string;
  status: 'fetching_bio' | 'generating_tweet' | 'success' | 'error';
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface HeaderMapping {
  mapping: Record<string, string> | null;
  missing: string[];
}
