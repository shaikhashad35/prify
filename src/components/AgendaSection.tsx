interface Props {
  agenda: string;
  onAgendaChange: (value: string) => void;
}

export default function AgendaSection({ agenda, onAgendaChange }: Props) {
  return (
    <section className="card">
      <div className="card-header">
        <span className="step-badge">Step 3</span>
        <h2>PR Agenda</h2>
      </div>
      <div className="card-body">
        <p className="hint">
          Describe what you want to promote. Be specific — the more detail, the better the tweets.
        </p>
        <textarea
          rows={5}
          value={agenda}
          onChange={e => onAgendaChange(e.target.value)}
          placeholder="Example: Promote the upcoming clean water initiative by XYZ Foundation launching on March 15. Highlight the importance of clean drinking water in rural India and encourage people to donate."
        />
        <div className="char-count">{agenda.length} characters</div>
      </div>
    </section>
  );
}
