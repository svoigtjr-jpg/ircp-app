import Link from 'next/link';

const SYMBOL_KEY = [
  {
    symbol: '⊕',
    label: 'Connected. Centered. Flexible.',
    definition: 'Stable regulation with connection and flexible engagement.',
    behaviors: [
      'Curiosity in conversation',
      'Clear and respectful boundaries',
      'Willingness to repair after tension',
      'Tolerates disagreement without escalation'
    ]
  },
  {
    symbol: '⊜',
    label: 'You can handle daily stress without losing connection.',
    definition: 'Activation is present, but grounded thinking and connection stay online.',
    behaviors: [
      'Assertive communication',
      'Direct action-taking',
      'Protective but measured responses',
      'Productive use of energy'
    ]
  },
  {
    symbol: '◑',
    label: 'At the tipping point.',
    definition: 'Something doesn’t feel safe. Grounded thinking is slipping as protection prepares to take over.',
    behaviors: [
      'Shorter patience and rising urgency',
      'Narrowing focus under stress',
      'Sensitivity to tone and ambiguity',
      'Reduced access to flexible thinking'
    ]
  },
  {
    symbol: '◉',
    label: 'Stress is running this.',
    definition: 'Acute outward stress response with narrowed cognitive processing.',
    behaviors: [
      'Reactive or sharp responses',
      'Urgent need to resolve immediately',
      'Black-and-white conclusions',
      'Defensive posture in conflict'
    ]
  },
  {
    symbol: '◯',
    label: 'Holding it in.',
    definition: 'Pressure builds inward while boundaries thin to preserve connection and reduce conflict.',
    behaviors: [
      'Self-blame after conflict',
      'Over-apologizing',
      'People-pleasing to reduce tension',
      'Replaying conversations repeatedly'
    ]
  },
  {
    symbol: '●',
    label: 'I’m shutting down.',
    definition: 'Energy withdrawal with reduced emotional engagement.',
    behaviors: [
      'Withdrawing from interaction',
      'Avoiding decisions or conversations',
      'Low motivation',
      'Emotional numbness or detachment'
    ]
  }
];

export default function SymbolKeyPage() {
  return (
    <div className="container symbolKeyPage">
      <div className="headerWrap surface">
        <div className="headerContent">
          <div className="h1 heroTitle">Symbol Key</div>
        </div>
        <Link href="/" className="btnLink">Back to Guide</Link>
      </div>

      <div className="symbolKeyList">
        {SYMBOL_KEY.map((item) => (
          <section key={item.label} className="card2 symbolKeySection">
            <h2 className="symbolKeyHeading">{item.symbol} {item.label}</h2>
            <p className="symbolKeyDefinition">{item.definition}</p>
            <div className="small" style={{ marginBottom: 6 }}>Common behaviors:</div>
            <ul className="symbolKeyBullets">
              {item.behaviors.map((behavior) => (
                <li key={behavior}>{behavior}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
