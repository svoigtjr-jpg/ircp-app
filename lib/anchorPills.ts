export type AnchorPill = {
  id: string;
  symbol: string;
  title: string;
  description: string;
  toneColor: string;
};

export const ANCHOR_PILLS: AnchorPill[] = [
  {
    id: 'connected_centered_flexible',
    symbol: '⊕',
    title: 'Connected. Centered. Flexible.',
    description: 'Energy is steady. You feel present, clear, and able to respond without bracing.',
    toneColor: '#5f7f84'
  },
  {
    id: 'energized_but_steady',
    symbol: '⊜',
    title: 'Fired up. Not flooded.',
    description: 'You can handle daily stress without losing connection.',
    toneColor: '#7a7163'
  },
  {
    id: 'something_feels_off',
    symbol: '◑',
    title: 'At the tipping point.',
    description: 'Something doesn’t feel safe. Grounded thinking is slipping as protection prepares to take over.',
    toneColor: '#6d7286'
  },
  {
    id: 'stress_is_running_this',
    symbol: '◉',
    title: 'Reacting instead of responding.',
    description: 'Irritability rises. Your tone changes. Your body shifts. Stress starts running the show.',
    toneColor: '#7b6f7f'
  },
  {
    id: 'shrinking_to_keep_calm',
    symbol: '◯',
    title: 'It must be me.',
    description: 'The body goes quiet. The mind starts replaying. You take responsibility for things that may not belong to you.',
    toneColor: '#6d7c72'
  },
  {
    id: 'shutting_down',
    symbol: '●',
    title: 'Nothing left.',
    description: 'You withdraw, conserve, and reduce interaction to the bare minimum.',
    toneColor: '#766f67'
  }
];

export const ANCHOR_PILLS_BY_ID = Object.fromEntries(ANCHOR_PILLS.map((pill) => [pill.id, pill])) as Record<string, AnchorPill>;
