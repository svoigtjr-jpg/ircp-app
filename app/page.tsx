'use client';

import { useMemo, useState } from 'react';
import UserCompass from '../components/UserCompass';
import { exportEntryToPdf, PdfEntry } from '../lib/pdf';
import { IRCP_STATES, IRCP_STATES_BY_ID, resolveIrcpState } from '../lib/ircpStates';
import { TAB_CONFIGS, TabConfig, TabKey } from '../lib/tabs';
import { EMOTIONS, NEEDS } from '../lib/vocab';

type Entry = {
  id: string;
  createdAt: string;
  tab: TabKey;

  situation: string;
  nsStateId: string;
  nsStateLabel: string;

  bodySignals: string;
  emotionsSelected: string[];
  emotionsOther: string;

  needsSelected: string[];
  needsOther: string;

  facts: string;
  meaning: string;
  nextRightStep: string;
  lockItIn: string;

  // Record win only
  experienceType: string;
  experienceOther: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
}

function toggle(arr: string[], v: string) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function nsAccent(nsStateId: string) {
  const s = (nsStateId || '').toLowerCase();
  if (s.includes('ventral')) return '#6e9f8f';
  if (s.includes('mobilized')) return '#c89a52';
  if (s.includes('shutdown')) return '#6f8195';
  if (s.includes('fawn')) return '#9a86a8';
  if (s.includes('overstimulation') || s.includes('overstim')) return '#4f9aa3';
  if (s.includes('dorsal')) return '#6d6e8b';
  return '#cdbfae';
}

function makeEmptyEntry(tab: TabKey): Entry {
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    tab,
    situation: '',
    nsStateId: '',
    nsStateLabel: '',
    bodySignals: '',
    emotionsSelected: [],
    emotionsOther: '',
    needsSelected: [],
    needsOther: '',
    facts: '',
    meaning: '',
    nextRightStep: '',
    lockItIn: '',
    experienceType: '',
    experienceOther: ''
  };
}

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<TabKey | null>(null);
  const [entry, setEntry] = useState<Entry>(() => makeEmptyEntry('record_win'));

  const cfg: TabConfig | null = selectedTab ? TAB_CONFIGS[selectedTab] : null;

  const [showMoreEmotions, setShowMoreEmotions] = useState(false);
  const [showMoreNeeds, setShowMoreNeeds] = useState(false);

  useMemo(() => {
    if (selectedTab) setEntry((e) => ({ ...e, tab: selectedTab }));
  }, [selectedTab]);

  const accent = nsAccent(entry.nsStateId);
  const selectedState = resolveIrcpState(entry.nsStateId, entry.nsStateLabel);
  const shouldShowStateDetails = Boolean(entry.nsStateId || entry.nsStateLabel);

  function startTopic(t: TabKey) {
    setSelectedTab(t);
    setEntry(makeEmptyEntry(t));
    setShowMoreEmotions(false);
    setShowMoreNeeds(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToLanding() {
    setSelectedTab(null);
    setShowMoreEmotions(false);
    setShowMoreNeeds(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetEntry() {
    if (!selectedTab) return;
    setEntry(makeEmptyEntry(selectedTab));
  }

  async function handleExportPdf() {
    if (!cfg) return;

    const pdfEntry: PdfEntry = {
      createdAt: entry.createdAt,
      tab: entry.tab,
      context: entry.situation,
      bodySignals: entry.bodySignals,
      nsState: entry.nsStateLabel,
      emotionsSelected: entry.emotionsSelected,
      emotionsOther: entry.emotionsOther,
      needsSelected: entry.needsSelected,
      needsOther: entry.needsOther,
      story: entry.facts,
      meaning: entry.meaning,
      nextRightStep: entry.nextRightStep,
      winOrReframe: entry.lockItIn,
      experienceType: entry.experienceType,
      experienceOther: entry.experienceOther
    };

    await exportEntryToPdf(pdfEntry, cfg);
  }

  return (
    <>
      {cfg && (
        <div className="northStarFixed" aria-label="North Star">
          <div className="northStarIcon">✦</div>
          <div className="northStarTip">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>North Star</div>
            <div className="small" style={{ marginBottom: 8 }}>{cfg.northStar.blurb}</div>
            <div className="col" style={{ gap: 8 }}>
              {cfg.northStar.points.map((p, i) => (
                <div key={i} className="small">
                  <strong style={{ color: 'var(--text-strong)' }}>{p.label}:</strong> {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="headerWrap surface">
          <UserCompass />
          <div className="headerContent">
            <div className="philosophy">Trauma-Informed by Default</div>
            <div className="brand">
              <div className="h1 heroTitle">Personal Guide</div>
              <div className="sub">Internal Rhythm &amp; Code Processing (IRCP)</div>
            </div>
            {!cfg && (
              <div className="heroInstruction">
                Start Below: Choose one topic. The guided questions appear after you choose.
              </div>
            )}
          </div>
          {cfg && <button className="btnLink changeTopicBtn" onClick={backToLanding}>Change topic</button>}
        </div>

        {!cfg ? (
          <>
            <div className="topicGrid">
              {Object.entries(TAB_CONFIGS).map(([k, v]) => (
                <div key={k} className={`topicCard ${k === "record_win" ? "topicCardWin" : ""}`} role="button" onClick={() => startTopic(k as TabKey)}>
                  <div className="topicTitleRow">
                    <div className="topicTitle">{v.label}</div>
                    <div className="topicIcon" aria-hidden>
                      {k === "record_win" ? "✓" : k === "conflict" ? "⚑" : k === "shame_spiral" ? "◔" : k === "overthinking_loop" ? "∞" : k === "people_pleasing" ? "☰" : k === "freeze_stuck" ? "⎔" : "⟡"}
                    </div>
                  </div>
                  <div className="topicTag">{v.tagline}</div>
                </div>
              ))}
            </div>

            <div className="small footerNote" style={{ marginTop: 12 }}>
              Tip: pick the one that matches your body right now. You can change topics anytime.
            </div>
          </>
        ) : (
          <div className="layoutShell">
            <div className="mainColumn">
              <div className="card2 stepCard">
                <div className="stepHeader">
                  <div className="stepNum">Start</div>
                  <div>
                    <div className="stepTitle">{cfg.label}</div>
                    <div className="sub">{cfg.tagline}</div>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              <div className="card2 stepCard accentStripe" style={{ borderLeftColor: accent }}>
                <div className="stepHeader">
                  <div className="stepNum">1</div>
                  <div>
                    <div className="stepTitle">Anchor</div>
                    <div className="sub">State + situation. 30 seconds.</div>
                  </div>
                </div>

                <div className="grid2">
                  <div>
                    <div className="label">Nervous system state</div>
                    <select
                      className="select"
                      value={entry.nsStateId}
                      onChange={(e) => {
                        const nextState = IRCP_STATES_BY_ID[e.target.value];
                        setEntry((x) => ({
                          ...x,
                          nsStateId: e.target.value,
                          nsStateLabel: nextState ? nextState.humanLabel : ''
                        }));
                      }}
                      style={{ borderColor: entry.nsStateId ? accent : undefined }}
                    >
                      <option value="">Select...</option>
                      {IRCP_STATES.map((state) => (
                        <option key={state.id} value={state.id}>{state.humanLabel}</option>
                      ))}
                    </select>

                    {shouldShowStateDetails && (
                      <div style={{ marginTop: 10 }}>
                        <div className="label" style={{ marginBottom: 4 }}>When I’m here, it sounds like…</div>
                        <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
                          {(selectedState?.expandedLines.length ? selectedState.expandedLines : ['—']).map((line) => (
                            <li key={line} style={{ marginBottom: 4 }}>{line}</li>
                          ))}
                        </ul>
                        <div className="small" style={{ marginTop: 8, color: 'hsl(var(--muted) / 0.75)' }}>
                          Clinical correlate: {selectedState?.clinicalLabel ?? '—'}
                        </div>
                        <div className="small" style={{ color: 'hsl(var(--muted) / 0.75)' }}>
                          Common pattern: {selectedState?.commonPattern ?? '—'}
                        </div>
                        <div className="small" style={{ marginTop: 8, color: 'hsl(var(--muted) / 0.75)' }}>Stabilizers:</div>
                        <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
                          {(selectedState?.stabilizers.length ? selectedState.stabilizers : ['—']).map((line) => (
                            <li key={line} style={{ marginBottom: 4 }}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {selectedTab === 'record_win' ? (
                    <div>
                      <div className="label">Win type</div>
                      <select
                        className="select"
                        value={entry.experienceType}
                        onChange={(e) => setEntry((x) => ({ ...x, experienceType: e.target.value }))}
                      >
                        <option value="">Select...</option>
                        {[
                          'Small win','Hard conversation','Boundary kept','Chose regulation','Self-respect',
                          'Parenting win','Health choice','Work effort','Connection','Courage','Other experience'
                        ].map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>

                      {entry.experienceType === 'Other experience' && (
                        <div style={{ marginTop: 8 }}>
                          <input
                            className="input"
                            value={entry.experienceOther}
                            onChange={(e) => setEntry((x) => ({ ...x, experienceOther: e.target.value }))}
                            placeholder="Type your own win type..."
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="label">Quick note (optional)</div>
                      <input className="input" placeholder="Leave blank" />
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="label">Situation</div>
                  <textarea
                    className="textarea"
                    value={entry.situation}
                    onChange={(e) => setEntry((x) => ({ ...x, situation: e.target.value }))}
                    placeholder={cfg.situationPrompt}
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="card2 stepCard">
                <div className="stepHeader">
                  <div className="stepNum">2</div>
                  <div>
                    <div className="stepTitle">Body → Emotion</div>
                    <div className="sub">Sensations first. Then name it.</div>
                  </div>
                </div>

                <div>
                  <div className="label">Body signals</div>
                  <textarea
                    className="textarea"
                    value={entry.bodySignals}
                    onChange={(e) => setEntry((x) => ({ ...x, bodySignals: e.target.value }))}
                    placeholder="Jaw tight, chest heavy, buzzing energy, shallow breath…"
                  />
                  <div className="small">Tip: location + temperature + pressure + movement is plenty.</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="label">Emotions (quick picks)</div>
                  <div className="pillRow">
                    {cfg.quickEmotions.map((p) => {
                      const active = entry.emotionsSelected.includes(p);
                      return (
                        <div
                          key={p}
                          className={`pill ${active ? 'pillEmotionActive' : ''}`}
                          onClick={() => setEntry((x) => ({ ...x, emotionsSelected: toggle(x.emotionsSelected, p) }))}
                        >
                          {p}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div className="label">Other emotions</div>
                    <input
                      className="input"
                      value={entry.emotionsOther}
                      onChange={(e) => setEntry((x) => ({ ...x, emotionsOther: e.target.value }))}
                      placeholder="Add your own words…"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="card2 stepCard">
                <div className="stepHeader">
                  <div className="stepNum">3</div>
                  <div>
                    <div className="stepTitle">Meaning → Next step</div>
                    <div className="sub">Need, facts, meaning, action. Keep it clean.</div>
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div className="label">Needs (quick picks)</div>
                  <div className="pillRow">
                    {cfg.quickNeeds.map((p) => {
                      const active = entry.needsSelected.includes(p);
                      return (
                        <div
                          key={p}
                          className={`pill ${active ? 'pillNeedActive' : ''}`}
                          onClick={() => setEntry((x) => ({ ...x, needsSelected: toggle(x.needsSelected, p) }))}
                        >
                          {p}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div className="label">Other needs</div>
                    <input
                      className="input"
                      value={entry.needsOther}
                      onChange={(e) => setEntry((x) => ({ ...x, needsOther: e.target.value }))}
                      placeholder="Add your own needs…"
                    />
                  </div>
                </div>

                <div>
                  <div className="label">Facts (what happened)</div>
                  <textarea
                    className="textarea"
                    value={entry.facts}
                    onChange={(e) => setEntry((x) => ({ ...x, facts: e.target.value }))}
                    placeholder={cfg.factsPrompt}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="label">Meaning</div>
                  <textarea
                    className="textarea"
                    value={entry.meaning}
                    onChange={(e) => setEntry((x) => ({ ...x, meaning: e.target.value }))}
                    placeholder={cfg.meaningPrompt}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="label">Next right step</div>
                  <textarea
                    className="textarea"
                    value={entry.nextRightStep}
                    onChange={(e) => setEntry((x) => ({ ...x, nextRightStep: e.target.value }))}
                    placeholder={cfg.stepPrompt}
                  />
                  <div className="small">Aim for one small next step — 2 minutes counts.</div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="label">Lock it in</div>
                  <textarea
                    className="textarea"
                    value={entry.lockItIn}
                    onChange={(e) => setEntry((x) => ({ ...x, lockItIn: e.target.value }))}
                    placeholder={cfg.lockPrompt}
                  />
                </div>

                <div className="btnRow" style={{ marginTop: 10 }}>
                  <button className="btn" onClick={resetEntry}>New Entry</button>
                  <button className="btn btnPrimary" onClick={handleExportPdf}>Export PDF</button>
                </div>

                <div className="hr" />

                <div className="label">Selected snapshot</div>
                <div className="small accentStripe" style={{ borderLeftColor: accent }}>
                  <strong>Topic:</strong> {cfg.label}<br />
                  {selectedTab === 'record_win' && (
                    <>
                      <strong>Win type:</strong> {entry.experienceType || '—'}
                      {entry.experienceType === 'Other experience' && entry.experienceOther ? ` (${entry.experienceOther})` : ''}
                      <br />
                    </>
                  )}
                  <strong>NS State:</strong> {entry.nsStateLabel || '—'}<br />
                  <strong>Emotions:</strong> {entry.emotionsSelected.join(', ') || '—'}{entry.emotionsOther ? ` + ${entry.emotionsOther}` : ''}<br />
                  <strong>Needs:</strong> {entry.needsSelected.join(', ') || '—'}{entry.needsOther ? ` + ${entry.needsOther}` : ''}
                </div>
              </div>
            </div>

            {/* Right toolbelt */}
            <div className="stickyRail">
              <div className="card railCard">
                <div className="label">More emotions (checkboxes)</div>
                <button className="drawerBtn" onClick={() => setShowMoreEmotions((s) => !s)}>
                  {showMoreEmotions ? 'Hide emotions list ▲' : 'Show emotions list ▼'}
                </button>
                {showMoreEmotions && (
                  <div className="drawerPanel">
                    <div className="checkboxGrid">
                      {EMOTIONS.map((emo) => (
                        <label key={emo} className="checkItem">
                          <input
                            type="checkbox"
                            checked={entry.emotionsSelected.includes(emo)}
                            onChange={() => setEntry((x) => ({ ...x, emotionsSelected: toggle(x.emotionsSelected, emo) }))}
                          />
                          <div className="checkText">{emo}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="card railCard">
                <div className="label">More needs (checkboxes)</div>
                <button className="drawerBtn" onClick={() => setShowMoreNeeds((s) => !s)}>
                  {showMoreNeeds ? 'Hide needs list ▲' : 'Show needs list ▼'}
                </button>
                {showMoreNeeds && (
                  <div className="drawerPanel">
                    <div className="checkboxGrid">
                      {NEEDS.map((need) => (
                        <label key={need} className="checkItem">
                          <input
                            type="checkbox"
                            checked={entry.needsSelected.includes(need)}
                            onChange={() => setEntry((x) => ({ ...x, needsSelected: toggle(x.needsSelected, need) }))}
                          />
                          <div className="checkText">{need}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="card railCard">
                <div className="label">How to use</div>
                <div className="small">
                  Pick a topic → do one pass → export the PDF.<br />
                  Quick picks are for speed. Use drawers if you need more words.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="small footerNote" style={{ marginTop: 12 }}>
          v9: polished landing + subtle icons + calmer spacing + print-first PDF.
        </div>
      </div>
    </>
  );
}
