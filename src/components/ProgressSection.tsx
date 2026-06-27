import type { ProgressInfo } from '../types';

interface Props {
  visible: boolean;
  progress: ProgressInfo | null;
  logs: { message: string; type: 'success' | 'error' }[];
  complete: { success: number; fail: number } | null;
}

const STATUS_MESSAGES: Record<string, (name: string) => string> = {
  fetching_bio: (name) => `Fetching Wikipedia bio for ${name}...`,
  generating_tweet: (name) => `Generating tweet for ${name}...`,
  success: (name) => `✅ ${name} — done`,
  error: (name) => `❌ ${name} — failed`,
};

export default function ProgressSection({ visible, progress, logs, complete }: Props) {
  if (!visible) return null;

  const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;
  const progressText = complete
    ? `Done! ${complete.success} succeeded, ${complete.fail} failed.`
    : progress
      ? `Processing ${progress.current}/${progress.total}: ${STATUS_MESSAGES[progress.status]?.(progress.name) ?? progress.name}`
      : 'Preparing...';

  return (
    <section className="card">
      <div className="card-header">
        <h2>⏳ Processing</h2>
      </div>
      <div className="card-body">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${complete ? 100 : pct}%` }} />
        </div>
        <p className="progress-text">{progressText}</p>
        <div className="log-container">
          {logs.map((log, i) => (
            <div key={i} className={`log-entry log-${log.type}`}>{log.message}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
