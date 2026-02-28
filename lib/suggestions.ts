import { TabKey } from './tabs';

export type SuggestionLane = 'body' | 'environment' | 'cognitive';

export type Suggestion = {
  id: string;
  lane: SuggestionLane;
  categories: Array<TabKey | 'all'>;
  primarySymbols: string[];
  text: string;
  intensity: 'low' | 'med';
};

const ALL_SYMBOLS = ['all', '●', '◯', '◉', '◑', '⊜', '⊕'];

const suggestionsLibrary: Suggestion[] = [
  {
    id: 'body-breath-4-6',
    lane: 'body',
    categories: ['all'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Inhale 4 seconds, exhale 6 seconds (repeat 5 times).',
    intensity: 'low'
  },
  {
    id: 'body-move-90',
    lane: 'body',
    categories: ['all'],
    primarySymbols: ['all', '◉', '◑', '⊜', '⊕'],
    text: 'Move your body for 90 seconds (walk, stretch, shake out tension).',
    intensity: 'med'
  },
  {
    id: 'body-release-jaw-shoulders',
    lane: 'body',
    categories: ['all'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Unclench your jaw and drop your shoulders once. Repeat.',
    intensity: 'low'
  },
  {
    id: 'env-remove-noise',
    lane: 'environment',
    categories: ['all', 'anger_boundary'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Remove one source of noise or stimulation.',
    intensity: 'low'
  },
  {
    id: 'env-step-outside',
    lane: 'environment',
    categories: ['all'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Step outside for 2 minutes.',
    intensity: 'low'
  },
  {
    id: 'env-change-room-light',
    lane: 'environment',
    categories: ['all'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Change rooms or change lighting (small reset).',
    intensity: 'low'
  },
  {
    id: 'cog-buy-time',
    lane: 'cognitive',
    categories: ['all'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Don’t answer immediately. Buy time before responding.',
    intensity: 'low'
  },
  {
    id: 'cog-neutral-truth',
    lane: 'cognitive',
    categories: ['all'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Name one neutral truth: “I’m having a hard moment.”',
    intensity: 'low'
  },
  {
    id: 'cog-text-support',
    lane: 'cognitive',
    categories: ['all'],
    primarySymbols: ['all', '●', '◯', '◉', '◑'],
    text: 'Text a trauma-informed person (one sentence is enough).',
    intensity: 'med'
  },
  {
    id: 'cog-save-for-therapy',
    lane: 'cognitive',
    categories: ['all'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Save this entry to discuss with a therapist or trusted person.',
    intensity: 'low'
  },
  {
    id: 'conflict-delay-reply',
    lane: 'cognitive',
    categories: ['conflict'],
    primarySymbols: ['all', '◉', '◯', '◑'],
    text: 'Delay the reply. Space first, clarity second.',
    intensity: 'med'
  },
  {
    id: 'conflict-remove-escalators',
    lane: 'environment',
    categories: ['conflict'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Remove yourself from escalating factors (screen, room, tone).',
    intensity: 'med'
  },
  {
    id: 'shame-talk-younger-self',
    lane: 'cognitive',
    categories: ['shame_spiral'],
    primarySymbols: ['all', '●', '◯', '◑'],
    text: 'Talk to yourself like you’re speaking to a younger version of you.',
    intensity: 'med'
  },
  {
    id: 'shame-separate-identity',
    lane: 'cognitive',
    categories: ['shame_spiral'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Separate behavior from identity (what happened ≠ who you are).',
    intensity: 'low'
  },
  {
    id: 'overthink-five-min-timer',
    lane: 'cognitive',
    categories: ['overthinking_loop'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Set a 5-minute timer. Decide one small next step.',
    intensity: 'low'
  },
  {
    id: 'overthink-two-min-task',
    lane: 'cognitive',
    categories: ['overthinking_loop'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Do one 2-minute task (trash, dishes, shower start).',
    intensity: 'low'
  },
  {
    id: 'people-ask-for-time',
    lane: 'cognitive',
    categories: ['people_pleasing'],
    primarySymbols: ['all', '◯', '◑', '⊕'],
    text: 'Pause before saying yes. Ask for time.',
    intensity: 'low'
  },
  {
    id: 'people-practice-no',
    lane: 'cognitive',
    categories: ['people_pleasing'],
    primarySymbols: ['all', '◯', '◑', '⊜'],
    text: 'Practice saying no in one sentence. Save it for later.',
    intensity: 'low'
  },
  {
    id: 'freeze-prioritize-rest-food-safety',
    lane: 'body',
    categories: ['freeze_stuck'],
    primarySymbols: ['all', '●', '◯'],
    text: 'Prioritize rest, food, and safe environments.',
    intensity: 'med'
  },
  {
    id: 'freeze-nature-pet',
    lane: 'environment',
    categories: ['freeze_stuck'],
    primarySymbols: ['all', '●', '◯', '◑'],
    text: 'Connect with nature or a pet.',
    intensity: 'low'
  },
  {
    id: 'anger-light-hearted-person',
    lane: 'cognitive',
    categories: ['anger_boundary'],
    primarySymbols: ['all', '◉', '⊜', '◑'],
    text: 'Think of someone who would make this moment light-hearted.',
    intensity: 'low'
  },
  {
    id: 'win-celebrate',
    lane: 'cognitive',
    categories: ['record_win'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Celebrate yourself. Don’t minimize it.',
    intensity: 'low'
  },
  {
    id: 'win-record-what-worked',
    lane: 'cognitive',
    categories: ['record_win'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Record what worked so you can reuse it next time you’re flooded.',
    intensity: 'low'
  },
  {
    id: 'win-create-meaningful',
    lane: 'environment',
    categories: ['record_win'],
    primarySymbols: ALL_SYMBOLS,
    text: 'Create something meaningful today (small counts).',
    intensity: 'low'
  }
];

const LANE_ORDER: SuggestionLane[] = ['body', 'environment', 'cognitive'];

export const PRIMARY_SYMBOL_PRIORITY = ['●', '◯', '◉', '◑', '⊜', '⊕'];

export function getPrimarySymbol(symbols: string[]) {
  for (const symbol of PRIMARY_SYMBOL_PRIORITY) {
    if (symbols.includes(symbol)) return symbol;
  }
  return '◑';
}

function isCategoryMatch(suggestion: Suggestion, category: TabKey) {
  return suggestion.categories.includes(category) || suggestion.categories.includes('all');
}

function isSymbolMatch(suggestion: Suggestion, symbol: string) {
  return suggestion.primarySymbols.includes('all') || suggestion.primarySymbols.includes(symbol);
}

function sortByPreference(items: Suggestion[], category: TabKey) {
  return [...items].sort((a, b) => {
    const aScore = a.categories.includes(category) ? 0 : 1;
    const bScore = b.categories.includes(category) ? 0 : 1;
    return aScore - bScore;
  });
}

export function getTryOneSuggestions(params: {
  category: TabKey;
  primarySymbol: string;
  rotationSeed: number;
  previousHash?: string;
}) {
  const { category, primarySymbol, rotationSeed, previousHash } = params;

  const picked: Suggestion[] = [];

  for (const lane of LANE_ORDER) {
    const laneCandidates = suggestionsLibrary.filter((item) => item.lane === lane && isCategoryMatch(item, category));
    let scoped = laneCandidates.filter((item) => item.categories.includes(category) && isSymbolMatch(item, primarySymbol));

    if (scoped.length === 0) {
      scoped = laneCandidates.filter((item) => isSymbolMatch(item, primarySymbol));
    }

    if (scoped.length === 0) {
      scoped = laneCandidates;
    }

    const sorted = sortByPreference(scoped, category);
    const index = rotationSeed % sorted.length;
    picked.push(sorted[index]);
  }

  let ids = picked.map((item) => item.id);
  let hash = ids.join('|');

  if (previousHash && hash === previousHash) {
    ids = picked.map((item, idx) => {
      const lane = LANE_ORDER[idx];
      const laneCandidates = sortByPreference(
        suggestionsLibrary.filter((candidate) => candidate.lane === lane && isCategoryMatch(candidate, category) && isSymbolMatch(candidate, primarySymbol)),
        category
      );
      if (laneCandidates.length <= 1) return item.id;
      const nextIndex = (laneCandidates.findIndex((candidate) => candidate.id === item.id) + 1) % laneCandidates.length;
      return laneCandidates[nextIndex].id;
    });

    hash = ids.join('|');
  }

  const trio = ids
    .map((id) => suggestionsLibrary.find((item) => item.id === id))
    .filter((item): item is Suggestion => Boolean(item));

  return {
    suggestions: trio,
    hash
  };
}
