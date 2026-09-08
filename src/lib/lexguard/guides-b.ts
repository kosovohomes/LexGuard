// LexGuard Guide Library B (guides 6–10) — PRD FR-1.2, bilingual EN/ES.

import type { Guide } from "./guides-a";

export const GUIDES_B: Guide[] = [
  {
    slug: "discipline-system",
    order: 6,
    minutes: 6,
    title: { en: "The Discipline System Explained", es: "El sistema disciplinario explicado" },
    summary: {
      en: "What really happens after you file a complaint — steps, timelines, and honest limits.",
      es: "Qué sucede realmente después de presentar una queja: pasos, plazos y límites honestos.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "What discipline is for", es: "Para qué sirve la disciplina" },
        p: [
          {
            en: "The discipline system protects the public. It can sanction a lawyer who breaks the professional rules. It is not a way to get money back and it does not fix your case.",
            es: "El sistema disciplinario protege al público. Puede sancionar a un abogado que rompe las reglas profesionales. No es una forma de recuperar dinero y no arregla su caso.",
          },
        ],
      },
      {
        h: { en: "How a complaint moves", es: "Cómo avanza una queja" },
        p: [
          {
            en: "Intake: a lawyer screens your complaint and classifies it. Investigation: staff collect responses and records. Review: a committee or judge decides. Outcome: dismissal, private sanction, or public discipline.",
            es: "Admisión: un abogado revisa y clasifica su queja. Investigación: el personal recopila respuestas y registros. Revisión: un comité o juez decide. Resultado: desestimación, sanción privada o disciplina pública.",
          },
        ],
      },
      {
        h: { en: "Be honest about timelines", es: "Sea realista con los plazos" },
        p: [
          {
            en: "This takes months, sometimes more than a year. Many complaints end in dismissal or informal resolutions. A well-documented complaint with dates and evidence is treated differently from a vague one. That is exactly what LexGuard's dossier helps you build.",
            es: "Toma meses, a veces más de un año. Muchas quejas terminan en desestimación o acuerdos informales. Una queja bien documentada, con fechas y evidencia, se trata distinto que una vaga. Eso es justo lo que el expediente de LexGuard le ayuda a construir.",
          },
        ],
      },
      {
        h: { en: "What if it is dismissed?", es: "¿Y si la desestiman?" },
        p: [
          {
            en: "A dismissal is not the end. Depending on your harm, other channels may still fit: fee mediation/arbitration, the Client Security Fund, or a court claim. Check the remedy router.",
            es: "Una desestimación no es el final. Según su daño, otros canales pueden servir: mediación/arbitraje de honorarios, el Fondo de Seguridad del Cliente o una demanda. Consulte el enrutador de remedios.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas specifics", es: "Especificidades de Texas" },
          p: [
            { en: "Grievances go to the Chief Disciplinary Counsel (cdc.texasbar.com, 866-224-5999). Remember: signing the grievance form waives attorney-client privilege for the subject matter. Copies only — no originals, no staples.", es: "Las quejas van al Chief Disciplinary Counsel (cdc.texasbar.com, 866-224-5999). Recuerde: firmar el formulario renuncia al privilegio abogado-cliente sobre el tema. Solo copias: sin originales ni engrapadores." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California specifics", es: "Especificidades de California" },
          p: [
            { en: "Complaints go to the State Bar's Office of Chief Trial Counsel. The form comes in seven languages. You can also call the Intake Unit (213-765-1200 / 800-843-9053).", es: "Las quejas van a la Office of Chief Trial Counsel del Colegio. El formulario está en siete idiomas. También puede llamar a la Intake Unit (213-765-1200 / 800-843-9053)." },
          ],
        },
      ],
    },
  },
  {
    slug: "client-security-fund",
    order: 7,
    minutes: 6,
    title: { en: "Client Security Funds: Getting Stolen Money Back", es: "Fondos de Seguridad del Cliente: recuperar dinero robado" },
    summary: {
      en: "Every state has a fund that can repay clients of dishonest lawyers. Most victims never hear about it.",
      es: "Cada estado tiene un fondo que puede reembolsar a clientes de abogados deshonestos. La mayoría de las víctimas nunca lo escucha.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "What it is", es: "Qué es" },
        p: [
          {
            en: "A Client Security Fund (CSF) pays clients who lost money to a lawyer's dishonesty — stolen settlement money, fees taken for work never done. It is paid by the state's lawyers, not by you.",
            es: "Un Fondo de Seguridad del Cliente (CSF) paga a clientes que perdieron dinero por deshonestidad de un abogado: acuerdos robados, honorarios cobrados sin trabajo. Lo pagan los abogados del estado, no usted.",
          },
        ],
      },
      {
        h: { en: "What it does not cover", es: "Qué no cubre" },
        p: [
          {
            en: "It does not pay for bad results, malpractice, or fee disagreements. If your harm is 'the lawyer did poor work,' the CSF is not your channel. If your harm is 'my money disappeared,' it may be.",
            es: "No paga por malos resultados, mala praxis ni desacuerdos de honorarios. Si su daño es \u00abel abogado hizo mal trabajo\u00bb, el CSF no es su canal. Si su daño es \u00abmi dinero desapareció\u00bb, puede serlo.",
          },
        ],
      },
      {
        h: { en: "Deadlines decide everything", es: "Los plazos lo deciden todo" },
        p: [
          {
            en: "Each state has a filing window tied to discipline or discovery. Mark the window in your calendar the day you learn about it. Missing it is the most common way victims lose eligibility.",
            es: "Cada estado tiene una ventana de presentación ligada a la disciplina o al descubrimiento. Márquela en su calendario el día que la conozca. Perderla es la forma más común de perder elegibilidad.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas fund — key facts", es: "Fondo de Texas: datos clave" },
          p: [
            { en: "Requires a grievance first, with findings that the lawyer stole money or failed to refund an unearned fee — unless the lawyer is already disbarred, resigned, deceased, or on indefinite disability suspension.", es: "Exige primero una queja, con hallazgos de robo o falta de reembolso de honorarios, salvo que el abogado ya esté expulsado, haya renunciado, fallecido o en suspensión indefinida por discapacidad." },
            { en: "Apply within 18 months after the disciplinary judgment is final. Does not cover malpractice, fee disputes, or outcome dissatisfaction. Payment requires subrogation (you assign your claim against the lawyer to the Fund).", es: "Aplique dentro de los 18 meses tras la sentencia disciplinaria firme. No cubre mala praxis, disputas de honorarios ni insatisfacción con resultados. El pago exige subrogación (cede su reclamo contra el abogado al Fondo)." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California fund — key facts", es: "Fondo de California: datos clave" },
          p: [
            { en: "Up to $100,000 per claim for losses on/after Jan 1, 2009 ($50,000 before). Covers theft of entrusted funds and failure to refund fees when no services were performed. Excludes negligence/malpractice, interest, and consequential damages.", es: "Hasta $100,000 por caso por pérdidas desde el 1 de enero de 2009 ($50,000 antes). Cubre robo de fondos confiados y no reembolso de honorarios sin servicios. Excluye negligencia/mala praxis, intereses y daños consecuentes." },
            { en: "File within 4 years of discovering the loss. The lawyer must be disbarred, disciplined, resigned, deceased, adjudicated incompetent, a judgment debtor, or convicted (waivers possible). Process: Tentative Decision → 30-day objection window → Final Decision; checks ~4–6 weeks later. Superior-court review within 90 days. Contact: 845 South Figueroa St., Los Angeles, CA 90017; 213-765-1140.", es: "Presente dentro de los 4 años desde que descubrió la pérdida. El abogado debe estar expulsado, disciplinado, renunciado, fallecido, incompetente declarado, deudor de sentencia o condenado (excepciones posibles). Proceso: Decisión Tentativa → 30 días de objeciones → Decisión Final; cheques ~4–6 semanas después. Revisión del tribunal superior dentro de 90 días. Contacto: 845 South Figueroa St., Los Ángeles, CA 90017; 213-765-1140." },
          ],
        },
      ],
    },
  },
  {
    slug: "fee-disputes",
    order: 8,
    minutes: 5,
    title: { en: "Fee Disputes: Arbitration and Mediation", es: "Disputas de honorarios: arbitraje y mediación" },
    summary: {
      en: "You often do not need court to fight a bill. Both states have low-cost programs.",
      es: "A menudo no necesita el tribunal para disputar una factura. Ambos estados tienen programas de bajo costo.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "Mediation vs. arbitration", es: "Mediación vs. arbitraje" },
        p: [
          {
            en: "Mediation: a neutral helps you both reach a voluntary deal. Arbitration: a neutral hears both sides and makes a decision. Arbitration can be binding if you agree to accept it.",
            es: "Mediación: un neutral les ayuda a llegar a un acuerdo voluntario. Arbitraje: un neutral escucha a ambos y decide. El arbitraje puede ser vinculante si usted lo acepta.",
          },
        ],
      },
      {
        h: { en: "Prepare your numbers", es: "Prepare sus números" },
        p: [
          {
            en: "Bring: the fee agreement, every invoice, every receipt, and your notes of what was promised. Line up each charge against the agreement. Unknown charges should be marked and questioned in writing first.",
            es: "Lleve: el acuerdo de honorarios, cada factura, cada recibo y sus notas de lo prometido. Compare cada cobro con el acuerdo. Los cobros desconocidos deben marcarse y cuestionarse primero por escrito.",
          },
        ],
      },
      {
        h: { en: "Why written questions first", es: "Por qué primero preguntas por escrito" },
        p: [
          {
            en: "Before a hearing, send a short email asking for an itemized explanation of each charge you dispute. The answer (or silence) becomes evidence. LexGuard's journal keeps this exchange dated and organized.",
            es: "Antes de una audiencia, envíe un correo breve pidiendo explicación detallada de cada cobro disputado. La respuesta (o el silencio) se vuelve evidencia. El diario de LexGuard guarda este intercambio con fechas y orden.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas program", es: "Programa de Texas" },
          p: [
            { en: "CAAP (Client-Attorney Assistance Program, 800-932-1907) offers free voluntary mediation. It is commonly offered when a grievance is dismissed, but you can ask about fee mediation directly.", es: "CAAP (Programa de Asistencia Cliente-Abogado, 800-932-1907) ofrece mediación voluntaria gratuita. Suele ofrecerse cuando se desestima una queja, pero puede preguntar directamente por la mediación de honorarios." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California program", es: "Programa de California" },
          p: [
            { en: "Mandatory fee arbitration (Bus. & Prof. Code 6200–6206) runs through local bar associations — for example the LA County Bar and SF Bar programs. If the lawyer sues you for fees, you can generally demand arbitration first.", es: "El arbitraje obligatorio de honorarios (Cód. Neg. y Prof. 6200–6206) funciona vía colegios locales: por ejemplo, los programas del LA County Bar y SF Bar. Si el abogado le demanda por honorarios, generalmente puede exigir arbitraje primero." },
          ],
        },
      ],
    },
  },
  {
    slug: "malpractice",
    order: 9,
    minutes: 4,
    title: { en: "When It Might Be Malpractice", es: "Cuándo podría ser mala praxis" },
    summary: {
      en: "Malpractice is a separate civil claim. This guide explains what it is — and why deadlines matter so much.",
      es: "La mala praxis es una demanda civil separada. Esta guía explica qué es y por qué los plazos importan tanto.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "The three parts", es: "Las tres partes" },
        p: [
          {
            en: "A lawyer-client relationship existed. The lawyer's work fell below acceptable professional standards. That failure caused you harm. All three must be present.",
            es: "Existía una relación abogado-cliente. El trabajo del abogado cayó por debajo de los estándares profesionales aceptables. Ese fallo le causó daño. Las tres partes deben existir.",
          },
        ],
      },
      {
        h: { en: "Not every mistake qualifies", es: "No todo error califica" },
        p: [
          {
            en: "A rude email is not malpractice. A missed filing deadline that destroyed your case might be. The question is whether the work itself was negligent and whether it caused real damage.",
            es: "Un correo grosero no es mala praxis. Una fecha de presentación vencida que destruyó su caso podría serlo. La pregunta es si el trabajo fue negligente y si causó daño real.",
          },
        ],
      },
      {
        h: { en: "The deadline is unforgiving", es: "El plazo no perdona" },
        p: [
          {
            en: "Malpractice claims have strict deadlines that start when you discover (or should have discovered) the harm. If you think your case was damaged, get a professional evaluation now — this guide is information, not advice.",
            es: "Las demandas por mala praxis tienen plazos estrictos que corren desde que descubre (o debió descubrir) el daño. Si cree que su caso fue dañado, pida una evaluación profesional ahora; esta guía es información, no asesoría.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Texas limits", es: "Plazos de Texas" },
          p: [
            { en: "Texas generally applies a two-year limitations period with a ten-year repose cap. Exact deadlines depend on your facts — verify with a licensed attorney or legal aid.", es: "Texas generalmente aplica un plazo de dos años con tope de diez años. Los plazos exactos dependen de sus hechos; verifíquelos con un abogado con licencia o asistencia legal." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "California limits", es: "Plazos de California" },
          p: [
            { en: "California generally applies one year from discovery, with a four-year maximum (Code Civ. Proc. 340.6). Exact deadlines depend on your facts — verify with a licensed attorney or legal aid.", es: "California generalmente aplica un año desde el descubrimiento, con máximo de cuatro años (Cód. Proc. Civil 340.6). Los plazos exactos dependen de sus hechos; verifíquelos con un abogado o asistencia legal." },
          ],
        },
      ],
    },
  },
  {
    slug: "warning-signs",
    order: 10,
    minutes: 4,
    title: { en: "Warning Signs Checklist", es: "Lista de señales de alerta" },
    summary: {
      en: "A neutral checklist of patterns that often appear before serious harm. Use it to decide what to log.",
      es: "Una lista neutral de patrones que suelen aparecer antes de un daño grave. Úsela para decidir qué registrar.",
    },
    lastReviewed: "2026-09-09",
    reviewer: {
      en: "LexGuard editorial team — attorney sign-off pending (Phase 1 review workflow)",
      es: "Equipo editorial LexGuard — firma de abogado pendiente (flujo de revisión Fase 1)",
    },
    sections: [
      {
        h: { en: "Money patterns", es: "Patrones de dinero" },
        p: [{ en: "Watch for these and log them with dates.", es: "Esté atento y regístrelos con fechas." }],
        list: [
          { en: "Settlement received by the lawyer weeks ago, no payment to you.", es: "Acuerdo recibido por el abogado hace semanas, sin pago a usted." },
          { en: "Requests for cash, or checks to the lawyer personally.", es: "Pedidos de efectivo, o cheques a nombre del abogado personalmente." },
          { en: "Charges you cannot match to your agreement.", es: "Cobros que no puede relacionar con su acuerdo." },
          { en: "Refund promised at the end of the case, never arrives.", es: "Reembolso prometido al final del caso, nunca llega." },
        ],
      },
      {
        h: { en: "Communication patterns", es: "Patrones de comunicación" },
        p: [{ en: "One silence may be an accident. Patterns are different.", es: "Un silencio puede ser accidente. Los patrones son otra cosa." }],
        list: [
          { en: "Weeks of unanswered calls and emails, again and again.", es: "Semanas de llamadas y correos sin respuesta, una y otra vez." },
          { en: "Only the paralegal answers, and the lawyer never calls.", es: "Solo responde el asistente y el abogado nunca llama." },
          { en: "You learn things about your own case from the court, not from your lawyer.", es: "Se entera de su propio caso por el tribunal, no por su abogado." },
        ],
      },
      {
        h: { en: "Case patterns", es: "Patrones del caso" },
        p: [{ en: "These tend to be the most serious.", es: "Estos suelen ser los más graves." }],
        list: [
          { en: "Court dates pass with no preparation you know of.", es: "Fechas judiciales pasan sin preparación que usted conozca." },
          { en: "The lawyer missed a hearing entirely.", es: "El abogado faltó por completo a una audiencia." },
          { en: "A settlement happens without your authorization.", es: "Se hace un acuerdo sin su autorización." },
          { en: "The lawyer has a connection to the other side.", es: "El abogado tiene conexión con la otra parte." },
          { en: "You are asked to say things that are not true.", es: "Le piden decir cosas que no son ciertas." },
        ],
      },
      {
        h: { en: "What to do with this list", es: "Qué hacer con esta lista" },
        p: [
          {
            en: "Check each item against your journal. The red-flag panel turns checked patterns into neutral observations you can use in a complaint. Nothing here is a conclusion — it is a way to organize facts.",
            es: "Revise cada punto con su diario. El panel de alertas convierte los patrones marcados en observaciones neutrales que puede usar en una queja. Nada aquí es una conclusión: es una forma de organizar hechos.",
          },
        ],
      },
    ],
    stateNotes: {
      TX: [
        {
          h: { en: "Check the Texas attorney's public record", es: "Consulte el expediente público del abogado en Texas" },
          p: [
            { en: "The State Bar of Texas offers a free online attorney search that shows licensing status and public disciplinary history. Prior grievances or sanctions involving similar patterns are factual information you can note in your journal — it is public record, not an accusation.", es: "El Colegio de Abogados de Texas ofrece una búsqueda gratuita de abogados en línea que muestra el estado de la licencia y el historial disciplinario público. Quejas o sanciones previas con patrones similares son información fáctica que puede registrar en su diario: es un expediente público, no una acusación." },
          ],
        },
      ],
      CA: [
        {
          h: { en: "Check the California attorney's public record", es: "Consulte el expediente público del abogado en California" },
          p: [
            { en: "The State Bar of California's attorney search shows each lawyer's license status, public disciplinary record, and administrative actions. Reviewing it is a neutral fact-gathering step — note what you find and when, and rely on the official record rather than unofficial websites.", es: "La búsqueda de abogados del Colegio de Abogados de California muestra el estado de la licencia, el expediente disciplinario público y las acciones administrativas de cada abogado. Consultarlo es un paso neutral de recopilación de hechos: registre lo que encuentre y cuándo, y confíe en el expediente oficial en lugar de sitios no oficiales." },
          ],
        },
      ],
    },
  },
];
