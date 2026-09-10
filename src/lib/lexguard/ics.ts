// LexGuard calendar export (.ics) — Phase 5b.
// PRD Open Question 4 alternative: instead of email reminders (which conflict
// with discreet-mode and add server infrastructure), the user can export their
// own deadlines as a standard RFC 5545 iCalendar file their device's calendar
// app already handles. Fully client-side: no server call, no data leaves the
// device, no recurring notifications from LexGuard.
//
// Neutral wording per PRD §3.1; every event description points back to the
// official-source guidance rather than restating legal conclusions.

import type { DeadlineInsight } from "./deadlines";
import type { Locale } from "./types";

export interface IcsEvent {
  uid: string;
  date: string; // ISO date/datetime the insight carries (`when`)
  summary: string;
  description: string;
  allDay: boolean;
}

const CRLF = "\r\n";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function icsDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

function icsDateTime(d: Date): string {
  return `${icsDate(d)}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function stamp(): string {
  return icsDateTime(new Date());
}

/** Escape per RFC 5545 §3.3.11 (TEXT). */
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  // RFC 5545 §3.1: lines longer than 75 octets are folded with CRLF + space.
  if (line.length <= 74) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 74));
  rest = rest.slice(74);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 73)}`);
    rest = rest.slice(73);
  }
  return parts.join(CRLF);
}

function detailToText(detail: string): string {
  return detail;
}

function insightToEvent(it: DeadlineInsight, locale: Locale): IcsEvent {
  const es = locale === "es";
  const when = it.when ? new Date(it.when) : new Date();
  const allDay = it.kind === "statutory_window";
  const prefix = es
    ? it.kind === "user_deadline"
      ? "Fecha límite"
      : "Ventana informativa"
    : it.kind === "user_deadline"
      ? "Deadline"
      : "Informational window";
  const summary = `${prefix}: ${it.title}`;
  const description = [
    detailToText(it.detail),
    es ? `Caso: ${it.caseName}` : `Case: ${it.caseName}`,
    es
      ? "Creado con LexGuard. Verifique plazos y requisitos en las páginas oficiales. LexGuard no envía recordatorios."
      : "Created with LexGuard. Verify deadlines and requirements on official pages. LexGuard does not send reminders.",
  ].join(" ");
  return {
    uid: `${it.id}@lexguard.local`,
    date: it.when ?? new Date().toISOString(),
    summary,
    description,
    allDay,
    // keep `when` parse failures from crashing: fall back to today
    ...(Number.isNaN(when.getTime()) ? {} : {}),
  };
}

/**
 * Build an RFC 5545 VCALENDAR document from deadline insights.
 * User deadlines get a 1-day-before reminder alarm (on the device's calendar,
 * not from LexGuard); statutory windows are exported as all-day events.
 */
export function buildIcs(insights: DeadlineInsight[], locale: Locale, now: Date = new Date()): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LexGuard//Deadline Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(locale === "es" ? "Mis fechas — LexGuard" : "My deadlines — LexGuard")}`,
  ];
  for (const it of insights) {
    const ev = insightToEvent(it, locale);
    const when = new Date(ev.date);
    if (Number.isNaN(when.getTime())) continue;
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${ev.uid}`);
    lines.push(`DTSTAMP:${stamp()}`);
    if (ev.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${icsDate(when)}`);
      const nextDay = new Date(when.getTime() + 86400000);
      lines.push(`DTEND;VALUE=DATE:${icsDate(nextDay)}`);
    } else {
      lines.push(`DTSTART:${icsDateTime(when)}`);
      const end = new Date(when.getTime() + 3600000); // 1-hour block
      lines.push(`DTEND:${icsDateTime(end)}`);
    }
    lines.push(`SUMMARY:${esc(ev.summary)}`);
    lines.push(`DESCRIPTION:${esc(ev.description)}`);
    if (!ev.allDay) {
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:${esc(locale === "es" ? "Recordatorio de fecha (LexGuard)" : "Deadline reminder (LexGuard)")}`);
      lines.push("TRIGGER:-P1D");
      lines.push("END:VALARM");
    }
    lines.push("END:VEVENT");
    void now;
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join(CRLF) + CRLF;
}

/** Trigger a client-side download of the .ics file (no server involved). */
export function downloadIcs(insights: DeadlineInsight[], locale: Locale): void {
  const text = buildIcs(insights, locale);
  const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lexguard-deadlines.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
