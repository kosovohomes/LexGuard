// LexGuard Guide Library — Phase-5 expansion state notes (FL / NY / AZ).
// PRD §13 Phase-4 deferred item ("additional states (FL/NY/AZ)").
//
// These notes merge into the guide library at guides.ts (merge-over-write: an
// empty entry simply means the guide has no state-specific note for that
// state). Facts verified from official public sources on 2026-09-10 — see
// docs/STATE_FACTS_PHASE5.md. Formal licensed-attorney review is pending for
// the expansion states; reading level ≤ grade 8, neutral tone per PRD §3.1.

import type { USState } from "./types";
import type { StateNote } from "./guides-a";

type ExpansionNotes = Partial<Record<USState, StateNote[]>>;

export const EXPANSION_STATE_NOTES: Record<string, ExpansionNotes> = {
  "your-rights": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "Florida rules require your lawyer to be competent and diligent (Rule 4-1.3), to keep you reasonably informed (Rule 4-1.4), and to charge reasonable fees (Rule 4-1.5).",
            es: "Las reglas de Florida exigen que su abogado sea competente y diligente (Regla 4-1.3), lo mantenga razonablemente informado (Regla 4-1.4) y cobre honorarios razonables (Regla 4-1.5).",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "New York rules require your lawyer to be competent and diligent (Rule 1.3), to keep you reasonably informed (Rule 1.4), and to charge reasonable fees (Rule 1.5).",
            es: "Las reglas de Nueva York exigen que su abogado sea competente y diligente (Regla 1.3), lo mantenga razonablemente informado (Regla 1.4) y cobre honorarios razonables (Regla 1.5).",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "Arizona's ethics rules (\"ERs\") require your lawyer to be competent and diligent (ER 1.3), to keep you reasonably informed (ER 1.4), and to charge reasonable fees (ER 1.5).",
            es: "Las reglas éticas de Arizona (\"ER\") exigen que su abogado sea competente y diligente (ER 1.3), lo mantenga razonablemente informado (ER 1.4) y cobre honorarios razonables (ER 1.5).",
          },
        ],
      },
    ],
  },
  "your-file": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "When a Florida lawyer ends or quits your matter, they must release your papers and property (Rule 4-1.16(d)) — you may ask in writing and keep a dated copy.",
            es: "Cuando un abogado de Florida termina o abandona su asunto, debe entregarle sus papeles y bienes (Regla 4-1.16(d)) — puede pedirlo por escrito y guardar copia fechada.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "When a New York lawyer ends or quits your matter, they must release your papers and property (Rule 1.16(d)) — you may ask in writing and keep a dated copy.",
            es: "Cuando un abogado de Nueva York termina o abandona su asunto, debe entregarle sus papeles y bienes (Regla 1.16(d)) — puede pedirlo por escrito y guardar copia fechada.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "When an Arizona lawyer ends or quits your matter, they must release your papers and property (ER 1.16(d)) — you may ask in writing and keep a dated copy.",
            es: "Cuando un abogado de Arizona termina o abandona su asunto, debe entregarle sus papeles y bienes (ER 1.16(d)) — puede pedirlo por escrito y guardar copia fechada.",
          },
        ],
      },
    ],
  },
  "trust-money": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "Florida lawyers must keep client funds in a separate trust account (Rule 4-1.15). If settlement funds are sitting with the lawyer with no payment to you, that can be worth documenting carefully.",
            es: "Los abogados de Florida deben mantener los fondos del cliente en una cuenta de depósito separada (Regla 4-1.15). Si los fondos del acuerdo están con el abogado sin pago a usted, vale la pena documentarlo con cuidado.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "New York lawyers must keep client funds in a separate trust account (Rule 1.15). If settlement funds are sitting with the lawyer with no payment to you, that can be worth documenting carefully.",
            es: "Los abogados de Nueva York deben mantener los fondos del cliente en una cuenta de depósito separada (Regla 1.15). Si los fondos del acuerdo están con el abogado sin pago a usted, vale la pena documentarlo con cuidado.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "Arizona lawyers must keep client funds in a separate trust account (ER 1.15). If settlement funds are sitting with the lawyer with no payment to you, that can be worth documenting carefully.",
            es: "Los abogados de Arizona deben mantener los fondos del cliente en una cuenta de depósito separada (ER 1.15). Si los fondos del acuerdo están con el abogado sin pago a usted, vale la pena documentarlo con cuidado.",
          },
        ],
      },
    ],
  },
  "fee-agreement": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "In Florida, contingency-fee agreements must generally be in writing and signed (Rule 4-1.5(c)), and fees must be reasonable.",
            es: "En Florida, los acuerdos de honorarios contingentes generalmente deben ser por escrito y firmados (Regla 4-1.5(c)), y los honorarios deben ser razonables.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "In New York, lawyers must generally give a written letter of engagement when fees are expected to exceed $3,000 (22 NYCRR Part 1215), and contingency fees must be in writing (Rule 1.5(c)).",
            es: "En Nueva York, los abogados generalmente deben dar una carta de compromiso por escrito cuando los honorarios se esperan mayores a $3,000 (22 NYCRR Parte 1215), y los honorarios contingentes deben ser por escrito (Regla 1.5(c)).",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "In Arizona, contingency-fee agreements must be in writing and signed (ER 1.5(c)), and fees must be reasonable.",
            es: "En Arizona, los acuerdos de honorarios contingentes deben ser por escrito y firmados (ER 1.5(c)), y los honorarios deben ser razonables.",
          },
        ],
      },
    ],
  },
  "fire-lawyer": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "You may fire your Florida lawyer at any time. Afterward they must return your file (Rule 4-1.16(d)) and may only keep fees the agreement allows.",
            es: "Puede despedir a su abogado de Florida en cualquier momento. Después debe devolverle su expediente (Regla 4-1.16(d)) y solo puede conservar los honorarios que permita el acuerdo.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "You may fire your New York lawyer at any time. Afterward they must return your file (Rule 1.16(d)) and may only keep fees the agreement allows.",
            es: "Puede despedir a su abogado de Nueva York en cualquier momento. Después debe devolverle su expediente (Regla 1.16(d)) y solo puede conservar los honorarios que permita el acuerdo.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "You may fire your Arizona lawyer at any time. Afterward they must return your file (ER 1.16(d)) and may only keep fees the agreement allows.",
            es: "Puede despedir a su abogado de Arizona en cualquier momento. Después debe devolverle su expediente (ER 1.16(d)) y solo puede conservar los honorarios que permita el acuerdo.",
          },
        ],
      },
    ],
  },
  "discipline-system": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "Florida complaints start at the Attorney Consumer Assistance Program (ACAP) — toll-free 1-866-352-0707 — which reviews every complaint before possible investigation by Disciplinary Counsel.",
            es: "Las quejas en Florida comienzan en el Programa de Asistencia al Consumidor (ACAP) — gratis al 1-866-352-0707 — que revisa toda queja antes de una posible investigación de los abogados disciplinarios.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "New York complaints go to the Attorney Grievance Committee for the Appellate Division department where the lawyer's office is located — committee addresses and forms are on nycourts.gov.",
            es: "Las quejas en Nueva York van al Comité de Agravios del departamento de la Appellate Division donde está la oficina del abogado — direcciones y formularios en nycourts.gov.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "In Arizona, call the Attorney/Consumer Assistance Program at 602-340-7280 first, then submit the online charge of misconduct. The Lawyer Regulation Office reviews every charge.",
            es: "En Arizona, llame primero al Programa de Asistencia al Consumidor al 602-340-7280, luego presente la carga de mala conducta en línea. La Oficina de Regulación revisa toda carga.",
          },
        ],
      },
    ],
  },
  "client-security-fund": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "Florida's Clients' Security Fund reimburses losses from a lawyer's misappropriation — up to $50,000 per claim. File within 2 years after you knew or should have known of the loss.",
            es: "El Fondo de Seguridad del Cliente de Florida reembolsa pérdidas por apropiación indebida del abogado — hasta $50,000 por reclamo. Presente dentro de los 2 años desde que supo o debió suponer de la pérdida.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "New York's Lawyers' Fund for Client Protection reimburses losses from a lawyer's dishonest conduct — up to $450,000 per client loss. Apply within 2 years after the loss or its discovery.",
            es: "El Fondo de Protección del Cliente de Nueva York reembolsa pérdidas por conducta deshonesta del abogado — hasta $450,000 por pérdida. Solicite dentro de los 2 años después de la pérdida o su descubrimiento.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "Arizona's Client Protection Fund reimburses losses from a lawyer's dishonest conduct — up to $100,000 per claimant. File within 5 years after you knew or should have known of the loss.",
            es: "El Fondo de Protección del Cliente de Arizona reembolsa pérdidas por conducta deshonesta del abogado — hasta $100,000 por reclamante. Presente dentro de los 5 años desde que supo o debió suponer de la pérdida.",
          },
        ],
      },
    ],
  },
  "fee-disputes": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "The Florida Bar's Legal Fee Arbitration Program is free and voluntary — either side can start it, and both must agree to arbitrate.",
            es: "El Programa de Arbitraje de Honorarios de The Florida Bar es gratuito y voluntario — cualquiera de las partes puede iniciarlo y ambas deben aceptar el arbitraje.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "New York's Part 137 program resolves fee disputes of $1,000–$50,000. When the client starts it, the lawyer must participate; amounts outside the range need both sides' consent.",
            es: "El programa de la Parte 137 de Nueva York resuelve disputas de honorarios de $1,000 a $50,000. Cuando el cliente lo inicia, el abogado debe participar; los montos fuera del rango requieren el consentimiento de ambos.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "The State Bar of Arizona's Fee Arbitration Program is free and voluntary, for fee disputes over $1,000 — including contingent fees.",
            es: "El Programa de Arbitraje de Honorarios del State Bar of Arizona es gratuito y voluntario, para disputas mayores a $1,000 — incluidos honorarios contingentes.",
          },
        ],
      },
    ],
  },
  malpractice: {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "Florida generally applies two years from discovery to malpractice claims, with a four-year outer limit. Exact deadlines depend on your facts — ask a licensed attorney.",
            es: "Florida generalmente aplica dos años desde el descubrimiento para reclamos de mala praxis, con un límite exterior de cuatro años. Los plazos exactos dependen de sus hechos — consulte a un abogado con licencia.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "New York generally applies three years to attorney-malpractice claims (CPLR 214). Exact deadlines depend on your facts — ask a licensed attorney.",
            es: "Nueva York generalmente aplica tres años a los reclamos de mala praxis de abogados (CPLR 214). Los plazos exactos dependen de sus hechos — consulte a un abogado con licencia.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "Arizona generally applies two years to attorney-malpractice claims (A.R.S. 12-542). Exact deadlines depend on your facts — ask a licensed attorney.",
            es: "Arizona generalmente aplica dos años a los reclamos de mala praxis de abogados (A.R.S. 12-542). Los plazos exactos dependen de sus hechos — consulte a un abogado con licencia.",
          },
        ],
      },
    ],
  },
  "warning-signs": {
    FL: [
      {
        h: { en: "Florida specifics", es: "Especificidades de Florida" },
        p: [
          {
            en: "Check any Florida lawyer's status in the public attorney search at floridabar.org before and during the representation — discipline history is public.",
            es: "Verifique el estado de cualquier abogado de Florida en el directorio público de floridabar.org antes y durante la representación — el historial disciplinario es público.",
          },
        ],
      },
    ],
    NY: [
      {
        h: { en: "New York specifics", es: "Especificidades de Nueva York" },
        p: [
          {
            en: "Check any New York attorney's registration in the unified court system's public attorney search before and during the representation.",
            es: "Verifique el registro de cualquier abogado de Nueva York en la búsqueda pública del sistema unificado de tribunales antes y durante la representación.",
          },
        ],
      },
    ],
    AZ: [
      {
        h: { en: "Arizona specifics", es: "Especificidades de Arizona" },
        p: [
          {
            en: "Check any Arizona lawyer's status in the public member search at azbar.org before and during the representation — discipline history is public.",
            es: "Verifique el estado de cualquier abogado de Arizona en la búsqueda pública de azbar.org antes y durante la representación — el historial disciplinario es público.",
          },
        ],
      },
    ],
  },
};
