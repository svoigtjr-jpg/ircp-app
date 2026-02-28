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
    label: 'Energized but steady.',
    microDescription: 'There’s energy in your system, but it’s contained and usable.',
    toneColor: '#7a7163'
  },
  {
    id: 'something_feels_off',
    symbol: '⊝',
    label: 'Something feels off.',
    microDescription: 'Tension is building and your system is narrowing slightly.',
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
    symbol: '◉⇠',
    label: 'I’m shrinking to keep things calm.',
    microDescription: 'You’re adjusting yourself to prevent conflict or disconnection.',
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
