'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import UserCompass from '../components/UserCompass';
import { exportEntryToPdf, PdfEntry } from '../lib/pdf';
import { TAB_CONFIGS, TabConfig, TabKey } from '../lib/tabs';
import { EMOTIONS, NEEDS } from '../lib/vocab';
import { ANCHOR_PILLS, ANCHOR_PILLS_BY_ID } from '../lib/anchorPills';

type Entry = {
  id: string;
  createdAt: string;
  tab: TabKey;

  situation: string;
  anchorStateIds: string[];

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

type HistoryEntry = {
  id: string;
  createdAt: string;
  tab: TabKey;
  anchorStateIds: string[];
  situation: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
}

function toggle(arr: string[], v: string) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function makeEmptyEntry(tab: TabKey): Entry {
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    tab,
    situation: '',
    anchorStateIds: [],
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
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const cfg: TabConfig | null = selectedTab ? TAB_CONFIGS[selectedTab] : null;

  const [showMoreEmotions, setShowMoreEmotions] = useState(false);
  const [showMoreNeeds, setShowMoreNeeds] = useState(false);

  useMemo(() => {
    if (selectedTab) setEntry((e) => ({ ...e, tab: selectedTab }));
  }, [selectedTab]);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoverDescriptionId, setHoverDescriptionId] = useState<string | null>(null);
  const [expandedDescriptionIds, setExpandedDescriptionIds] = useState<string[]>([]);

  const firstSelectedAnchor = entry.anchorStateIds[0] ? ANCHOR_PILLS_BY_ID[entry.anchorStateIds[0]] : null;
  const accent = firstSelectedAnchor?.toneColor ?? '#cdbfae';

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

  function formatHistoryDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const selectedAnchorItems = entry.anchorStateIds
    .map((id) => ANCHOR_PILLS_BY_ID[id])
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const selectedAnchorSummary = selectedAnchorItems.length
    ? selectedAnchorItems.map((item) => `${item.symbol} ${item.label}`).join(' · ')
    : '—';

  function toggleAnchorSelection(id: string) {
    setEntry((x) => ({
      ...x,
      anchorStateIds: toggle(x.anchorStateIds, id)
    }));
  }

  function scheduleHoverDescription(id: string) {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    hoverTimerRef.current = setTimeout(() => {
      setHoverDescriptionId(id);
    }, 300);
  }

  function cancelHoverDescription() {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoverDescriptionId(null);
  }

  function toggleDescriptionReveal(id: string) {
    setExpandedDescriptionIds((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ));
  }

  async function handleExportPdf() {
    if (!cfg) return;

    const pdfEntry: PdfEntry = {
      createdAt: entry.createdAt,
      tab: entry.tab,
      context: entry.situation,
      bodySignals: entry.bodySignals,
      nsState: entry.anchorStateIds.map((id) => {
        const item = ANCHOR_PILLS_BY_ID[id];
        return item ? `${item.symbol} ${item.label}` : null;
      }).filter(Boolean).join(' · '),
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
    setHistory((prev) => [
      {
        id: uid(),
        createdAt: new Date().toISOString(),
        tab: entry.tab,
        anchorStateIds: entry.anchorStateIds,
        situation: entry.situation
      },
      ...prev
    ].slice(0, 8));
  }

  return (
    <>
      <div className="container">
        <div className="headerWrap surface">
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
          <Link href="/symbol-key" className="btnLink symbolKeyNav">Symbol Key</Link>
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
                    <div className="anchorPrompt">Which of these feels accurate?</div>
                    <div className="anchorHint">Choose up to 3.</div>

                    <div className="anchorStack" role="group" aria-label="Anchor check-in">
                      {ANCHOR_PILLS.map((pill) => {
                        const selected = entry.anchorStateIds.includes(pill.id);
                        const showDescription = hoverDescriptionId === pill.id || expandedDescriptionIds.includes(pill.id);

                        return (
                          <div key={pill.id} className={`anchorItem ${showDescription ? 'anchorItemExpanded' : ''}`}>
                            <button
                              type="button"
                              className={`anchorPill ${selected ? 'anchorPillSelected' : ''}`}
                              onClick={() => toggleAnchorSelection(pill.id)}
                              onMouseEnter={() => scheduleHoverDescription(pill.id)}
                              onMouseLeave={cancelHoverDescription}
                            >
                              <span className="anchorLabelWrap">
                                <span className="anchorSymbol" style={{ color: pill.toneColor }} aria-hidden>{pill.symbol}</span>
                                <span>{pill.label}</span>
                              </span>
                              <span className={`anchorCheck ${selected ? 'anchorCheckVisible' : ''}`} aria-hidden>✓</span>
                            </button>

                            <button
                              type="button"
                              className="anchorInfoToggle"
                              onClick={() => toggleDescriptionReveal(pill.id)}
                              aria-expanded={showDescription}
                            >
                              {showDescription ? 'Hide note' : 'Show note'}
                            </button>

                            {showDescription && (
                              <div className="anchorMicroDescription">{pill.microDescription}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {entry.anchorStateIds.length > 3 && (
                      <div className="anchorHelperMessage">
                        You’ve selected more than 3. That’s okay. If it helps, try narrowing to the strongest few.
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
                  <strong>Anchor check-in:</strong> {selectedAnchorSummary}<br />
                  <strong>Emotions:</strong> {entry.emotionsSelected.join(', ') || '—'}{entry.emotionsOther ? ` + ${entry.emotionsOther}` : ''}<br />
                  <strong>Needs:</strong> {entry.needsSelected.join(', ') || '—'}{entry.needsOther ? ` + ${entry.needsOther}` : ''}
                </div>
              </div>
            </div>

            {/* Right toolbelt */}
            <div className="stickyRail">
              <div className="card railCard compassCard">
                <UserCompass northStar={cfg.northStar} />
              </div>

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
                <div className="label">Entry history</div>
                {history.length === 0 ? (
                  <div className="small">No entries exported yet.</div>
                ) : (
                  <div className="col" style={{ gap: 6 }}>
                    {history.map((item) => {
                      const firstAnchor = item.anchorStateIds[0] ? ANCHOR_PILLS_BY_ID[item.anchorStateIds[0]] : null;
                      const preview = item.situation ? ` ${item.situation}` : '';
                      return (
                        <div key={item.id} className="small">
                          {firstAnchor?.symbol ? `${firstAnchor.symbol} ` : ''}{formatHistoryDate(item.createdAt)} {preview || '—'}
                        </div>
                      );
                    })}
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
