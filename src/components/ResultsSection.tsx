import type { CelebResult } from '../types';
import { generateOutputExcel } from '../services/excelService';

interface Props {
  visible: boolean;
  results: CelebResult[];
}

export default function ResultsSection({ visible, results }: Props) {
  if (!visible || results.length === 0) return null;

  const successCount = results.filter(r => r.status === 'success').length;
  const failCount = results.filter(r => r.status === 'error').length;

  const handleDownload = () => generateOutputExcel(results);

  return (
    <section className="card">
      <div className="card-header results-header">
        <h2>✅ Results</h2>
        <button className="btn btn-primary" onClick={handleDownload}>📥 Download Excel</button>
      </div>
      <div className="card-body">
        <div className="results-summary">
          {successCount} successful, {failCount} failed out of {results.length} celebrities.
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Generated Tweet</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className={r.status === 'success' ? 'row-success' : 'row-error'}>
                  <td>{i + 1}</td>
                  <td>{r.name}</td>
                  <td className={`cell-tweet${r.status === 'error' ? ' cell-error-text' : ''}`}>
                    {r.status === 'success' ? r.message : (r.error || 'Generation failed')}
                  </td>
                  <td>{r.status === 'success' ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
