// LexGuard knowledge-lift quiz (PRD §14 "Knowledge lift: pre/post 5-question
// quiz on rights (anonymous, aggregate)"). Neutral, educational — questions test
// the same rights covered by the guides (file ownership, trust accounts, TX
// privilege waiver, outcome guarantees, settlement authority). Answers stay on
// the user's device; account mode additionally submits the anonymous score
// (0–5, no identifier) so the team can only ever see aggregate averages.

import type { Locale } from "./types";

export type QuizPhase = "pre" | "post";

export interface QuizOption {
  text: Record<Locale, string>;
}

export interface QuizQuestion {
  id: string;
  prompt: Record<Locale, string>;
  options: QuizOption[];
  correct: number; // index into options
  explanation: Record<Locale, string>;
  citation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "file-ownership",
    prompt: {
      en: "When a lawyer-client relationship ends, who owns the client case file?",
      es: "Cuando termina la relación abogado-cliente, ¿de quién es el expediente del caso?",
    },
    options: [
      { text: { en: "The client — you are entitled to your file", es: "El cliente — usted tiene derecho a su expediente" } },
      { text: { en: "The lawyer keeps it until all fees are paid", es: "El abogado lo conserva hasta pagar todos los honorarios" } },
      { text: { en: "The court keeps it", es: "El tribunal lo conserva" } },
      { text: { en: "The state bar keeps it", es: "El colegio de abogados lo conserva" } },
    ],
    correct: 0,
    explanation: {
      en: "In both Texas and California the client owns the file at termination (state equivalents of ABA Model Rule 1.16(d)). A lawyer may not hold the file hostage over a fee dispute.",
      es: "En Texas y California, el cliente es dueño del expediente al terminar la relación (equivalente estatal de la Regla Modelo 1.16(d) de la ABA). El abogado no puede retenerlo por una disputa de honorarios.",
    },
    citation: "TX Rule 1.16(d) / CA Rule 1.16(d)",
  },
  {
    id: "trust-account",
    prompt: {
      en: "You pay a retainer or receive settlement funds. Where must a lawyer keep that money?",
      es: "Usted paga un anticipo o recibe fondos de un acuerdo. ¿Dónde debe guardarlos el abogado?",
    },
    options: [
      { text: { en: "In the lawyer's personal account until the case ends", es: "En la cuenta personal del abogado hasta que termine el caso" } },
      { text: { en: "In a separate client trust account, separate from the lawyer's own money", es: "En una cuenta de depósito en garantía separada del dinero propio del abogado" } },
      { text: { en: "In cash at the office", es: "En efectivo en la oficina" } },
      { text: { en: "Wherever is convenient for the firm", es: "Donde sea conveniente para la firma" } },
    ],
    correct: 1,
    explanation: {
      en: "Client funds must be kept in a trust account separate from the lawyer's own money (TX Rule 1.14; CA Rule 4-100). Mixing client and personal funds is a serious discipline issue.",
      es: "Los fondos del cliente deben estar en una cuenta separada del dinero propio del abogado (Regla 1.14 de TX; Regla 4-100 de CA). Mezclar fondos es un problema grave de disciplina.",
    },
    citation: "TX Rule 1.14 / CA Rule 4-100",
  },
  {
    id: "privilege-waiver",
    prompt: {
      en: "In Texas, what happens to attorney-client privilege for a subject when you sign a grievance against your lawyer?",
      es: "En Texas, ¿qué pasa con la confidencialidad abogado-cliente sobre un tema cuando firma una queja contra su abogado?",
    },
    options: [
      { text: { en: "Privilege stays fully protected", es: "La confidencialidad sigue totalmente protegida" } },
      { text: { en: "Privilege transfers to the state bar", es: "La confidencialidad pasa al colegio de abogados" } },
      { text: { en: "Signing the grievance waives privilege for that subject matter", es: "Firmar la queja renuncia a la confidencialidad sobre ese tema" } },
      { text: { en: "Only the lawyer can waive privilege", es: "Solo el abogado puede renunciar a la confidencialidad" } },
    ],
    correct: 2,
    explanation: {
      en: "Signing the Texas grievance form waives attorney-client privilege for the subject matter of the complaint. LexGuard shows this warning at the decision point so you can decide informed.",
      es: "Firmar el formulario de queja de Texas renuncia a la confidencialidad sobre el tema de la queja. LexGuard muestra esta advertencia en el punto de decisión para que decida informado.",
    },
    citation: "State Bar of Texas grievance process",
  },
  {
    id: "outcome-guarantee",
    prompt: {
      en: "A lawyer tells you: \"I guarantee you will win.\" Is that allowed?",
      es: "Un abogado le dice: «Le garantizo que va a ganar». ¿Está permitido?",
    },
    options: [
      { text: { en: "Yes, if the lawyer is experienced", es: "Sí, si el abogado tiene experiencia" } },
      { text: { en: "Yes, if it is put in writing", es: "Sí, si lo pone por escrito" } },
      { text: { en: "Only for flat-fee cases", es: "Solo en casos de tarifa fija" } },
      { text: { en: "No — guaranteeing outcomes is prohibited", es: "No — garantizar resultados está prohibido" } },
    ],
    correct: 3,
    explanation: {
      en: "Guarantees or promises about outcomes are prohibited lawyer-communication issues (TX Rule 7.02 / CA Rule 7.1 territory). A lawyer can explain strengths; no one can promise a result.",
      es: "Garantizar o prometer resultados está prohibido (territorio de la Regla 7.02 de TX / Regla 7.1 de CA). Un abogado puede explicar fortalezas; nadie puede prometer un resultado.",
    },
    citation: "TX Rule 7.02 / CA Rule 7.1",
  },
  {
    id: "settlement-authority",
    prompt: {
      en: "Can a lawyer accept a settlement of your case without your approval?",
      es: "¿Puede un abogado aceptar un acuerdo de su caso sin su aprobación?",
    },
    options: [
      { text: { en: "Yes — settlement strategy is the lawyer's decision", es: "Sí — la estrategia del acuerdo es decisión del abogado" } },
      { text: { en: "Yes, if the amount is small", es: "Sí, si el monto es pequeño" } },
      { text: { en: "No — settlement decisions require the client's authorization", es: "No — las decisiones del acuerdo requieren la autorización del cliente" } },
      { text: { en: "Only if the court approves it", es: "Solo si el tribunal lo aprueba" } },
    ],
    correct: 2,
    explanation: {
      en: "Settlement is the client's decision — the lawyer must obtain your authorization (TX Rule 1.02 / CA Rule 1.2). A lawyer who settles without consent raises a serious professional-conduct concern.",
      es: "El acuerdo es decisión del cliente — el abogado debe obtener su autorización (Regla 1.02 de TX / Regla 1.2 de CA). Un abogado que acuerda sin consentimiento plantea una preocupación grave de conducta profesional.",
    },
    citation: "TX Rule 1.02 / CA Rule 1.2",
  },
];

export const QUIZ_MAX_SCORE = QUIZ_QUESTIONS.length;
export const QUIZ_POST_DELAY_DAYS = 7;

// ---- local (per-device) quiz state — anonymous, stays in this browser ----

export interface QuizRecord {
  phase: QuizPhase;
  score: number; // 0..5
  answers: number[]; // index chosen per question
  at: string; // ISO
}

interface QuizStore {
  pre?: QuizRecord;
  post?: QuizRecord;
}

const KEY = "lexguard.quiz.v1";

function emptyStore(): QuizStore {
  return {};
}

function loadStore(): QuizStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...emptyStore(), ...(JSON.parse(raw) as QuizStore) } : emptyStore();
  } catch {
    return emptyStore();
  }
}

function saveStore(s: QuizStore): void {
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function scoreQuiz(answers: number[]): number {
  return QUIZ_QUESTIONS.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
}

export function getQuizRecord(phase: QuizPhase): QuizRecord | null {
  return loadStore()[phase] ?? null;
}

export function saveQuizResult(phase: QuizPhase, answers: number[]): QuizRecord {
  const rec: QuizRecord = { phase, score: scoreQuiz(answers), answers, at: new Date().toISOString() };
  const s = loadStore();
  s[phase] = rec;
  saveStore(s);
  return rec;
}

export function quizLift(): number | null {
  const s = loadStore();
  if (!s.pre || !s.post) return null;
  return s.post.score - s.pre.score;
}

// Post-quiz becomes available QUIZ_POST_DELAY_DAYS after the pre-quiz so we can
// measure whether using the tool improved rights knowledge (PRD §14).
export function postQuizDue(now: Date = new Date()): boolean {
  const s = loadStore();
  if (!s.pre) return false;
  if (s.post) return false;
  const due = new Date(s.pre.at).getTime() + QUIZ_POST_DELAY_DAYS * 24 * 60 * 60 * 1000;
  return now.getTime() >= due;
}

export function clearQuiz(): void {
  saveStore(emptyStore());
}
