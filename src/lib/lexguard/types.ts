// LexGuard shared domain types (PRD §6, §7, §8, §10)

export type USState = "TX" | "CA";
export type Locale = "en" | "es";
export type StorageMode = "local" | "account";

export type CaseType =
  | "family"
  | "personal_injury"
  | "criminal"
  | "immigration"
  | "probate"
  | "business"
  | "other";

export type EntryType =
  | "communication"
  | "payment"
  | "document"
  | "promise"
  | "note"
  | "deadline";

export type Severity = "high" | "medium" | "standard";

export type ChannelKind = "discipline" | "csf" | "fee" | "malpractice";

export interface CaseData {
  id: string;
  attorneyName: string;
  firm?: string | null;
  caseType: CaseType;
  state: USState;
  engagementStart?: string | null; // ISO date
  engagementEnd?: string | null;
  status: "active" | "ended";
  feeType?: "hourly" | "flat" | "contingency" | "none" | null;
  agreedFeeAmount?: number | null;
  contingencyPercent?: number | null;
  createdAt?: string;
}

// ---- Structured payloads per entry type (stored as JSON in `data`) ----

export interface CommunicationData {
  channel: "call" | "email" | "text" | "letter" | "in_person" | "portal";
  direction: "to_attorney" | "from_attorney";
  responseReceived?: boolean;
  respondedBy?: "attorney" | "staff";
  responseDate?: string;
  requestedFileReturn?: boolean;
  fileReturnRefused?: boolean;
  settlementDiscussed?: boolean;
  settledWithoutAuthorization?: boolean;
  requestedDirectAttorneyContact?: boolean;
  askedToLie?: boolean;
  guaranteedOutcome?: boolean;
  conflictFlag?: boolean; // lawyer connected to opposing side
  unrelatedBillingFlag?: boolean; // invoice describes work never done / personal tasks
}

export interface PaymentData {
  kind:
    | "retainer"
    | "fee"
    | "expense"
    | "settlement_received" // settlement funds received by attorney
    | "disbursement" // funds paid out to client
    | "refund"
    | "administrative"
    | "contingency_payout"
    | "other";
  amount: number;
  method: "cash" | "check" | "card" | "transfer";
  payee: "firm_trust" | "attorney_personally" | "other";
  receipt?: boolean;
  notInAgreement?: boolean; // charge not in the fee agreement
  percentPaid?: number | null; // for contingency payouts
}

export interface DeadlineData {
  kind: "court" | "filing" | "follow_up" | "other";
  status: "upcoming" | "met" | "missed";
  missedAppearance?: boolean; // attorney failed to appear
  reminderDays?: number;
}

export interface PromiseData {
  promisedBy?: string;
  fulfilled?: boolean | null;
}

export type EntryPayload =
  | CommunicationData
  | PaymentData
  | DeadlineData
  | PromiseData
  | Record<string, never>;

export interface EntryData {
  id: string;
  caseId: string;
  type: EntryType;
  occurredAt: string; // ISO datetime — user-supplied event time
  createdAt: string; // immutable audit timestamp (FR-2.3)
  editedAt?: string | null;
  edited?: boolean;
  title: string;
  body?: string | null;
  data?: EntryPayload;
  documentId?: string | null;
}

export interface DocumentMeta {
  id: string;
  caseId: string;
  filename: string;
  mime: string;
  size: number;
  tags: string[];
  createdAt: string;
  entryId?: string | null;
  ocrText?: string | null; // extracted text (PDF layer or image OCR) — Phase 3 search
}

export interface Observation {
  ruleId: string;
  ruleVersion: string;
  title: string;
  text: string; // neutral, conditional observation (PRD FR-3 / Flow C)
  citations: string[];
  channels: ChannelKind[];
  severity: Severity;
  evidence: string[]; // what would strengthen a complaint
  generatedAt: string;
}

export interface CaseFacts {
  attemptCount: number; // outbound communication attempts
  firstAttemptAt?: string;
  lastResponseAt?: string; // last communication received from attorney/staff
  unansweredDays: number; // days since first unanswered attempt
  attemptsLast14d: number;
  attemptsSpanDays: number; // span of unanswered attempts
  staffOnlyResponses: number;
  requestedDirectContact: boolean;
  settlementReceivedAt?: string; // funds received by attorney
  settlementAmount?: number;
  disbursedAt?: string; // disbursed to client
  daysSinceSettlement: number;
  retainerPaid?: number;
  refundReceived?: number;
  totalPaid: number;
  caseEnded: boolean;
  endedAt?: string;
  cashWithoutReceipt: number;
  paidPersonally: number;
  chargesNotInAgreement: number;
  adminFeesNotInAgreement: number;
  contingencyOverage: boolean;
  lastContingencyPercent?: number | null;
  totalPaidExceedsAgreement: boolean;
  hasFeeAgreementDoc: boolean;
  missedDeadlines: number;
  missedPrepBeforeDeadline: boolean;
  missedAppearance: boolean;
  lastActivityAt?: string;
  dormantDays: number;
  fileReturnRequested: boolean;
  fileReturnRequestedAt?: string; // when the client first asked for the file back
  fileReturnDaysWaiting: number;
  fileReturnRefused: boolean;
  settledWithoutAuthorization: boolean;
  askedToLie: boolean;
  guaranteedOutcome: boolean;
  conflictFlag: boolean;
  unrelatedBilling: boolean;
  openPromisesPastDue: number;
}
