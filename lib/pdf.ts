import jsPDF from "jspdf";

type NorthStarPoint = { label: string; text: string };

export type PdfTabConfig = {
  label: string;
  northStar: { blurb: string; points: NorthStarPoint[] };
};

export type PdfEntry = {
  createdAt: string;
  tab: string;

  context: string;
  bodySignals: string;
  nsState: string;

  emotionsSelected: string[];
  emotionsOther: string;

  needsSelected: string[];
  snapshotTopic: string;
  snapshotSymbols: string;
  snapshotBodySignals: string[];
  snapshotEmotions: string[];
  tryOneSuggestions: string[];
  nextMoveText: string;
  winOrReframe: string;

  experienceType?: string;
  experienceOther?: string;
};

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export async function exportEntryToPdf(entry: PdfEntry, cfg: PdfTabConfig) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const margin = 14;
  const maxW = pageW - margin * 2;

  let y = margin;

  const addPageIfNeeded = (extra = 0) => {
    if (y + extra > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const setH = (size: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(30, 30, 30);
  };

  const setBody = (size: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(40, 40, 40);
  };

  const writeParagraph = (text: string, size = 11, lineH = 5.2) => {
    setBody(size);
    const lines = doc.splitTextToSize((text && text.trim()) ? text : "—", maxW);
    for (const ln of lines) {
      addPageIfNeeded(lineH);
      doc.text(ln, margin, y);
      y += lineH;
    }
  };

  const writeHeader = (text: string) => {
    addPageIfNeeded(10);
    setH(13);
    doc.text(text, margin, y);
    y += 7;
    doc.setDrawColor(120);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
  };

  const writeSection = (title: string, body: string) => {
    writeHeader(title);
    writeParagraph(body, 11);
    y += 3;
  };

  // Title block
  setH(16);
  doc.text(`IRCP — ${cfg.label}`, margin, y);
  y += 8;

  setBody(11);
  doc.text(`Date: ${fmtDate(entry.createdAt)}`, margin, y);
  y += 6;

  doc.text(`Nervous System State: ${entry.nsState || "—"}`, margin, y);
  y += 8;

  // Record-a-win experience type (optional)
  const expType = (entry.experienceType || "").trim();
  const expOther = (entry.experienceOther || "").trim();
  if (expType || expOther) {
    const exp =
      expType === "Other experience" && expOther ? `${expType} — ${expOther}` :
      expType || expOther || "—";
    writeSection("Experience Type", exp);
  }

  writeSection("Context", entry.context);
  writeSection("Body Signals", entry.bodySignals);

  // Emotions / needs as clean bullets
  const emoList = [...(entry.emotionsSelected || [])];
  const needList = [...(entry.needsSelected || [])];

  const emoText = [
    emoList.length ? `• ${emoList.join("\n• ")}` : "—",
    (entry.emotionsOther || "").trim() ? `\nOther: ${(entry.emotionsOther || "").trim()}` : ""
  ].join("");

  const needText = [
    needList.length ? `• ${needList.join("\n• ")}` : "—"
  ].join("");

  writeHeader("Emotions Identified");
  writeParagraph(emoText, 11);
  y += 3;

  writeHeader("Needs Identified");
  writeParagraph(needText, 11);
  y += 3;

  writeHeader("Meaning → Next Move");

  const snapshotRows = [
    entry.snapshotTopic ? `Topic: ${entry.snapshotTopic}` : '',
    entry.snapshotSymbols ? `Symbols: ${entry.snapshotSymbols}` : '',
    entry.snapshotBodySignals.length ? `Body signals: ${entry.snapshotBodySignals.join(', ')}` : '',
    entry.snapshotEmotions.length ? `Emotions: ${entry.snapshotEmotions.join(', ')}` : ''
  ].filter(Boolean);

  writeParagraph(snapshotRows.length ? snapshotRows.map((row) => `• ${row}`).join('\n') : '—', 11);
  y += 3;

  writeHeader("Try One");
  writeParagraph(entry.tryOneSuggestions.length ? `• ${entry.tryOneSuggestions.join('\n• ')}` : '—', 11);
  y += 3;

  writeSection("One Next Move", entry.nextMoveText);
  writeSection("Lock It In", entry.winOrReframe);

  // North Star
  writeHeader("North Star");
  writeParagraph(cfg.northStar.blurb || "—", 11);
  y += 2;

  for (const p of cfg.northStar.points || []) {
    addPageIfNeeded(6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(`${p.label}:`, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);

    const labelW = doc.getTextWidth(`${p.label}:`) + 2;
    const lines = doc.splitTextToSize(p.text || "—", maxW - labelW);
    if (lines.length) {
      doc.text(lines[0], margin + labelW, y);
      y += 5.5;
      for (let i = 1; i < lines.length; i++) {
        addPageIfNeeded(5.5);
        doc.text(lines[i], margin, y);
        y += 5.5;
      }
    } else {
      y += 5.5;
    }
  }

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text("Generated by IRCP (Print-First)", margin, pageH - margin);

  const safeLabel = cfg.label.replace(/[^a-z0-9]+/gi, "_");
  doc.save(`IRCP_${safeLabel}_${new Date().toISOString().slice(0,10)}.pdf`);
}
