// LexGuard quick-log templates (Phase 3, PRD §13 "quick-log mobile").
// Pre-structured entry templates so a common event is ≤3 taps on a phone:
// template -> (one-line detail) -> save. Labels live in i18n (ql_* keys).
import type { CommunicationData, DeadlineData, EntryType, PaymentData } from "./types";

export interface QuickTemplate {
  id: string;
  icon: "call_in" | "call_out" | "email_out" | "email_in" | "money_out" | "money_in" | "deadline" | "note";
  entryType: EntryType;
  defaultTitleKey: string; // i18n key used when the user leaves the title blank
}

export const QUICK_TEMPLATES: QuickTemplate[] = [
  { id: "call_in", icon: "call_in", entryType: "communication", defaultTitleKey: "tpl_call_in" },
  { id: "call_out", icon: "call_out", entryType: "communication", defaultTitleKey: "tpl_call_out" },
  { id: "email_out", icon: "email_out", entryType: "communication", defaultTitleKey: "tpl_email_out" },
  { id: "email_in", icon: "email_in", entryType: "communication", defaultTitleKey: "tpl_email_in" },
  { id: "money_out", icon: "money_out", entryType: "payment", defaultTitleKey: "tpl_money_out" },
  { id: "money_in", icon: "money_in", entryType: "payment", defaultTitleKey: "tpl_money_in" },
  { id: "deadline", icon: "deadline", entryType: "deadline", defaultTitleKey: "tpl_deadline" },
  { id: "note", icon: "note", entryType: "note", defaultTitleKey: "tpl_note" },
];

export function templateById(id: string): QuickTemplate | undefined {
  return QUICK_TEMPLATES.find((t) => t.id === id);
}

// Build the structured payload for a quick-log submission.
export function buildQuickPayload(
  tpl: QuickTemplate,
  fields: {
    amount?: number;
    method?: PaymentData["method"];
    payee?: PaymentData["payee"];
    paymentKindOut?: "retainer" | "fee" | "expense";
    paymentKindIn?: "refund" | "disbursement" | "other";
    deadlineKind?: DeadlineData["kind"];
    deadlineStatus?: DeadlineData["status"];
  },
): CommunicationData | PaymentData | DeadlineData | Record<string, never> {
  switch (tpl.id) {
    case "call_in":
      return { channel: "call", direction: "from_attorney" } satisfies CommunicationData;
    case "call_out":
      return { channel: "call", direction: "to_attorney" } satisfies CommunicationData;
    case "email_out":
      return { channel: "email", direction: "to_attorney" } satisfies CommunicationData;
    case "email_in":
      return { channel: "email", direction: "from_attorney" } satisfies CommunicationData;
    case "money_out":
      return {
        kind: fields.paymentKindOut ?? "fee",
        amount: fields.amount ?? 0,
        method: fields.method ?? "card",
        payee: fields.payee ?? "firm_trust",
      } satisfies PaymentData;
    case "money_in":
      return {
        kind: fields.paymentKindIn ?? "refund",
        amount: fields.amount ?? 0,
        method: fields.method ?? "transfer",
        payee: "other",
      } satisfies PaymentData;
    case "deadline":
      return {
        kind: fields.deadlineKind ?? "follow_up",
        status: fields.deadlineStatus ?? "upcoming",
      } satisfies DeadlineData;
    default:
      return {};
  }
}

// datetime-local input value for "now" in the user's local time
export function nowLocalInput(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
