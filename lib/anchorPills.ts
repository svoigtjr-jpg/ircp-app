export type AnchorPill = {
  id: string;
  symbol: string;
  label: string;
  microDescription: string;
  toneColor: string;
};

export const ANCHOR_PILLS: AnchorPill[] = [
  {
    id: 'connected_centered_flexible',
    symbol: '⊕',
    label: 'Connected. Centered. Flexible.',
    microDescription: 'You feel steady, present, and able to respond instead of react.',
    toneColor: '#5f7f84'
  },
  {
    id: 'energized_but_steady',
    symbol: '⊜',
    label: 'You can handle daily stress without losing connection.',
    microDescription: 'You can handle daily stress without losing connection.',
    toneColor: '#7a7163'
  },
  {
    id: 'something_feels_off',
    symbol: '◑',
    label: 'At the tipping point.',
    microDescription: 'Something doesn’t feel safe. Grounded thinking is slipping as protection prepares to take over.',
    toneColor: '#6d7286'
  },
  {
    id: 'stress_is_running_this',
    symbol: '◉',
    label: 'Stress is running this.',
    microDescription: 'Your body is in protection mode and reacting quickly.',
    toneColor: '#7b6f7f'
  },
  {
    id: 'shrinking_to_keep_calm',
    symbol: '◯',
    label: 'Holding it in.',
    microDescription: 'Pressure stays trapped inside while your boundaries thin to keep the surface calm.',
    toneColor: '#6d7c72'
  },
  {
    id: 'shutting_down',
    symbol: '●',
    label: 'I’m shutting down.',
    microDescription: 'Your system is conserving energy and pulling inward.',
    toneColor: '#766f67'
  }
];

export const ANCHOR_PILLS_BY_ID = Object.fromEntries(ANCHOR_PILLS.map((pill) => [pill.id, pill])) as Record<string, AnchorPill>;
