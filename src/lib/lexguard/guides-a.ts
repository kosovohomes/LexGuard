// LexGuard Guide Library A (guides 1–5) — PRD FR-1.2, bilingual EN/ES,
// reading level ≤ grade 8, state-scoped notes per PRD FR-1.1.
// Reviewer status is shown honestly per FR-1.5 (pending attorney sign-off in MVP).

import type { USState } from "./types";

export interface BiText {
  en: string;
  es: string;
}
export interface GuideSection {
  h: BiText;
  p: BiText[]; // paragraphs
  list?: BiText[]; // optional bullet list
}
export interface StateNote {
  h: BiText;
  p: BiText[];
  list?: BiText[];
}
export interface Guide {
  slug: string;
  order: number;
  minutes: number;
  title: BiText;
  summary: BiText;
  lastReviewed: string;
  reviewer: BiText;
  sections: GuideSection[];
  stateNotes: Partial<Record<USState, StateNote[]>>;
}

export const GUIDES_A: Guide[] = [
  {
    slug: "your-rights",
    order: 1,
    minutes: 4,
    title: { en: "Your Rights as a Legal Client", es: "Sus derechos como cliente legal" },
    summary: {
      en: "You have rights from the day you hire a lawyer. This guide lists the big ones in plain words.",
      es: "Usted tiene derechos desde el día que contrata a un abogado. Esta guía los enumera en palabras simples.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "You own your file", es: "Usted es dueño de su expediente" },
        p: [
          {
            en: "When the lawyer finishes your case, you may ask for your file. The file belongs to you, not the lawyer. This includes court papers and papers you signed.",
            es: "Cuando el abogado termina su caso, puede pedir su expediente. El expediente es suyo, no del abogado. Incluye documentos del tribunal y papeles que usted firmó.",
          },
        ],
      },
      {
        h: { en: "You must be kept informed", es: "Deben mantenerlo informado" },
        p: [
          {
            en: "Your lawyer must tell you about important things in your case. If you ask a question, the lawyer should answer. If you cannot reach your lawyer for weeks, that is a warning sign — not something you must accept.",
            es: "Su abogado debe informarle sobre lo importante de su caso. Si pregunta, el abogado debe responder. Si no puede contactar a su abogado por semanas, eso es una señal de alerta, no algo que deba aceptar.",
          },
        ],
      },
      {
        h: { en: "You make the big decisions", es: "Usted toma las decisiones grandes" },
        p: [
          {
            en: "You decide whether to accept a settlement. You decide whether to testify. The lawyer decides small things, like how to file a paper. A settlement without your okay is a serious problem.",
            es: "Usted decide si acepta un acuerdo. Usted decide si declara. El abogado decide cosas pequeñas, como cómo presentar un documento. Un acuerdo sin su permiso es un problema grave.",
          },
        ],
      },
      {
        h: { en: "Your money must be kept safe", es: "Su dinero debe estar seguro" },
        p: [
          {
            en: "Money that belongs to you must go in a special trust account. It must not sit in the lawyer's own account. When you win or when work is done, the lawyer must pay you promptly.",
            es: "El dinero que le pertenece debe ir a una cuenta de depósito especial (trust account). No debe quedarse en la cuenta del abogado. Cuando gane o cuando se haga el trabajo, el abogado debe pagarle pronto.",
          },
        ],
      },
      {
        h: { en: "You can complain — and you can leave", es: "Puede quejarse — y puede irse" },
        p: [
          {
            en: "Every state has a system to discipline lawyers. Firing a lawyer is allowed at any time. Neither one cancels the other. You can leave a lawyer and also file a complaint.",
            es: "Cada estado tiene un sistema para sancionar abogados. Puede despedir a un abogado en cualquier momento. Una cosa no cancela la otra. Puede irse del abogado y también presentar una queja.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas specifics", es: "Especificidades de Texas" },
          p: [
            {
              en: "Texas rules require your lawyer to be competent, diligent, and to keep you reasonably informed (Rules 1.01 and 1.03). Fees must be reasonable (Rule 1.04).",
              es: "Las reglas de Texas exigen que su abogado sea competente, diligente y lo mantenga razonablemente informado (Reglas 1.01 y 1.03). Los honorarios deben ser razonables (Regla 1.04).",
            },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California specifics", es: "Especificidades de California" },
          p: [
            {
              en: "California rules require communication (Rule 1.4), competence (Rule 1.1), and diligence (Rule 1.3). Written fee agreements are generally required when fees will exceed $1,000.",
              es: "Las reglas de California exigen comunicación (Regla 1.4), competencia (Regla 1.1) y diligencia (Regla 1.3). Los acuerdos de honorarios por escrito generalmente se exigen cuando los honorarios superan $1,000.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "your-file",
    order: 2,
    minutes: 4,
    title: { en: "You Are Entitled to Your File", es: "Usted tiene derecho a su expediente" },
    summary: {
      en: "How to ask for your client file, what belongs to you, and a letter you can copy.",
      es: "Cómo pedir su expediente de cliente, qué le pertenece, y una carta que puede copiar.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "Ask in writing, always", es: "Pida siempre por escrito" },
        p: [
          {
            en: "Send your request by email or letter. Keep a copy with the date. A written request creates a record. That record helps if you complain later.",
            es: "Envíe su pedido por correo electrónico o carta. Conserve una copia con la fecha. Un pedido por escrito crea un registro. Ese registro ayuda si se queja después.",
          },
        ],
      },
      {
        h: { en: "What belongs to you", es: "Qué le pertenece" },
        p: [
          {
            en: "You get papers you gave the lawyer, court filings, signed documents, and evidence in your case. You do not get the lawyer's private notes or internal work product.",
            es: "Recibe los papeles que entregó al abogado, presentaciones judiciales, documentos firmados y evidencia de su caso. No recibe las notas privadas del abogado ni su trabajo interno.",
          },
        ],
      },
      {
        h: { en: "The lawyer cannot keep your file to force payment", es: "El abogado no puede retener su expediente para obligar el pago" },
        p: [
          {
            en: "In most situations a lawyer may not hold your file hostage over a fee disagreement. If your papers are being kept from you, that can be a rule violation on its own.",
            es: "En la mayoría de los casos, un abogado no puede retener su expediente por un desacuerdo de honorarios. Si le retienen sus papeles, eso mismo puede ser una violación a las reglas.",
          },
        ],
      },
      {
        h: { en: "Template: file request letter", es: "Modelo: carta de solicitud de expediente" },
        p: [
          {
            en: "Copy, fill in, send. Keep proof of sending.",
            es: "Copie, complete y envíe. Guarde prueba del envío.",
          },
        ],
        list: [
          {
            en: "\"Dear [Lawyer]: I am the client in [matter]. I request a complete copy of my client file, including all court documents, correspondence, and papers I signed. Please deliver it to [address/email] within 14 days. [Signature, date]\"",
            es: "\u00abEstimado/a [abogado/a]: Soy el/la cliente en el asunto [caso]. Solicito una copia completa de mi expediente, incluidos todos los documentos judiciales, correspondencia y papeles que firmé. Por favor entréguelo en [dirección/correo] dentro de 14 días. [Firma, fecha]\u00bb",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas rule", es: "Regla de Texas" },
          p: [
            { en: "Texas Rule 1.16(d) says that at the end of a representation, a lawyer must release papers and property to the client.", es: "La Regla 1.16(d) de Texas dice que al terminar la representación, el abogado debe entregar al cliente sus papeles y pertenencias." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California rule", es: "Regla de California" },
          p: [
            { en: "California Rule 1.16(e) requires prompt release of client papers and property at termination. California also has a statutory procedure (Bus. & Prof. Code 6068(m)) that lets a lawyer ask a court to decide fee-vs-file disputes — you can respond in that process.", es: "La Regla 1.16(e) de California exige la entrega pronta de los papeles y pertenencias del cliente al terminar. California también tiene un procedimiento legal (Cód. Negocios y Profesiones 6068(m)) que permite al abogado pedir a un tribunal decidir disputas de honorarios contra expediente; usted puede responder en ese proceso." },
          ],
        },
      ],
    },
  },
  {
    slug: "trust-money",
    order: 3,
    minutes: 5,
    title: { en: "How Attorneys Must Handle Your Money", es: "Cómo los abogados deben manejar su dinero" },
    summary: {
      en: "Trust accounts, retainers, settlements, and refunds — the rules in plain words.",
      es: "Cuentas de depósito, retainers, acuerdos y reembolsos: las reglas en palabras simples.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "The trust account", es: "La cuenta de depósito (trust account)" },
        p: [
          {
            en: "Lawyers must keep client money separate from their own money, in a trust account. Mixing your money with theirs is one of the most serious rule violations.",
            es: "Los abogados deben mantener el dinero del cliente separado del suyo, en una cuenta de depósito. Mezclar su dinero con el suyo es una de las violaciones más graves.",
          },
        ],
      },
      {
        h: { en: "Retainers and advances", es: "Retainers y anticipos" },
        p: [
          {
            en: "An advance fee stays yours until the lawyer earns it. If the case ends early, the unearned part must be refunded within a reasonable time. A 'nonrefundable retainer' label does not erase this duty.",
            es: "Un anticipo sigue siendo suyo hasta que el abogado lo gane. Si el caso termina antes, la parte no ganada debe reembolsarse en un tiempo razonable. La etiqueta \u00abretainer no reembolsable\u00bb no borra este deber.",
          },
        ],
      },
      {
        h: { en: "Settlement money", es: "Dinero de acuerdos" },
        p: [
          {
            en: "When a settlement is paid, the money should go to the trust account first. Then fees and costs are taken out, and the rest is paid to you. Long, unexplained delays are a classic warning sign.",
            es: "Cuando se paga un acuerdo, el dinero debe ir primero a la cuenta de depósito. Luego se descuentan honorarios y costos, y el resto se le paga. Demoras largas sin explicación son una señal de alerta clásica.",
          },
        ],
      },
      {
        h: { en: "Pay with a paper trail", es: "Pague dejando rastro" },
        p: [
          {
            en: "Pay by check, card, or transfer. Ask for a receipt every time. Be careful with cash and never make checks payable to the lawyer personally for case money.",
            es: "Pague con cheque, tarjeta o transferencia. Pida recibo siempre. Tenga cuidado con el efectivo y nunca haga cheques a nombre del abogado personalmente para dinero del caso.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas rules", es: "Reglas de Texas" },
          p: [
            { en: "Texas Rule 1.14 requires safekeeping client funds in a separate account and prompt delivery. Texas Rule 1.14(d) requires prompt notice when you receive funds.", es: "La Regla 1.14 de Texas exige guardar los fondos del cliente en cuenta separada y entregarlos pronto. La Regla 1.14(d) exige avisar pronto cuando usted recibe fondos." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California rules", es: "Reglas de California" },
          p: [
            { en: "California Rule 4-100 governs client trust accounts: client funds must be deposited there and paid out promptly. The State Bar audits trust accounts.", es: "La Regla 4-100 de California rige las cuentas de depósito: los fondos del cliente deben depositarse ahí y pagarse pronto. El Colegio audita estas cuentas." },
          ],
        },
      ],
    },
  },
  {
    slug: "fee-agreement",
    order: 4,
    minutes: 5,
    title: { en: "Understanding Your Fee Agreement", es: "Entienda su acuerdo de honorarios" },
    summary: {
      en: "Contingency, hourly, flat fee — and the questions to ask before you sign.",
      es: "Contingency, por hora, precio fijo: y las preguntas que debe hacer antes de firmar.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "The three common types", es: "Los tres tipos comunes" },
        p: [
          {
            en: "Contingency: the lawyer is paid a percent of what you win — nothing if you lose. Hourly: you pay for time worked. Flat fee: one price for a defined job.",
            es: "Contingency: el abogado recibe un porcentaje de lo que gane; nada si pierde. Por hora: paga por el tiempo trabajado. Precio fijo: un precio por un trabajo definido.",
          },
        ],
      },
      {
        h: { en: "What should be in it", es: "Qué debe contener" },
        p: [
          {
            en: "The rate or percent, what costs you pay (filing fees, experts, copies), when you pay, and what happens if you fire the lawyer. If something is not written, it is hard to prove later.",
            es: "La tarifa o porcentaje, qué costos paga usted (cuotas judiciales, expertos, copias), cuándo paga y qué pasa si despide al abogado. Si algo no está escrito, es difícil probarlo después.",
          },
        ],
      },
      {
        h: { en: "Fees must be reasonable", es: "Los honorarios deben ser razonables" },
        p: [
          {
            en: "Even a signed agreement cannot charge unreasonable fees. Look at: time spent, difficulty, results, and local norms. Charges for work that never happened are not reasonable.",
            es: "Aunque firme un acuerdo, no pueden cobrarse honorarios irrazonables. Mire: tiempo invertido, dificultad, resultados y normas locales. Cobros por trabajo que nunca ocurrió no son razonables.",
          },
        ],
      },
      {
        h: { en: "Keep every paper", es: "Conserve todos los papeles" },
        p: [
          {
            en: "Store your agreement, every invoice, and every receipt. LexGuard's money log can track each payment next to what was promised.",
            es: "Guarde su acuerdo, cada factura y cada recibo. El registro de dinero de LexGuard puede anotar cada pago junto a lo prometido.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas notes", es: "Notas de Texas" },
          p: [
            { en: "Texas Rule 1.04 requires reasonable fees and sets the factors. A written agreement is not always mandatory in Texas — which is why your own written records matter even more.", es: "La Regla 1.04 de Texas exige honorarios razonables y define los factores. En Texas un acuerdo escrito no siempre es obligatorio; por eso sus propios registros escritos importan aún más." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California notes", es: "Notas de California" },
          p: [
            { en: "California generally requires written fee agreements when fees will exceed $1,000 (Bus. & Prof. Code 6148). Contingency agreements must be written and signed (6147) and must state the percent.", es: "En California generalmente se exigen acuerdos escritos cuando los honorarios superan $1,000 (Cód. Neg. y Prof. 6148). Los acuerdos de contingency deben ser escritos y firmados (6147) y deben indicar el porcentaje." },
          ],
        },
      ],
    },
  },
  {
    slug: "fire-lawyer",
    order: 5,
    minutes: 5,
    title: { en: "How to Fire Your Lawyer and Protect Yourself", es: "Cómo despedir a su abogado y protegerse" },
    summary: {
      en: "You can end the relationship at any time. Here is how to do it safely.",
      es: "Puede terminar la relación en cualquier momento. Así puede hacerlo con seguridad.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "Before you fire", es: "Antes de despedir" },
        p: [
          {
            en: "Check your deadlines first. If a court date or filing deadline is close, make sure the new lawyer can take over in time. Missing a deadline can hurt more than a bad lawyer.",
            es: "Primero revise sus fechas límite. Si hay una audiencia o fecha de presentación cerca, asegúrese de que el nuevo abogado pueda tomar el caso a tiempo. Perder una fecha puede dañar más que un mal abogado.",
          },
        ],
      },
      {
        h: { en: "Put it in writing", es: "Hágalo por escrito" },
        p: [
          {
            en: "Send a short letter or email: 'I am ending our representation effective today. Please send my complete file to [address] and a final invoice.' Keep a copy.",
            es: "Envíe una carta o correo breve: \u00abTermino nuestra representación hoy. Por favor envíe mi expediente completo a [dirección] y una factura final.\u00bb Conserve copia.",
          },
        ],
      },
      {
        h: { en: "The substitution form", es: "El formulario de sustitución" },
        p: [
          {
            en: "If you have an active court case, the court may need a 'substitution of counsel' form signed by you and your new lawyer. Ask the court clerk or your new lawyer.",
            es: "Si tiene un caso activo en el tribunal, puede necesitar un formulario de \u00absustitución de abogado\u00bb firmado por usted y su nuevo abogado. Pregunte en la oficina del tribunal o a su nuevo abogado.",
          },
        ],
      },
      {
        h: { en: "Your money at the end", es: "Su dinero al final" },
        p: [
          {
            en: "Ask for a final invoice and a refund of anything unearned. Compare the invoice to your agreement. You may dispute charges you do not recognize.",
            es: "Pida una factura final y el reembolso de lo no ganado. Compare la factura con su acuerdo. Puede disputar cobros que no reconoce.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas notes", es: "Notas de Texas" },
          p: [
            { en: "Texas Rule 1.15(d) covers declining or ending representation: protect the client's interests, return papers, and refund unearned fees.", es: "La Regla 1.15(d) de Texas cubre el fin de la representación: proteger los intereses del cliente, devolver los papeles y reembolsar honorarios no ganados." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California notes", es: "Notas de California" },
          p: [
            { en: "California Rule 1.16 requires protecting client interests at termination, prompt file release, and refund of unearned fees. Court permission may be needed to withdraw mid-case.", es: "La Regla 1.16 de California exige proteger los intereses del cliente al terminar, entregar el expediente pronto y reembolsar lo no ganado. Puede requerirse permiso del tribunal para retirarse a mitad del caso." },
          ],
        },
      ],
    },
  },
];
