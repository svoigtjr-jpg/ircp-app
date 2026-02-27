export type IrcpState = {
  id: string;
  humanLabel: string;
  expandedLines: string[];
  clinicalLabel: string;
  commonPattern: string;
  stabilizers: string[];
  metrics: {
    activation: 1 | 2 | 3 | 4 | 5;
    connection: 1 | 2 | 3 | 4 | 5;
    pli: 1 | 2 | 3 | 4 | 5 | 6;
  };
};

export const IRCP_STATES: IrcpState[] = [
  {
    id: 'ventral',
    humanLabel: 'Free to Be Myself.',
    expandedLines: ['I belong here.', 'I’m not performing.', 'I don’t have to prove anything.'],
    clinicalLabel: 'Regulated state (ventral vagal engagement).',
    commonPattern: 'Steady heart rate, clear thinking, relaxed body, social ease.',
    stabilizers: [
      'Notice that you feel steady right now.',
      'Celebrate something specific you handled well.',
      'Let yourself stay unguarded for a moment longer.',
      'Record this experience. You may need the reminder later.'
    ],
    metrics: { activation: 3, connection: 5, pli: 1 }
  },
  {
    id: 'mobilized',
    humanLabel: 'Might punch you. Might disappear.',
    expandedLines: [
      'Say one more thing.',
      'I’ll handle it myself.',
      'Everything feels urgent.',
      'I’m either exploding or leaving.'
    ],
    clinicalLabel: 'Heightened sympathetic activation (fight-or-flight).',
    commonPattern: 'Elevated heart rate, muscle tension, urgency in thoughts, narrowed focus.',
    stabilizers: [
      'Do not respond yet.',
      'Move your body for 3 minutes.',
      'Inhale 4 seconds, exhale 6 (repeat 5 times).',
      'Focus on people, places, or things that help you co-regulate — remove yourself from escalating factors.'
    ],
    metrics: { activation: 5, connection: 2, pli: 4 }
  },
  {
    id: 'shutdown_light',
    humanLabel: 'Meh.',
    expandedLines: [
      'Nothing feels urgent.',
      'I’m just going through it.',
      'It’s fine. I guess.',
      'I don’t feel pulled toward anything.'
    ],
    clinicalLabel: 'Low activation / blunted engagement (mild dorsal shift).',
    commonPattern: 'Reduced energy, muted emotion, decreased initiative, passive participation.',
    stabilizers: [
      'Stand up. That’s enough.',
      'Drink a glass of water.',
      'Change rooms.',
      'Wash your face or brush your teeth.'
    ],
    metrics: { activation: 2, connection: 2, pli: 5 }
  },
  {
    id: 'fawn',
    humanLabel: 'I’ll adjust. Again.',
    expandedLines: ['I’ll do it to keep the peace.', 'I want to say no.', 'Shrinking feels easier.'],
    clinicalLabel: 'Appeasement / fawn response (social survival strategy).',
    commonPattern: 'Over-attunement to others, suppressed needs, internal tension under compliance.',
    stabilizers: [
      'Don’t answer immediately.',
      'Say, “Let me think about that.”',
      'Practice saying no — privately first.',
      'Save this information to discuss with a therapist or trusted person.'
    ],
    metrics: { activation: 4, connection: 3, pli: 4 }
  },
  {
    id: 'overstim',
    humanLabel: 'LOUD NOISES!',
    expandedLines: [
      'One more noise and I combust.',
      'Everything is too loud.',
      'Not another thing.',
      'My brain is full.'
    ],
    clinicalLabel: 'Sensory overload / heightened arousal.',
    commonPattern: 'Lower tolerance, irritability, sensory sensitivity, mental saturation.',
    stabilizers: [
      'Remove one source of noise.',
      'Step away from people for 5 minutes.',
      'Drink cold water.',
      'Think of someone who would make this moment feel lighter.'
    ],
    metrics: { activation: 5, connection: 2, pli: 4 }
  },
  {
    id: 'shutdown_deep',
    humanLabel: 'Sleep. Avoid. Repeat.',
    expandedLines: ['Bare minimum mode.', 'I’ll deal with it later.', 'I don’t have the energy.', 'I’m not really here.'],
    clinicalLabel: 'Low-energy withdrawal pattern (dorsal vagal dominance).',
    commonPattern: 'Brain fog, physical heaviness, social withdrawal, reduced responsiveness.',
    stabilizers: ['Stay where you feel safe.', 'Prioritize rest and recovery.', 'Eat something simple.', 'Connect with nature or pets.'],
    metrics: { activation: 1, connection: 1, pli: 6 }
  }
];

export const IRCP_STATES_BY_ID = Object.fromEntries(IRCP_STATES.map((state) => [state.id, state])) as Record<string, IrcpState>;

const LEGACY_STATE_ID_MAP: Record<string, string> = {
  shutdown: 'shutdown_light',
  overstimulation: 'overstim',
  dorsal_drift: 'shutdown_deep'
};

const LEGACY_STATE_LABEL_MAP: Record<string, string> = {
  'free to be myself.': 'ventral',
  'might punch you. might disappear.': 'mobilized',
  'meh.': 'shutdown_light',
  'i’ll adjust. again.': 'fawn',
  'loud noises!': 'overstim',
  'sleep. avoid. repeat.': 'shutdown_deep'
};

function normalizeKey(v: string) {
  return v.trim().toLowerCase();
}

export function resolveIrcpState(stateId?: string | null, stateLabel?: string | null): IrcpState | null {
  const normalizedId = normalizeKey(stateId ?? '');
  const mappedId = LEGACY_STATE_ID_MAP[normalizedId] ?? normalizedId;
  if (mappedId && IRCP_STATES_BY_ID[mappedId]) {
    return IRCP_STATES_BY_ID[mappedId];
  }

  const normalizedLabel = normalizeKey(stateLabel ?? '');
  const mappedLabelId = LEGACY_STATE_LABEL_MAP[normalizedLabel];
  if (mappedLabelId && IRCP_STATES_BY_ID[mappedLabelId]) {
    return IRCP_STATES_BY_ID[mappedLabelId];
  }

  return null;
}
