'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import UserCompass from '../components/UserCompass';
import { exportEntryToPdf, PdfEntry } from '../lib/pdf';
import { TAB_CONFIGS, TabConfig, TabKey } from '../lib/tabs';
import { EMOTIONS, NEEDS } from '../lib/vocab';
import { ANCHOR_PILLS, ANCHOR_PILLS_BY_ID } from '../lib/anchorPills';
import { ALL_CATEGORY_EMOTIONS, CATEGORY_EMOTION_PULLS } from '../lib/categoryPills';
import { getPrimarySymbol, getTryOneSuggestions } from '../lib/suggestions';

type Entry = {
  id: string;
  createdAt: string;
  tab: TabKey;

  situation: string;
  anchorStateIds: string[];

  bodySignals: string;
  bodySignalsSelected: string[];
  bodySignalsCustom: string;
  emotionsSelected: string[];
  emotionsCustom: string;
  emotionsOther: string;

  needsSelected: string[];
  tryOneSuggestions: string[];
  lastSuggestionsHash: string;
  nextMoveText: string;

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

function toCommaSeparatedList(items: string[]) {
  return items.join(', ');
}

const BODY_SIGNAL_PILLS = [
  'Jaw tight',
  'Chest heavy',
  'Shallow breath',
  'Lump in throat',
  'Stomach tight',
  'Heart racing',
  'Shoulders up',
  'Buzzing energy',
  'Shaky',
  'Restless legs',
  'Head pressure',
  'Numb/floaty',
  'Warm face',
  'Cold hands'
];

const BODY_SIGNAL_SET = new Set(BODY_SIGNAL_PILLS.map((item) => item.toLowerCase()));
const EMOTION_SET = new Set(ALL_CATEGORY_EMOTIONS.map((item) => item.toLowerCase()));

function makeEmptyEntry(tab: TabKey): Entry {
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    tab,
    situation: '',
    anchorStateIds: [],
    bodySignals: '',
    bodySignalsSelected: [],
    bodySignalsCustom: '',
    emotionsSelected: [],
    emotionsCustom: '',
    emotionsOther: '',
    needsSelected: [],
    tryOneSuggestions: [],
    lastSuggestionsHash: '',
    nextMoveText: '',
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

  const [showStep2MoreEmotions, setShowStep2MoreEmotions] = useState(false);
  const [showMoreEmotions, setShowMoreEmotions] = useState(false);
  const [showMoreNeeds, setShowMoreNeeds] = useState(false);
  const [showBodySignalAdd, setShowBodySignalAdd] = useState(false);
  const [showEmotionAdd, setShowEmotionAdd] = useState(false);
  const [bodySignalDraft, setBodySignalDraft] = useState('');
  const [emotionDraft, setEmotionDraft] = useState('');
  const [anchorSelectionMessage, setAnchorSelectionMessage] = useState('');
  const [needsSelectionMessage, setNeedsSelectionMessage] = useState('');
  const anchorSelectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const needsSelectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMemo(() => {
    if (selectedTab) setEntry((e) => ({ ...e, tab: selectedTab }));
  }, [selectedTab]);

  const firstSelectedAnchor = entry.anchorStateIds[0] ? ANCHOR_PILLS_BY_ID[entry.anchorStateIds[0]] : null;
  const accent = firstSelectedAnchor?.toneColor ?? '#cdbfae';
  const emotionPulls = CATEGORY_EMOTION_PULLS[entry.tab];

  function startTopic(t: TabKey) {
    setSelectedTab(t);
    setEntry(makeEmptyEntry(t));
    setShowStep2MoreEmotions(false);
    setShowMoreEmotions(false);
    setShowMoreNeeds(false);
    setShowBodySignalAdd(false);
    setShowEmotionAdd(false);
    setBodySignalDraft('');
    setEmotionDraft('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToLanding() {
    setSelectedTab(null);
    setShowStep2MoreEmotions(false);
    setShowMoreEmotions(false);
    setShowMoreNeeds(false);
    setShowBodySignalAdd(false);
    setShowEmotionAdd(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetEntry() {
    if (!selectedTab) return;
    setEntry(makeEmptyEntry(selectedTab));
    setShowStep2MoreEmotions(false);
    setShowBodySignalAdd(false);
    setShowEmotionAdd(false);
    setBodySignalDraft('');
    setEmotionDraft('');
  }

  function formatHistoryDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const selectedAnchorItems = entry.anchorStateIds
    .map((id) => ANCHOR_PILLS_BY_ID[id])
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  useEffect(() => {
    return () => {
      if (anchorSelectionTimerRef.current) {
        clearTimeout(anchorSelectionTimerRef.current);
      }
      if (needsSelectionTimerRef.current) {
        clearTimeout(needsSelectionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const selectedSymbols = entry.anchorStateIds
      .map((id) => ANCHOR_PILLS_BY_ID[id]?.symbol)
      .filter((symbol): symbol is string => Boolean(symbol));

    const primarySymbol = getPrimarySymbol(selectedSymbols);
    const rotationSeed =
      Math.abs(
        Date.parse(entry.createdAt)
        + entry.emotionsSelected.length * 11
        + entry.bodySignalsSelected.length * 7
        + entry.anchorStateIds.length * 5
      );

    const previousHash = window.localStorage.getItem('ircp:last-try-one-hash') || '';

    const { suggestions, hash } = getTryOneSuggestions({
      category: entry.tab,
      primarySymbol,
      rotationSeed,
      previousHash
    });

    const suggestionText = suggestions.map((item) => item.text);
    if (entry.lastSuggestionsHash === hash) return;

    setEntry((x) => ({
      ...x,
      tryOneSuggestions: suggestionText,
      lastSuggestionsHash: hash
    }));

    window.localStorage.setItem('ircp:last-try-one-hash', hash);
  }, [entry.anchorStateIds, entry.bodySignalsSelected.length, entry.createdAt, entry.emotionsSelected.length, entry.tab]);

  function toggleAnchorSelection(id: string) {
    setEntry((x) => {
      const selected = x.anchorStateIds.includes(id);

      if (selected) {
        if (anchorSelectionTimerRef.current) {
          clearTimeout(anchorSelectionTimerRef.current);
        }
        setAnchorSelectionMessage('');
        return {
          ...x,
          anchorStateIds: x.anchorStateIds.filter((value) => value !== id)
        };
      }

      if (x.anchorStateIds.length >= 3) {
        setAnchorSelectionMessage('Max 3 selected.');
        if (anchorSelectionTimerRef.current) {
          clearTimeout(anchorSelectionTimerRef.current);
        }
        anchorSelectionTimerRef.current = setTimeout(() => setAnchorSelectionMessage(''), 2000);
        return x;
      }

      return {
        ...x,
        anchorStateIds: [...x.anchorStateIds, id]
      };
    });
  }

  function toggleNeedSelection(value: string) {
    setEntry((x) => {
      const selected = x.needsSelected.includes(value);
      if (selected) {
        if (needsSelectionTimerRef.current) {
          clearTimeout(needsSelectionTimerRef.current);
        }
        setNeedsSelectionMessage('');
        return {
          ...x,
          needsSelected: x.needsSelected.filter((item) => item !== value)
        };
      }

      if (x.needsSelected.length >= 3) {
        setNeedsSelectionMessage('Max 3 selected.');
        if (needsSelectionTimerRef.current) {
          clearTimeout(needsSelectionTimerRef.current);
        }
        needsSelectionTimerRef.current = setTimeout(() => setNeedsSelectionMessage(''), 2000);
        return x;
      }

      return {
        ...x,
        needsSelected: [...x.needsSelected, value]
      };
    });
  }

  function toggleBodySignalPill(value: string) {
    setEntry((x) => {
      const bodySignalsSelected = toggle(x.bodySignalsSelected, value);
      const bodySignalsCustom = toCommaSeparatedList(
        bodySignalsSelected.filter((item) => !BODY_SIGNAL_SET.has(item.toLowerCase()))
      );
      return {
        ...x,
        bodySignalsSelected,
        bodySignalsCustom,
        bodySignals: toCommaSeparatedList(bodySignalsSelected)
      };
    });
  }

  function addBodySignal() {
    const value = bodySignalDraft.trim();
    if (!value) return;
    setEntry((x) => {
      const alreadySelected = x.bodySignalsSelected.some((item) => item.toLowerCase() === value.toLowerCase());
      if (alreadySelected) return x;

      const bodySignalsSelected = [...x.bodySignalsSelected, value];
      const bodySignalsCustom = toCommaSeparatedList(
        bodySignalsSelected.filter((item) => !BODY_SIGNAL_SET.has(item.toLowerCase()))
      );

      return {
        ...x,
        bodySignalsSelected,
        bodySignalsCustom,
        bodySignals: toCommaSeparatedList(bodySignalsSelected)
      };
    });
    setBodySignalDraft('');
  }

  function toggleEmotion(value: string) {
    setEntry((x) => {
      const emotionsSelected = toggle(x.emotionsSelected, value);
      const emotionsCustom = toCommaSeparatedList(
        emotionsSelected.filter((item) => !EMOTION_SET.has(item.toLowerCase()))
      );
      return {
        ...x,
        emotionsSelected,
        emotionsCustom,
        emotionsOther: emotionsCustom
      };
    });
  }

  function addEmotion() {
    const value = emotionDraft.trim();
    if (!value) return;

    setEntry((x) => {
      const alreadySelected = x.emotionsSelected.some((item) => item.toLowerCase() === value.toLowerCase());
      const emotionsSelected = alreadySelected ? x.emotionsSelected : [...x.emotionsSelected, value];
      const emotionsCustom = toCommaSeparatedList(
        emotionsSelected.filter((item) => !EMOTION_SET.has(item.toLowerCase()))
      );

      return {
        ...x,
        emotionsSelected,
        emotionsCustom,
        emotionsOther: emotionsCustom
      };
    });
    setEmotionDraft('');
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
      snapshotTopic: cfg.label,
      snapshotSymbols: selectedAnchorItems.map((item) => item.symbol).join(' + '),
      snapshotBodySignals: entry.bodySignalsSelected,
      snapshotEmotions: entry.emotionsSelected,
      tryOneSuggestions: entry.tryOneSuggestions,
      nextMoveText: entry.nextMoveText,
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
              <div className="card2 stepCard accentStripe" style={{ borderLeftColor: accent }}>
                <div style={{ marginBottom: 12 }}>
                  <div className="stepTitle">{cfg.label}</div>
                  <div className="sub">{cfg.tagline}</div>
                </div>

                <div className="stepHeader anchorStepHeader">
                  <div className="stepNum">1</div>
                  <div className="anchorQuestionBlock">
                    <div className="anchorPrompt">Which of these feels accurate?</div>
                    <div className="anchorHint">Choose up to 3.</div>
                  </div>
                </div>
                {anchorSelectionMessage && <div className="anchorHelperMessage">{anchorSelectionMessage}</div>}

                <div className="grid2">
                  <div>
                    <div className="anchorStack" role="group" aria-label="Anchor check-in">
                      {ANCHOR_PILLS.map((pill) => {
                        const selected = entry.anchorStateIds.includes(pill.id);

                        return (
                          <div key={pill.id} className="anchorItem">
                            <button
                              type="button"
                              className={`anchorPill ${selected ? 'anchorPillSelected' : ''}`}
                              onClick={() => toggleAnchorSelection(pill.id)}
                            >
                              <span className="anchorLabelWrap">
                                <span className="anchorSymbol" style={{ color: pill.toneColor }} aria-hidden>{pill.symbol}</span>
                                <span>{pill.label}</span>
                              </span>
                              <span className={`anchorCheck ${selected ? 'anchorCheckVisible' : ''}`} aria-hidden>✓</span>
                            </button>

                            <div className="anchorMicroDescription">{pill.microDescription}</div>
                          </div>
                        );
                      })}
                    </div>

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
                    placeholder="Where/when did this happen? Keep it to 1–2 sentences."
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
                    <div className="small">Tap what fits. Add your own words if needed.</div>
                  </div>
                </div>

                <div>
                  <div className="label">Body signals (tap what’s true)</div>
                  <div className="pillRow" style={{ marginBottom: 8 }}>
                    {BODY_SIGNAL_PILLS.map((signal) => {
                      const active = entry.bodySignalsSelected.includes(signal);
                      return (
                        <button
                          key={signal}
                          type="button"
                          className={`pill ${active ? 'pillEmotionActive' : ''}`}
                          onClick={() => toggleBodySignalPill(signal)}
                        >
                          {signal}
                          <span className={`pillCheck ${active ? 'pillCheckVisible' : ''}`}>✓</span>
                        </button>
                      );
                    })}
                    {entry.bodySignalsSelected
                      .filter((signal) => !BODY_SIGNAL_SET.has(signal.toLowerCase()))
                      .map((signal) => (
                        <button
                          key={signal}
                          type="button"
                          className="pill pillEmotionActive"
                          onClick={() => toggleBodySignalPill(signal)}
                        >
                          {signal}
                          <span className="pillCheck pillCheckVisible">✓</span>
                        </button>
                      ))}
                  </div>
                  <button type="button" className="btnLink" onClick={() => setShowBodySignalAdd((s) => !s)}>+ Add one</button>
                  {showBodySignalAdd && (
                    <div style={{ marginTop: 8 }}>
                      <div className="label">Add a body signal (optional)</div>
                      <div className="inlineAddRow">
                        <input
                          className="input"
                          value={bodySignalDraft}
                          onChange={(e) => setBodySignalDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addBodySignal();
                            }
                          }}
                          placeholder="Type one…"
                        />
                        <button type="button" className="btn" onClick={addBodySignal}>Add</button>
                      </div>
                    </div>
                  )}
                  <textarea
                    className="textarea"
                    value={toCommaSeparatedList(entry.bodySignalsSelected)}
                    readOnly
                    placeholder="Jaw tight, chest heavy, buzzing energy…"
                  />
                  <div className="small">Auto-filled from your selections.</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="label">Emotions (tap what fits)</div>
                  <div className="pillRow">
                    {emotionPulls.suggested.map((p) => {
                      const active = entry.emotionsSelected.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          className={`pill ${active ? 'pillEmotionActive' : ''}`}
                          onClick={() => toggleEmotion(p)}
                        >
                          {p}
                          <span className={`pillCheck ${active ? 'pillCheckVisible' : ''}`}>✓</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="small" style={{ marginTop: 8 }}>Most people pick 3–5.</div>

                  <button type="button" className="drawerBtn" style={{ marginTop: 10 }} onClick={() => setShowStep2MoreEmotions((s) => !s)}>
                    {showStep2MoreEmotions ? 'Hide more emotions ▲' : 'More emotions ▼'}
                  </button>
                  {showStep2MoreEmotions && (
                    <div className="drawerPanel">
                      <div className="pillRow">
                        {emotionPulls.more.map((p) => {
                          const active = entry.emotionsSelected.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              className={`pill ${active ? 'pillEmotionActive' : ''}`}
                              onClick={() => toggleEmotion(p)}
                            >
                              {p}
                              <span className={`pillCheck ${active ? 'pillCheckVisible' : ''}`}>✓</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {entry.emotionsSelected.filter((emotion) => !emotionPulls.suggested.includes(emotion) && !emotionPulls.more.includes(emotion)).length > 0 && (
                    <div className="pillRow" style={{ marginTop: 10 }}>
                      {entry.emotionsSelected
                        .filter((emotion) => !emotionPulls.suggested.includes(emotion) && !emotionPulls.more.includes(emotion))
                        .map((emotion) => (
                          <button
                            key={emotion}
                            type="button"
                            className="pill pillEmotionActive"
                            onClick={() => toggleEmotion(emotion)}
                          >
                            {emotion}
                            <span className="pillCheck pillCheckVisible">✓</span>
                          </button>
                        ))}
                    </div>
                  )}

                  <div style={{ marginTop: 10 }}>
                    <button type="button" className="btnLink" onClick={() => setShowEmotionAdd((s) => !s)}>+ Add one</button>
                    {showEmotionAdd && (
                      <>
                        <div className="label">Add an emotion (optional)</div>
                        <div className="inlineAddRow">
                          <input
                            className="input"
                            value={emotionDraft}
                            onChange={(e) => setEmotionDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addEmotion();
                              }
                            }}
                            placeholder="Add your own word…"
                          />
                          <button type="button" className="btn" onClick={addEmotion}>Add</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="card2 stepCard">
                <div className="stepHeader">
                  <div className="stepNum">3</div>
                  <div>
                    <div className="stepTitle">Meaning → Next Move</div>
                    <div className="sub">Translate this moment into clarity and movement.</div>
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div className="label">Snapshot</div>
                  <div className="stepMiniCard">
                    <div className="snapshotRows">
                      {cfg?.label && (
                        <div className="snapshotRow">
                          <span className="snapshotLabel">Topic</span>
                          <span>{cfg.label}</span>
                        </div>
                      )}
                      {selectedAnchorItems.length > 0 && (
                        <div className="snapshotRow">
                          <span className="snapshotLabel">Symbols</span>
                          <span>{selectedAnchorItems.map((item) => item.symbol).join(' + ')}</span>
                        </div>
                      )}
                      {entry.bodySignalsSelected.length > 0 && (
                        <div className="snapshotRow">
                          <span className="snapshotLabel">Body signals</span>
                          <span>{entry.bodySignalsSelected.join(', ')}</span>
                        </div>
                      )}
                      {entry.emotionsSelected.length > 0 && (
                        <div className="snapshotRow">
                          <span className="snapshotLabel">Emotions</span>
                          <span>{entry.emotionsSelected.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div className="label">Need right now</div>
                  <div className="small">Choose up to 3.</div>
                  {needsSelectionMessage && <div className="anchorHelperMessage">{needsSelectionMessage}</div>}
                  <div className="pillRow">
                    {['Space', 'Clarity', 'Respect', 'Reassurance', 'Support', 'Safety', 'Rest', 'Connection', 'Autonomy', 'Boundaries', 'Simplicity', 'Time'].map((p) => {
                      const active = entry.needsSelected.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          className={`pill ${active ? 'pillNeedActive' : ''}`}
                          onClick={() => toggleNeedSelection(p)}
                        >
                          {p}
                          <span className={`pillCheck ${active ? 'pillCheckVisible' : ''}`}>✓</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div className="label">Try one</div>
                  <div className="small">No perfect choice. Pick one.</div>
                  <div className="stepMiniCard">
                    <ul className="tryOneList">
                      {entry.tryOneSuggestions.map((item) => (
                        <li key={item} className="tryOneItem">
                          <span aria-hidden className="tryOneMarker">◻</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="label">One next move (optional)</div>
                  <input
                    className="input"
                    value={entry.nextMoveText}
                    onChange={(e) => setEntry((x) => ({ ...x, nextMoveText: e.target.value }))}
                    placeholder="One sentence. What’s the smallest useful step?"
                  />
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
                            onChange={() => toggleEmotion(emo)}
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
                            onChange={() => toggleNeedSelection(need)}
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
