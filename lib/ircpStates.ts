export type IrcpState = {
  id: string;
  humanLabel: string;
  clinicalLabel: string;
  commonPattern: string;
  expandedLines: string[];
};

export const IRCP_STATES: IrcpState[] = [
  {
    id: 'ventral',
    humanLabel: 'Free to be myself.',
    expandedLines: [
      'I belong here.',
      'I’m not performing.',
      'I don’t have to prove anything.'
    ],
    clinicalLabel: 'Regulated state (often associated with ventral vagal engagement).',
    commonPattern: 'Steady heart rate, clearer thinking, easier connection.'
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
    clinicalLabel: 'Heightened sympathetic activation (fight-or-flight response).',
    commonPattern: 'Elevated heart rate, muscle tension, urgency in thoughts.'
  },
  {
    id: 'shutdown',
    humanLabel: 'Meh.',
    expandedLines: [
      'Nothing matters.',
      'Don’t ask me.',
      'I’m tired of explaining.',
      'I’d rather disappear.'
    ],
    clinicalLabel: 'Low-energy protective response (often associated with dorsal shutdown).',
    commonPattern: 'Low energy, heaviness, numbness, reduced engagement.'
  },
  {
    id: 'fawn',
    humanLabel: 'I’ll adjust. Again.',
    expandedLines: [
      'I’ll do it to keep the peace.',
      'I want to say no.',
      'Shrinking is comfortable.'
    ],
    clinicalLabel: 'Appeasement / fawn pattern (social survival strategy).',
    commonPattern: 'Over-attunement to others, tension under compliance.'
  },
  {
    id: 'overstimulation',
    humanLabel: 'LOUD NOISES!',
    expandedLines: [
      'One more noise and I combust.',
      'Everything is too loud.',
      'Not another thing.',
      'My brain is full.'
    ],
    clinicalLabel: 'Sensory overload / heightened arousal.',
    commonPattern: 'Lower tolerance, irritability, sensory sensitivity.'
  },
  {
    id: 'dorsal_drift',
    humanLabel: 'Sleep. Avoid. Repeat.',
    expandedLines: [
      'Bare minimum mode.',
      'I’ll do it later.',
      'Zero interest.',
      'I’m half here.'
    ],
    clinicalLabel: 'Low-energy withdrawal pattern (dorsal drift).',
    commonPattern: 'Brain fog, low motivation, social withdrawal.'
  }
];

export const IRCP_STATES_BY_ID = Object.fromEntries(
  IRCP_STATES.map((state) => [state.id, state])
) as Record<string, IrcpState>;
