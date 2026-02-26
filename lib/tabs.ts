export type TabKey =
  | "record_win"
  | "shame_spiral"
  | "conflict"
  | "overthinking_loop"
  | "people_pleasing"
  | "freeze_stuck"
  | "anger_boundary";

type NorthStarPoint = { label: string; text: string };

export type TabConfig = {
  label: string;
  tagline: string;

  situationPrompt: string;
  factsPrompt: string;
  meaningPrompt: string;
  stepPrompt: string;
  lockPrompt: string;

  quickEmotions: string[];
  quickNeeds: string[];

  northStar: { blurb: string; points: NorthStarPoint[] };
};

export const TAB_CONFIGS: Record<TabKey, TabConfig> = {
  record_win: {
    label: "Record a Win",
    tagline: "Train your brain to notice progress, not just problems.",
    situationPrompt: "Where/when did this happen? Keep it to 1–2 sentences.",
    factsPrompt: "What did you do (or choose) that mattered? Facts only.",
    meaningPrompt: "What does this prove about you or your growth?",
    stepPrompt: "One small action to reinforce this momentum.",
    lockPrompt: "Write a short statement you want to remember.",
    quickEmotions: ["Proud","Relieved","Calm","Grateful","Hopeful","Motivated"],
    quickNeeds: ["Recognition","Rest","Support","Consistency","Connection","Purpose"],
    northStar: {
      blurb: "Early learning pillars that unlock clarity and freedom.",
      points: [
        { label: "Awareness", text: "Notice what’s happening inside you — without judgment." },
        { label: "Observation", text: "Watch triggers, body signals, and thoughts like data." },
        { label: "Pattern Recognition", text: "Connect the dots across time. Patterns = leverage." }
      ]
    }
  },

  shame_spiral: {
    label: "Shame Spiral",
    tagline: "Name the spiral, reduce the heat, and rebuild dignity.",
    situationPrompt: "What triggered the shame (where/when)?",
    factsPrompt: "What happened, and what did your inner critic say?",
    meaningPrompt: "What is shame trying to do (protect, punish, control)?",
    stepPrompt: "One dignified step you can take today.",
    lockPrompt: "Write a kinder, truer statement you can believe.",
    quickEmotions: ["Ashamed","Embarrassed","Anxious","Defensive","Sad","Angry"],
    quickNeeds: ["Repair","Reassurance","Safety","Clarity","Boundaries","Support"],
    northStar: {
      blurb: "Shame feels like truth, but it’s often old conditioning with a megaphone.",
      points: [
        { label: "Truth", text: "Separate facts from self-attack." },
        { label: "Body", text: "Soften jaw/shoulders; lengthen exhale." },
        { label: "Compassion", text: "Talk to yourself like someone you protect." },
        { label: "Repair", text: "A small repair beats endless punishment." }
      ]
    }
  },

  conflict: {
    label: "Conflict",
    tagline: "Slow down the threat response and choose your lane.",
    situationPrompt: "Who/what/when — what’s the core situation?",
    factsPrompt: "What was said/done (no mind-reading)?",
    meaningPrompt: "What do you actually need underneath the tension?",
    stepPrompt: "Pause, clarify, boundary, or repair — pick one.",
    lockPrompt: "Write the one sentence you want to say calmly.",
    quickEmotions: ["Frustrated","Hurt","Angry","Overwhelmed","Nervous","Misunderstood"],
    quickNeeds: ["Respect","Clarity","Boundaries","Repair","Space","Fairness"],
    northStar: {
      blurb: "Conflict is information. Your job is to keep it from becoming a fire.",
      points: [
        { label: "Lane", text: "What’s mine to own vs theirs to own?" },
        { label: "Clarity", text: "Ask, don’t assume." },
        { label: "Boundary", text: "Protect the relationship by protecting your limits." },
        { label: "Repair", text: "Repair is a skill, not a personality trait." }
      ]
    }
  },

  overthinking_loop: {
    label: "Overthinking Loop",
    tagline: "Turn mental spinning into a simple decision tree.",
    situationPrompt: "What are you looping on (one sentence)?",
    factsPrompt: "What question are you trying to answer or avoid?",
    meaningPrompt: "What fear is driving the loop (uncertainty, rejection, failure)?",
    stepPrompt: "One action that creates new data (instead of more thinking).",
    lockPrompt: "Write: “I’m allowed to choose with incomplete information.”",
    quickEmotions: ["Anxious","Uncertain","Restless","Doubtful","Irritable","Stuck"],
    quickNeeds: ["Clarity","Grounding","Support","Time","Structure","Simplicity"],
    northStar: {
      blurb: "Overthinking is often protection disguised as productivity.",
      points: [
        { label: "Question", text: "Name the exact question." },
        { label: "Data", text: "What evidence do I actually have?" },
        { label: "Action", text: "One small experiment breaks the loop." },
        { label: "Rest", text: "Your brain can’t solve safety by sprinting." }
      ]
    }
  },

  people_pleasing: {
    label: "People-Pleasing",
    tagline: "Track the moment you abandon yourself — then renegotiate.",
    situationPrompt: "Where did you feel pressure to please?",
    factsPrompt: "What was asked/implied, and what did you say/do?",
    meaningPrompt: "What were you trying to avoid (conflict, rejection, disapproval)?",
    stepPrompt: "Smallest boundary or honest statement you can make.",
    lockPrompt: "Write a respectful “no” you could actually use.",
    quickEmotions: ["Nervous","Guilty","Pressured","Resentful","Anxious","Tired"],
    quickNeeds: ["Boundaries","Autonomy","Respect","Safety","Space","Reassurance"],
    northStar: {
      blurb: "People-pleasing buys short-term peace and sells long-term resentment.",
      points: [
        { label: "Body", text: "Notice the yes that feels like a stomach drop." },
        { label: "Truth", text: "Your needs are not an inconvenience." },
        { label: "Boundary", text: "A clean no is kinder than a resentful yes." },
        { label: "Repair", text: "You can renegotiate after the fact." }
      ]
    }
  },

  freeze_stuck: {
    label: "Freeze / Stuck",
    tagline: "Reduce overwhelm and pick one gentle move.",
    situationPrompt: "What feels frozen or impossible right now?",
    factsPrompt: "What are you avoiding or unable to start (no shame)?",
    meaningPrompt: "What might freeze be protecting you from?",
    stepPrompt: "Smallest doable action (2 minutes counts).",
    lockPrompt: "Define success as the smallest version today.",
    quickEmotions: ["Numb","Overwhelmed","Hopeless","Anxious","Tired","Confused"],
    quickNeeds: ["Rest","Safety","Support","Simplicity","Time","Reassurance"],
    northStar: {
      blurb: "Freeze is not laziness. It’s a nervous system brake slam.",
      points: [
        { label: "Reduce", text: "Shrink the task until it’s non-threatening." },
        { label: "Body", text: "Warmth, water, breath, movement." },
        { label: "Support", text: "Ask for one specific kind of help." },
        { label: "Win", text: "2 minutes counts. It all counts." }
      ]
    }
  },

  anger_boundary: {
    label: "Anger / Boundary",
    tagline: "Anger is energy + information. Aim it cleanly.",
    situationPrompt: "What boundary feels crossed (where/when)?",
    factsPrompt: "What happened (facts only)?",
    meaningPrompt: "What value or boundary is anger protecting?",
    stepPrompt: "Write the boundary you will enforce — calmly.",
    lockPrompt: "One sentence: “When X happens, I will Y.”",
    quickEmotions: ["Angry","Irritated","Hurt","Protective","Frustrated","Fed up"],
    quickNeeds: ["Respect","Boundaries","Safety","Fairness","Space","Clarity"],
    northStar: {
      blurb: "Anger becomes destructive when it’s the only tool. Make it one tool.",
      points: [
        { label: "Signal", text: "Anger is often “something is not okay.”" },
        { label: "Boundary", text: "Say what you will do, not what they must be." },
        { label: "Calm", text: "Power lands better when delivered slowly." },
        { label: "Follow-through", text: "A boundary without action is a wish." }
      ]
    }
  }
};
