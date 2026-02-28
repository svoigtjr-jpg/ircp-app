import { TabKey } from './tabs';

export type CategoryEmotionPulls = {
  suggested: string[];
  more: string[];
};

export const CATEGORY_EMOTION_PULLS: Record<TabKey, CategoryEmotionPulls> = {
  conflict: {
    suggested: ['Angry', 'Overwhelmed', 'Defensive', 'Frustrated', 'Hurt', 'Anxious'],
    more: ['Resentful', 'Disrespected', 'Irritated', 'Confused', 'Sad', 'Shame']
  },
  shame_spiral: {
    suggested: ['Shame', 'Anxious', 'Sad', 'Exposed', 'Guilty', 'Overwhelmed'],
    more: ['Embarrassed', 'Worthless', 'Defective', 'Lonely', 'Self-doubt', 'Hopeless']
  },
  people_pleasing: {
    suggested: ['Anxious', 'Guilty', 'Resentful', 'Afraid', 'Overwhelmed', 'Small'],
    more: ['Invisible', 'Tense', 'Conflicted', 'Unsafe', 'Irritated', 'Shame']
  },
  overthinking_loop: {
    suggested: ['Anxious', 'Overwhelmed', 'Uncertain', 'Confused', 'Restless', 'Stuck'],
    more: ['Afraid', 'Frustrated', 'Self-doubt', 'Distracted', 'Pressured', 'Shame']
  },
  freeze_stuck: {
    suggested: ['Numb', 'Tired', 'Overwhelmed', 'Hopeless', 'Lonely', 'Shut down'],
    more: ['Foggy', 'Heavy', 'Afraid', 'Sad', 'Disconnected', 'Shame']
  },
  anger_boundary: {
    suggested: ['Angry', 'Irritated', 'Resentful', 'Disrespected', 'Pressured', 'Defensive'],
    more: ['Frustrated', 'Overwhelmed', 'Hurt', 'Protective', 'Tense', 'Done']
  },
  record_win: {
    suggested: ['Proud', 'Relieved', 'Grateful', 'Calm', 'Connected', 'Hopeful'],
    more: ['Motivated', 'Confident', 'Clear', 'Grounded', 'Energized', 'Peaceful']
  }
};

export type CategoryAnchorPill = {
  id: string;
  symbol: string;
  label: string;
  note: string;
};

export const CATEGORY_ANCHOR_PILLS: Record<TabKey, CategoryAnchorPill[]> = {
  conflict: [
    { id: 'conflict-1', symbol: '⊜', label: 'I can talk without burning it down.', note: 'I’m heated, but I still have steering.' },
    { id: 'conflict-2', symbol: '◉', label: 'Say one more thing.', note: 'Everything feels urgent. I’m either exploding or leaving.' },
    { id: 'conflict-3', symbol: '◉', label: 'I need space right now.', note: 'My brain is fried. I can’t process mid-argument.' },
    { id: 'conflict-4', symbol: '◯', label: 'I’ll adjust. Again.', note: 'I’m shrinking to keep it calm. I want to say no.' },
    { id: 'conflict-5', symbol: '●', label: 'I’m shutting down.', note: 'I’m going numb. I can’t access words.' },
    { id: 'conflict-6', symbol: '⊕', label: 'I stayed present and clear.', note: 'I held my boundary without escalating.' }
  ],
  shame_spiral: [
    { id: 'shame-1', symbol: '◯', label: 'It’s my fault. Obviously.', note: 'I’m blaming myself for everything.' },
    { id: 'shame-2', symbol: '◉', label: 'I can’t turn my brain off.', note: 'Thoughts are looping like a broken record.' },
    { id: 'shame-3', symbol: '◑', label: 'I feel exposed.', note: 'Small, watched, judged—even if nobody’s judging me.' },
    { id: 'shame-4', symbol: '●', label: 'I want to disappear.', note: 'Low energy. No capacity for people.' },
    { id: 'shame-5', symbol: '⊜', label: 'I can interrupt the spiral.', note: 'Not fixed—just slowing it down.' },
    { id: 'shame-6', symbol: '⊕', label: 'I have my own back today.', note: 'Kindness without earning it.' }
  ],
  people_pleasing: [
    { id: 'people-1', symbol: '◯', label: 'I’ll adjust. Again.', note: 'Shrinking to keep things calm.' },
    { id: 'people-2', symbol: '◯', label: 'I don’t want to fight. I’ll stay quiet.', note: 'Silence feels safer than honesty.' },
    { id: 'people-3', symbol: '◑', label: 'I’m overthinking my tone.', note: 'Trying to be acceptable instead of real.' },
    { id: 'people-4', symbol: '◉', label: 'I feel trapped in being nice.', note: 'Resentful, but smiling.' },
    { id: 'people-5', symbol: '⊜', label: 'I can pause before I say yes.', note: 'Buy time and check myself.' },
    { id: 'people-6', symbol: '⊕', label: 'I can say no without explaining.', note: 'My needs count too.' }
  ],
  overthinking_loop: [
    { id: 'overthink-1', symbol: '◉', label: 'My brain won’t stop running scenarios.', note: 'Trying to solve the future.' },
    { id: 'overthink-2', symbol: '◑', label: 'I don’t trust my decision.', note: 'Everything feels like a trapdoor.' },
    { id: 'overthink-3', symbol: '◉', label: 'I need certainty before I move.', note: 'Perfection is blocking action.' },
    { id: 'overthink-4', symbol: '●', label: 'I’m stuck.', note: 'Too much input. No output.' },
    { id: 'overthink-5', symbol: '⊜', label: 'I can pick one tiny next step.', note: 'Not best—just real.' },
    { id: 'overthink-6', symbol: '⊕', label: 'I can choose and move on.', note: 'Trust myself enough to act.' }
  ],
  freeze_stuck: [
    { id: 'freeze-1', symbol: '●', label: 'I can’t move.', note: 'My body is offline.' },
    { id: 'freeze-2', symbol: '◑', label: 'I’m here, but not here.', note: 'Foggy, detached, slow.' },
    { id: 'freeze-3', symbol: '◉', label: 'Everything feels too much.', note: 'Overloaded—my system says nope.' },
    { id: 'freeze-4', symbol: '◯', label: 'I’m blaming myself for being stuck.', note: 'Self-attack on top of shutdown.' },
    { id: 'freeze-5', symbol: '⊜', label: 'I can do one gentle action.', note: 'Small movement counts.' },
    { id: 'freeze-6', symbol: '⊕', label: 'I’m back in my body.', note: 'Grounded and present.' }
  ],
  anger_boundary: [
    { id: 'anger-1', symbol: '◉', label: 'I’m about to snap.', note: 'My patience is gone.' },
    { id: 'anger-2', symbol: '◉', label: 'I feel disrespected.', note: 'My body reads threat.' },
    { id: 'anger-3', symbol: '◑', label: 'I’m irritated and I don’t know why.', note: 'Something’s off, leaking out.' },
    { id: 'anger-4', symbol: '⊜', label: 'I can be direct without being cruel.', note: 'Clean anger. Clean words.' },
    { id: 'anger-5', symbol: '⊜', label: 'I can pause before I respond.', note: 'Delay is power.' },
    { id: 'anger-6', symbol: '⊕', label: 'I held the line.', note: 'Boundary intact. No guilt spiral.' }
  ],
  record_win: [
    { id: 'win-1', symbol: '⊕', label: 'I’m proud of how I showed up.', note: 'Aligned with who I want to be.' },
    { id: 'win-2', symbol: '⊕', label: 'I stayed regulated under pressure.', note: 'Old me would’ve spiraled.' },
    { id: 'win-3', symbol: '⊜', label: 'I recovered faster than usual.', note: 'Bounced back instead of stuck.' },
    { id: 'win-4', symbol: '⊕', label: 'I created something meaningful.', note: 'Purpose is online.' },
    { id: 'win-5', symbol: '⊕', label: 'I held a boundary respectfully.', note: 'No explosion. No collapse.' },
    { id: 'win-6', symbol: '⊕', label: 'I used what I learned.', note: 'Progress, not performance.' }
  ]
};

export const ALL_CATEGORY_EMOTIONS = Array.from(
  new Set(Object.values(CATEGORY_EMOTION_PULLS).flatMap((group) => [...group.suggested, ...group.more]))
);
