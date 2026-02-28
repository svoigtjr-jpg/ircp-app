import Link from 'next/link';

const SYMBOL_KEY = [
  {
    symbol: '⊕',
    label: 'Ventral (Safe / Connected)',
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
    label: 'Regulated Mobilization',
    definition: 'Purposeful activation with controlled and measured responses.',
    behaviors: [
      'Assertive communication',
      'Direct action-taking',
      'Protective but measured responses',
      'Productive use of energy'
    ]
  },
  {
    symbol: '⊝',
    label: 'Dysregulated Mobilization',
    definition: 'Heightened activation with subtle threat sensitivity.',
    behaviors: [
      'Irritable or shortened tone',
      'Overthinking interactions',
      'Reading negative intent into ambiguity',
      'Persistent mental scanning for problems'
    ]
  },
  {
    symbol: '◉',
    label: 'Fight / Flight',
    definition: 'Acute threat response with narrowed cognitive processing.',
    behaviors: [
      'Reactive or sharp responses',
      'Urgent need to resolve immediately',
      'Black-and-white conclusions',
      'Defensive posture in conflict'
    ]
  },
  {
    symbol: '◉⇠',
    label: 'Internalized Fight / Flight',
    definition: 'Inward threat response with self-directed tension.',
    behaviors: [
      'Self-blame after conflict',
      'Over-apologizing',
      'People-pleasing to reduce tension',
      'Replaying conversations repeatedly'
    ]
  },
  {
    symbol: '●',
    label: 'Shutdown / Collapse',
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
