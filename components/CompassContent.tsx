import React from 'react';

const FLOW_STEPS = [
  'Pause and orient to your body before writing.',
  'Choose the topic that best matches your current experience.',
  'Answer prompts in short, honest phrases—no performance needed.',
  'Notice patterns with curiosity, not judgment.',
  'Name one next-right action and close gently.'
];

const CORE_PATH_STEPS = [
  {
    title: 'Awareness',
    description: 'Name what is happening in your body and nervous system right now.'
  },
  {
    title: 'Observation',
    description: 'Separate facts from interpretation with steady attention.'
  },
  {
    title: 'Pattern Recognition',
    description: 'Notice recurring loops, triggers, and protective strategies.'
  },
  {
    title: 'Freedom',
    description: 'Choose a grounded response that aligns with your values.'
  }
];

const WHEN_TO_USE = [
  'After conflict, overwhelm, shutdown, or looping thoughts.',
  'When you want clearer language for emotions, needs, and next steps.',
  'For brief daily check-ins to build reflection rhythm.'
];

const WHEN_NOT_TO_USE = [
  'Not for emergencies, crisis stabilization, or immediate safety threats.',
  'Not as a substitute for medical, legal, or licensed mental health care.',
  'If reflection increases distress, pause and seek trusted live support.'
];

export default function CompassContent() {
  return (
    <article className="compass-print" aria-label="User Compass reference">
      <header className="compassSection">
        <h2 className="compassTitle">User Compass</h2>
        <p className="compassSubtitle">Structure for reflection. Not instruction.</p>
      </header>

      <div className="compassPrintColumns">
        <section className="compassSection compassBreakAfter">
          <h3>What IRCP Is</h3>
          <ul>
            <li>A guided reflection framework for nervous-system-aware journaling.</li>
            <li>A way to slow down, name experience, and restore clarity.</li>
            <li>A practical bridge from reaction to aligned action.</li>
          </ul>
        </section>

        <section className="compassSection compassBreakAfter">
          <h3>How to Move Through It</h3>
          <ol>
            {FLOW_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="compassSection compassBreakAfter">
          <h3>The Core Path</h3>
          <ul className="compassPathList">
            {CORE_PATH_STEPS.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="compassSection">
          <h3>When to Use</h3>
          <ul>
            {WHEN_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="compassSection">
          <h3>When Not to Use</h3>
          <ul>
            {WHEN_NOT_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="compassSafetyNote">Safety note: If you may harm yourself or someone else, contact local emergency services immediately.</p>
        </section>
      </div>
    </article>
  );
}
