import Link from 'next/link';
import { ANCHOR_PILLS } from '../../lib/anchorPills';

const BEHAVIORS_BY_SYMBOL: Record<string, string[]> = {
  '⊕': [
    'Curiosity in conversation',
    'Clear and respectful boundaries',
    'Willingness to repair after tension',
    'Tolerates disagreement without escalation'
  ],
  '⊜': [
    'Assertive communication',
    'Direct action-taking',
    'Protective but measured responses',
    'Productive use of energy'
  ],
  '◑': [
    'Shorter patience and rising urgency',
    'Narrowing focus under stress',
    'Sensitivity to tone and ambiguity',
    'Reduced access to flexible thinking'
  ],
  '◉': [
    'Reactive or sharp responses',
    'Urgent need to resolve immediately',
    'Black-and-white conclusions',
    'Defensive posture in conflict'
  ],
  '◯': [
    'Self-blame after conflict',
    'Over-apologizing',
    'People-pleasing to reduce tension',
    'Replaying conversations repeatedly'
  ],
  '●': [
    'Withdrawing from interaction',
    'Avoiding decisions or conversations',
    'Low motivation',
    'Emotional numbness or detachment'
  ]
};

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
        {ANCHOR_PILLS.map((item) => (
          <section key={item.id} className="card2 symbolKeySection">
            <h2 className="symbolKeyHeading">{item.symbol} {item.title}</h2>
            <p className="symbolKeyDefinition">{item.description}</p>
            <div className="small" style={{ marginBottom: 6 }}>Common behaviors:</div>
            <ul className="symbolKeyBullets">
              {(BEHAVIORS_BY_SYMBOL[item.symbol] || []).map((behavior) => (
                <li key={behavior}>{behavior}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
