import { useState, useEffect } from 'react';
import { validateApiKey } from '../utils/validators';
import { saveApiKey, getApiKey, hasApiKey } from '../utils/storage';
import { testApiKey } from '../services/geminiService';

interface Props {
  onKeyStatusChange: (valid: boolean) => void;
}

export default function ApiKeySection({ onKeyStatusChange }: Props) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | '' }>({ message: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hasApiKey()) {
      setKey(getApiKey()!);
      setStatus({ message: '✅ API key loaded from storage.', type: 'success' });
      onKeyStatusChange(true);
    }
  }, [onKeyStatusChange]);

  const handleSave = async () => {
    const validation = validateApiKey(key);
    if (!validation.valid) {
      setStatus({ message: validation.message, type: 'error' });
      onKeyStatusChange(false);
      return;
    }

    setStatus({ message: '⏳ Validating API key...', type: 'info' });
    setSaving(true);

    const result = await testApiKey(key.trim());
    setSaving(false);

    if (result.valid) {
      saveApiKey(key.trim());
      setStatus({ message: result.message, type: 'success' });
      onKeyStatusChange(true);
    } else {
      setStatus({ message: result.message, type: 'error' });
      onKeyStatusChange(false);
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <span className="step-badge">Step 1</span>
        <h2>Gemini API Key</h2>
      </div>
      <div className="card-body">
        <p className="hint">
          Your key is stored locally in your browser — never sent to any server except Google's Gemini API.
        </p>
        <div className="input-group">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Paste your Gemini API key here..."
            autoComplete="off"
          />
          <button className="btn btn-icon" onClick={() => setShowKey(!showKey)} title="Show/Hide key">
            {showKey ? '🙈' : '👁️'}
          </button>
          <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
            {saving ? '...' : 'Save Key'}
          </button>
        </div>
        <p className="hint">
          Don't have a key?{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
            Get one free from Google AI Studio ↗
          </a>
        </p>
        {status.message && (
          <div className={`status-message status-${status.type}`}>{status.message}</div>
        )}
      </div>
    </section>
  );
}
