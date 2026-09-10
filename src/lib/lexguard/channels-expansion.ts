// LexGuard Remedy Router — Phase-5 expansion-state channels (FL / NY / AZ).
// PRD §13 Phase-4 deferred item ("additional states (FL/NY/AZ)").
//
// FACTS: verified from official public sources on 2026-09-10 — The Florida Bar
// (floridabar.org ACAP / Legal Fee Arbitration), New York Courts
// (nycourts.gov/attorney-grievance-committees, Part 137 FDRP), the NY Lawyers'
// Fund for Client Protection (nylawfund.org), and the State Bar of Arizona
// (azbar.org Lawyer Regulation / Client Protection Fund / Fee Arbitration).
// See docs/STATE_FACTS_PHASE5.md for the full fact sheet and re-verify rule.
// Formal licensed-attorney review is still pending for these states.
//
// LANGUAGE POLICY (PRD §3.1): conditional, neutral, education-first — same
// standard as the TX/CA channels in channels.ts.

import type { ChannelDef, ChannelKind } from "./channels-shared";

export const CHANNELS_FL: Record<ChannelKind, ChannelDef> = {
  discipline: {
    kind: "discipline",
    name: {
      en: "The Florida Bar discipline complaint (via ACAP)",
      es: "Queja disciplinaria ante The Florida Bar (vía ACAP)",
    },
    tagline: {
      en: "The formal system that can investigate and sanction a Florida attorney.",
      es: "El sistema formal que puede investigar y sancionar a un abogado de Florida.",
    },
    canDo: {
      en: [
        "Investigates allegations of professional misconduct (neglect, no communication, trust-account misuse, settling without authority, dishonesty).",
        "Can impose discipline: reprimand, suspension, or disbarment.",
        "Its Attorney Consumer Assistance Program (ACAP) is the central intake for complaints against all Florida lawyers and can also offer guidance or mediation-style help.",
      ],
      es: [
        "Investiga alegatos de mala praxis profesional (negligencia, falta de comunicación, mal uso de cuentas de depósito, acuerdos sin autorización, deshonestidad).",
        "Puede imponer disciplina: reprensión, suspensión o exclusión de la profesión.",
        "Su Programa de Asistencia al Consumidor (ACAP) es la recepción central de quejas contra todos los abogados de Florida y también puede orientar o mediar.",
      ],
    },
    cannotDo: {
      en: [
        "Cannot order the lawyer to return your money or pay you damages.",
        "Cannot give you legal advice or represent you.",
        "Cannot overturn a court's decision in your case.",
      ],
      es: [
        "No puede ordenar al abogado que le devuelva su dinero ni pagarle una indemnización.",
        "No puede darle asesoría legal ni representarlo.",
        "No puede revocar la decisión de un tribunal en su caso.",
      ],
    },
    prerequisites: {
      en: [
        "The lawyer must be a member of The Florida Bar.",
        "A description of what happened, with dates, names, and any documents you have.",
      ],
      es: [
        "El abogado debe ser miembro de The Florida Bar.",
        "Una descripción de lo ocurrido, con fechas, nombres y los documentos que tenga.",
      ],
    },
    windows: {
      en: "There is no fixed filing deadline, but report as soon as you can — evidence and memories fade, and delay can make investigation harder.",
      es: "No existe un plazo fijo para presentar, pero hágalo cuanto antes — la evidencia y la memoria se pierden, y la demora dificulta la investigación.",
    },
    process: {
      en: "Start with ACAP (toll-free 1-866-352-0707) or submit the Inquiry/Complaint form online or by mail. ACAP reviews every complaint first; matters that may involve a rule violation move to Disciplinary Counsel for investigation.",
      es: "Comience con ACAP (gratis al 1-866-352-0707) o presente el formulario de consulta/queja en línea o por correo. ACAP revisa primero toda queja; los asuntos que puedan implicar violación de reglas pasan a los abogados disciplinarios para investigar.",
    },
    links: [
      { label: "The Florida Bar — ACAP (Attorney Consumer Assistance Program)", url: "https://www.floridabar.org/public/acap/" },
      { label: "The Florida Bar — attorney search", url: "https://www.floridabar.org/directories/find-mbr/" },
    ],
    warnings: {
      en: [
        "A bar complaint is not a lawsuit — it cannot get your money back.",
        "Keep copies of everything you send; send copies only, never originals.",
        "If your matter also involves stolen money, ask about the Clients' Security Fund separately.",
      ],
      es: [
        "Una queja ante el colegio no es una demanda — no puede recuperar su dinero.",
        "Guarde copias de todo lo que envíe; envíe solo copias, nunca originales.",
        "Si su asunto también implica dinero robado, pregunte aparte por el Fondo de Seguridad del Cliente.",
      ],
    },
    evidence: {
      en: [
        "Your dated journal entries and timeline export.",
        "Copies of emails, texts, letters, and invoices.",
        "The fee agreement, if you have one.",
        "Receipts or bank records showing payments.",
      ],
      es: [
        "Sus registros fechados y la línea de tiempo exportada.",
        "Copias de correos, mensajes, cartas y facturas.",
        "El acuerdo de honorarios, si lo tiene.",
        "Recibos o estados de cuenta que muestren los pagos.",
      ],
    },
  },
  csf: {
    kind: "csf",
    name: { en: "Clients' Security Fund (The Florida Bar)", es: "Fondo de Seguridad del Cliente (The Florida Bar)" },
    tagline: {
      en: "A fund that can reimburse clients when a Florida lawyer steals or wrongfully takes their money.",
      es: "Un fondo que puede reembolsar a clientes cuando un abogado de Florida roba o se apropi indebidamente de su dinero.",
    },
    canDo: {
      en: [
        "Reimburses losses caused by a lawyer's misappropriation, embezzlement, or other wrongful taking of funds.",
        "Pays up to $50,000 per claim (with smaller caps for certain claims, such as attorney-fee losses).",
      ],
      es: [
        "Reembolsa pérdidas causadas por apropiación indebida, malversación u otra toma ilegítima de fondos por el abogado.",
        "Paga hasta $50,000 por reclamo (con topes menores para ciertos reclamos, como pérdidas de honorarios).",
      ],
    },
    cannotDo: {
      en: [
        "Does not cover negligence, malpractice, or dissatisfaction with how the case was handled.",
        "Does not cover simple fee disagreements.",
        "Cannot sanction the lawyer — that is the discipline system's job.",
      ],
      es: [
        "No cubre negligencia, mala praxis ni insatisfacción con cómo se manejó el caso.",
        "No cubre simples desacuerdos sobre honorarios.",
        "No puede sancionar al abogado — eso corresponde al sistema disciplinario.",
      ],
    },
    prerequisites: {
      en: [
        "The loss must come from the lawyer's dishonest handling of your money.",
        "A claim must be filed within two years after you knew or should have known of the loss.",
        "Cooperation with the fund's investigation, and assignment of your recovery rights to the fund if it pays.",
      ],
      es: [
        "La pérdida debe provenir del manejo deshonesto de su dinero por el abogado.",
        "El reclamo debe presentarse dentro de los dos años desde que supo o debió suponer de la pérdida.",
        "Colaborar con la investigación del fondo, y ceder sus derechos de recuperación al fondo si paga.",
      ],
    },
    windows: {
      en: "Claim within 2 years after you know, or should have known, about the loss.",
      es: "Presente el reclamo dentro de los 2 años desde que supo o debió suponer de la pérdida.",
    },
    process: {
      en: "Request a claim form from The Florida Bar Clients' Security Fund, complete it with your loss details, and attach your evidence. The Fund reviews claims and may pay after its review; lawyers reimbursed must later make restitution to the Fund.",
      es: "Solicite el formulario al Fondo de Seguridad del Cliente de The Florida Bar, complételo con los detalles de su pérdida y adjunte su evidencia. El Fondo revisa los reclamos y puede pagar tras su revisión; el abogado reembolsado debe luego restituir al Fondo.",
    },
    links: [
      { label: "The Florida Bar — Clients' Security Fund", url: "https://www.floridabar.org/public/csf/" },
    ],
    warnings: {
      en: [
        "The 2-year window runs from discovery, not from the loss itself — file early anyway.",
        "The fund requires a lawyer's dishonesty; ordinary mistakes are for malpractice claims, not this fund.",
        "If the fund pays you, you generally assign your rights against the lawyer to the fund.",
      ],
      es: [
        "La ventana de 2 años corre desde el descubrimiento, no desde la pérdida — presente pronto de todos modos.",
        "El fondo exige deshonestidad del abogado; los errores ordinarios corresponden a una demanda de mala praxis, no a este fondo.",
        "Si el fondo le paga, generalmente usted cede sus derechos contra el abogado al fondo.",
      ],
    },
    evidence: {
      en: [
        "Proof you paid the lawyer (receipts, checks, bank statements).",
        "Trust-account or settlement paperwork showing where your money went.",
        "Your money-log export from this journal.",
      ],
      es: [
        "Prueba de lo que pagó al abogado (recibos, cheques, estados de cuenta).",
        "Documentos de cuenta de depósito o del acuerdo que muestren a dónde fue su dinero.",
        "El registro de dinero exportado de este diario.",
      ],
    },
  },
  fee: {
    kind: "fee",
    name: { en: "Florida Legal Fee Arbitration Program", es: "Programa de Arbitraje de Honorarios de Florida" },
    tagline: {
      en: "A free, voluntary way to resolve a fee disagreement with your (former) Florida lawyer.",
      es: "Una manera gratuita y voluntaria de resolver un desacuerdo de honorarios con su (ex) abogado de Florida.",
    },
    canDo: {
      en: [
        "Resolves disputes over the amount of legal fees through arbitration instead of court.",
        "Free and voluntary — either the client or the lawyer can start it.",
        "Decisions are binding under the program's rules once it proceeds.",
      ],
      es: [
        "Resuelve disputas sobre el monto de los honorarios mediante arbitraje en lugar de un tribunal.",
        "Gratuito y voluntario — el cliente o el abogado pueden iniciarlo.",
        "Las decisiones son vinculantes según las reglas del programa una vez que avanza.",
      ],
    },
    cannotDo: {
      en: [
        "Cannot discipline the lawyer or award money beyond the fee dispute.",
        "Does not decide malpractice questions.",
      ],
      es: [
        "No puede disciplinar al abogado ni otorgar dinero más allá de la disputa de honorarios.",
        "No decide cuestiones de mala praxis.",
      ],
    },
    prerequisites: {
      en: [
        "A disagreement with a Florida Bar member about fees charged or owed.",
        "Both sides must agree to arbitrate (the program is voluntary).",
      ],
      es: [
        "Un desacuerdo con un miembro de The Florida Bar sobre honorarios cobrados o adeudados.",
        "Ambas partes deben aceptar el arbitraje (el programa es voluntario).",
      ],
    },
    windows: {
      en: "Ask early — arbitration works best soon after the fee dispute arises, before positions harden.",
      es: "Pida pronto — el arbitraje funciona mejor poco después de que surja la disputa, antes de que las posiciones se endurezcan.",
    },
    process: {
      en: "File a request with The Florida Bar's fee arbitration program; the program contacts the lawyer, and if both sides agree, a neutral arbitrator (often a panel) reviews the bills and the agreement and issues a decision.",
      es: "Presente una solicitud ante el programa de arbitraje de honorarios de The Florida Bar; el programa contacta al abogado y, si ambos aceptan, un árbitro neutral (a menudo un panel) revisa las facturas y el acuerdo y emite una decisión.",
    },
    links: [
      { label: "The Florida Bar — Fee dispute programs", url: "https://www.floridabar.org/public/fee-arbitration/" },
    ],
    warnings: {
      en: [
        "Arbitration is usually binding — read the program's rules before agreeing.",
        "If the disagreement involves suspected theft, not just an amount dispute, the Clients' Security Fund may fit better.",
      ],
      es: [
        "El arbitraje suele ser vinculante — lea las reglas del programa antes de aceptar.",
        "Si el desacuerdo implica un posible robo y no solo un monto, el Fondo de Seguridad del Cliente puede ser más apropiado.",
      ],
    },
    evidence: {
      en: ["The fee agreement (written or oral terms you can show).", "All invoices and your payment records.", "A short chronology of what you were billed for."],
      es: ["El acuerdo de honorarios (escrito o los términos verbales que pueda mostrar).", "Todas las facturas y sus registros de pago.", "Una cronología breve de lo que le facturaron."],
    },
  },
  malpractice: {
    kind: "malpractice",
    name: { en: "Legal malpractice claim (Florida)", es: "Reclamo de mala praxis (Florida)" },
    tagline: {
      en: "A civil lawsuit is the channel that can recover money for a lawyer's negligent work. LexGuard only explains it — you would need your own lawyer.",
      es: "Una demanda civil es la vía que puede recuperar dinero por el trabajo negligente de un abogado. LexGuard solo lo explica — necesitaría su propio abogado.",
    },
    canDo: {
      en: [
        "Can compensate you for losses caused by a lawyer's negligent or wrongful professional work.",
        "A lawyer who takes the case works only for you.",
      ],
      es: [
        "Puede compensar pérdidas causadas por el trabajo negligente o ilícito de un abogado.",
        "Un abogado que tome el caso trabajaría solo para usted.",
      ],
    },
    cannotDo: {
      en: [
        "LexGuard cannot evaluate, file, or refer you to a specific malpractice lawyer.",
        "Not every mistake is malpractice — a lawyer must have failed the standard of care and caused a loss.",
      ],
      es: [
        "LexGuard no puede evaluar, presentar ni referirlo a un abogado específico de mala praxis.",
        "No todo error es mala praxis — el abogado debe haber incumplido el estándar de cuidado y causado una pérdida.",
      ],
    },
    prerequisites: {
      en: [
        "An attorney-client relationship, a failure to meet the standard of care, and a loss caused by it.",
        "Florida generally applies a two-year limitations period from discovery, with a four-year outer limit — exact deadlines depend on your facts.",
      ],
      es: [
        "Una relación abogado-cliente, un incumplimiento del estándar de cuidado y una pérdida causada por él.",
        "Florida generalmente aplica un plazo de dos años desde el descubrimiento, con un límite exterior de cuatro años — los plazos exactos dependen de sus hechos.",
      ],
    },
    windows: {
      en: "Florida's general malpractice period is commonly two years from discovery, with a four-year outer limit (Fla. Stat. ch. 95). Verify with a licensed Florida attorney.",
      es: "El plazo general de mala praxis en Florida suele ser de dos años desde el descubrimiento, con un límite exterior de cuatro años (Fla. Stat. cap. 95). Verifíquelo con un abogado con licencia en Florida.",
    },
    process: {
      en: "Consult a licensed Florida attorney (legal aid, a law-school clinic, or the Florida Bar's Lawyer Referral Service). Bring your journal export — organized dates and documents reduce consultation cost.",
      es: "Consulte a un abogado con licencia en Florida (asistencia legal, una clínica universitaria o el servicio de referidos de The Florida Bar). Lleve su diario exportado — fechas y documentos ordenados reducen el costo de la consulta.",
    },
    links: [
      { label: "FloridaLawHelp.org — free civil legal help", url: "https://www.floridalawhelp.org" },
      { label: "The Florida Bar — Lawyer Referral Service", url: "https://www.floridabar.org/public/lrs/" },
    ],
    warnings: {
      en: [
        "Deadlines are strict — ask about limitations periods in your first consultation.",
        "This is general information, not advice about your specific case.",
      ],
      es: [
        "Los plazos son estrictos — pregunte por los períodos de prescripción en su primera consulta.",
        "Esta es información general, no asesoría sobre su caso específico.",
      ],
    },
    evidence: {
      en: ["Your full journal export (timeline, money log, documents).", "Court records from the underlying case, if any.", "The fee agreement and all correspondence."],
      es: ["Su diario completo exportado (línea de tiempo, registro de dinero, documentos).", "Registros judiciales del caso original, si los hay.", "El acuerdo de honorarios y toda la correspondencia."],
    },
  },
};

export const CHANNELS_NY: Record<ChannelKind, ChannelDef> = {
  discipline: {
    kind: "discipline",
    name: {
      en: "Attorney Grievance Committee complaint (NY Appellate Division)",
      es: "Queja ante el Comité de Agravios (Appellate Division de NY)",
    },
    tagline: {
      en: "The court system's formal system that can investigate and sanction a New York attorney.",
      es: "El sistema formal del poder judicial que puede investigar y sancionar a un abogado de Nueva York.",
    },
    canDo: {
      en: [
        "Investigates misconduct by New York attorneys (neglect, communication failures, trust-account misuse, dishonesty).",
        "Can impose discipline: censure, suspension, or disbarment.",
        "Committees sit in the Appellate Division departments — file in the department where the lawyer's office is located.",
      ],
      es: [
        "Investiga mala praxis de abogados de Nueva York (negligencia, fallas de comunicación, mal uso de cuentas de depósito, deshonestidad).",
        "Puede imponer disciplina: censura, suspensión o exclusión de la profesión.",
        "Los comités operan en los departamentos de la Appellate Division — presente en el departamento donde está la oficina del abogado.",
      ],
    },
    cannotDo: {
      en: [
        "Cannot order the lawyer to return your money.",
        "Cannot give you legal advice or take over your case.",
        "Cannot change the outcome of your court case.",
      ],
      es: [
        "No puede ordenar al abogado que le devuelva su dinero.",
        "No puede darle asesoría legal ni hacerse cargo de su caso.",
        "No puede cambiar el resultado de su caso judicial.",
      ],
    },
    prerequisites: {
      en: [
        "The attorney must be admitted to practice in New York.",
        "A written description of what happened, with dates and any documents.",
      ],
      es: [
        "El abogado debe estar admitido para ejercer en Nueva York.",
        "Una descripción escrita de lo ocurrido, con fechas y documentos.",
      ],
    },
    windows: {
      en: "There is no fixed filing deadline, but file as soon as you can — delay makes investigation harder.",
      es: "No existe un plazo fijo, pero presente cuanto pueda — la demora dificulta la investigación.",
    },
    process: {
      en: "Send your written complaint to the Attorney Grievance Committee for the judicial department where the lawyer's office is located (forms and addresses at nycourts.gov). Committee staff review and may open an investigation; the lawyer is usually asked to respond.",
      es: "Envíe su queja escrita al Comité de Agravios del departamento judicial donde está la oficina del abogado (formularios y direcciones en nycourts.gov). El personal revisa y puede abrir una investigación; normalmente se le pide respuesta al abogado.",
    },
    links: [
      { label: "NY Courts — Attorney Grievance Committees (complaints)", url: "https://www.nycourts.gov/attorney-grievance-committees/complaints-about-attorneys" },
      { label: "NY Courts — attorney search", url: "https://iapps.courts.state.ny.us/attorneyservices" },
    ],
    warnings: {
      en: [
        "A grievance is not a lawsuit — it cannot recover your money.",
        "Keep copies of everything you send; send copies only, never originals.",
        "For stolen money, the Lawyers' Fund for Client Protection is a separate, parallel remedy.",
      ],
      es: [
        "Un agravio no es una demanda — no puede recuperar su dinero.",
        "Guarde copias de todo lo que envíe; envíe solo copias, nunca originales.",
        "Para dinero robado, el Fondo de Protección del Cliente es un remedio aparte y paralelo.",
      ],
    },
    evidence: {
      en: [
        "Your dated journal entries and timeline export.",
        "Copies of emails, texts, letters, and invoices.",
        "The fee agreement, if you have one.",
      ],
      es: [
        "Sus registros fechados y la línea de tiempo exportada.",
        "Copias de correos, mensajes, cartas y facturas.",
        "El acuerdo de honorarios, si lo tiene.",
      ],
    },
  },
  csf: {
    kind: "csf",
    name: { en: "New York Lawyers' Fund for Client Protection", es: "Fondo de Protección del Cliente de Nueva York" },
    tagline: {
      en: "A state-funded trust that reimburses clients for money stolen by a New York lawyer.",
      es: "Un fondo estatal que reembolsa a clientes el dinero robado por un abogado de Nueva York.",
    },
    canDo: {
      en: [
        "Reimburses client losses caused by a lawyer's dishonest conduct (larceny, embezzlement, fraud).",
        "Pays up to $450,000 for each client loss.",
        "It is a government trust financed by law — not charity.",
      ],
      es: [
        "Reembolsa pérdidas causadas por conducta deshonesta de un abogado (hurto, malversación, fraude).",
        "Paga hasta $450,000 por cada pérdida de un cliente.",
        "Es un fondo estatal financiado por ley — no caridad.",
      ],
    },
    cannotDo: {
      en: [
        "Has no jurisdiction over neglect, malpractice, or fee disputes.",
        "Cannot sanction the lawyer.",
      ],
      es: [
        "No tiene jurisdicción sobre negligencia, mala praxis ni disputas de honorarios.",
        "No puede sancionar al abogado.",
      ],
    },
    prerequisites: {
      en: [
        "The loss must come from the lawyer's dishonest conduct in the practice of law.",
        "Apply within two years after the loss or the discovery of the loss.",
      ],
      es: [
        "La pérdida debe provenir de la conducta deshonesta del abogado en el ejercicio de la profesión.",
        "Solicite dentro de los dos años después de la pérdida o de su descubrimiento.",
      ],
    },
    windows: {
      en: "Apply within 2 years after the loss or the discovery of the loss.",
      es: "Solicite dentro de los 2 años después de la pérdida o de su descubrimiento.",
    },
    process: {
      en: "File a claim form with the Lawyers' Fund (nylawfund.org, tel. 518-285-8350) describing the loss and attaching proof. Trustees review claims; approved payments are made after review and the lawyer owes restitution to the Fund.",
      es: "Presente el formulario ante el Fondo (nylawfund.org, tel. 518-285-8350) describiendo la pérdida y adjuntando pruebas. Los administradores revisan los reclamos; los pagos aprobados se emiten tras la revisión y el abogado debe restituir al Fondo.",
    },
    links: [
      { label: "New York Lawyers' Fund for Client Protection", url: "https://www.nylawfund.org" },
    ],
    warnings: {
      en: [
        "The Fund covers dishonesty only — not malpractice or fee disagreements.",
        "The 2-year clock can start at discovery — but file early.",
        "Payments may be delayed while the Fund verifies the facts.",
      ],
      es: [
        "El Fondo cubre solo deshonestidad — no mala praxis ni desacuerdos de honorarios.",
        "El reloj de 2 años puede iniciar en el descubrimiento — pero presente pronto.",
        "Los pagos pueden demorar mientras el Fondo verifica los hechos.",
      ],
    },
    evidence: {
      en: [
        "Proof of the money you gave the lawyer (checks, bank records).",
        "Settlement or trust-account paperwork showing the lawyer received your funds.",
        "Your money-log export from this journal.",
      ],
      es: [
        "Prueba del dinero que le dio al abogado (cheques, estados de cuenta).",
        "Documentos del acuerdo o de la cuenta de depósito que muestren que el abogado recibió sus fondos.",
        "El registro de dinero exportado de este diario.",
      ],
    },
  },
  fee: {
    kind: "fee",
    name: { en: "NY Part 137 Fee Dispute Resolution Program", es: "Programa de Resolución de Disputas de Honorarios (Parte 137) de NY" },
    tagline: {
      en: "The court system's arbitration program for attorney-fee disputes between $1,000 and $50,000.",
      es: "El programa de arbitraje del poder judicial para disputas de honorarios entre $1,000 y $50,000.",
    },
    canDo: {
      en: [
        "Resolves fee disputes of $1,000 to $50,000 through arbitration or conciliation, outside of court.",
        "When the client starts it, the lawyer must participate — the program is mandatory for attorneys at the client's request.",
        "Free or low-cost through local bar-association programs statewide.",
      ],
      es: [
        "Resuelve disputas de honorarios de $1,000 a $50,000 mediante arbitraje o conciliación, fuera del tribunal.",
        "Cuando el cliente lo inicia, el abogado debe participar — el programa es obligatorio para los abogados a pedido del cliente.",
        "Gratuito o de bajo costo a través de programas de colegios locales en todo el estado.",
      ],
    },
    cannotDo: {
      en: [
        "Does not cover amounts below $1,000 or above $50,000 unless both sides consent.",
        "Excludes criminal-matter fees and disputes involving substantial legal questions.",
        "Cannot discipline the lawyer.",
      ],
      es: [
        "No cubre montos menores a $1,000 ni mayores a $50,000, salvo consentimiento de ambos.",
        "Excluye honorarios de asuntos penales y disputas con cuestiones legales sustanciales.",
        "No puede disciplinar al abogado.",
      ],
    },
    prerequisites: {
      en: [
        "A fee dispute with a New York attorney in a civil matter.",
        "The lawyer must generally send you a written notice of your right to arbitrate (22 NYCRR Part 137).",
      ],
      es: [
        "Una disputa de honorarios con un abogado de Nueva York en un asunto civil.",
        "El abogado generalmente debe enviarle un aviso escrito de su derecho a arbitrar (22 NYCRR Parte 137).",
      ],
    },
    windows: {
      en: "Start soon after the dispute arises — and note the lawyer's Part 137 notice, which starts your 30-day window to choose arbitration.",
      es: "Inicie pronto después de que surja la disputa — y atienda el aviso de la Parte 137 del abogado, que abre 30 días para elegir el arbitraje.",
    },
    process: {
      en: "File with the approved fee-dispute program for the county (listed by the Unified Court System). A neutral arbitrator or conciliator reviews the bills, the agreement, and your response, then issues a decision.",
      es: "Presente ante el programa aprobado del condado (listado por el Sistema Unificado de Tribunales). Un árbitro o conciliador neutral revisa las facturas, el acuerdo y su respuesta, y emite una decisión.",
    },
    links: [
      { label: "NY Courts — Part 137 Fee Dispute Resolution Program", url: "https://www.nycourts.gov/courts/whmatters/feesdisputes/" },
    ],
    warnings: {
      en: [
        "Arbitration outcomes are generally binding — read the program's rules first.",
        "The $1,000–$50,000 range is firm unless both parties consent otherwise.",
      ],
      es: [
        "Los resultados del arbitraje suelen ser vinculantes — lea primero las reglas del programa.",
        "El rango de $1,000–$50,000 es firme salvo consentimiento de ambas partes.",
      ],
    },
    evidence: {
      en: ["The fee agreement or engagement letter.", "All invoices and your payment records.", "Your short chronology of the work you expected."],
      es: ["El acuerdo de honorarios o carta de compromiso.", "Todas las facturas y sus registros de pago.", "Su cronología breve del trabajo esperado."],
    },
  },
  malpractice: {
    kind: "malpractice",
    name: { en: "Legal malpractice claim (New York)", es: "Reclamo de mala praxis (Nueva York)" },
    tagline: {
      en: "A civil lawsuit is the channel that can recover money for a lawyer's negligent work. LexGuard only explains it — you would need your own lawyer.",
      es: "Una demanda civil es la vía que puede recuperar dinero por el trabajo negligente de un abogado. LexGuard solo lo explica — necesitaría su propio abogado.",
    },
    canDo: {
      en: ["Can compensate you for losses caused by a lawyer's negligent or wrongful professional work.", "A lawyer who takes the case works only for you."],
      es: ["Puede compensar pérdidas causadas por el trabajo negligente o ilícito de un abogado.", "Un abogado que tome el caso trabajaría solo para usted."],
    },
    cannotDo: {
      en: ["LexGuard cannot evaluate, file, or refer you to a specific malpractice lawyer.", "Not every mistake is malpractice — a lawyer must have failed the standard of care and caused a loss."],
      es: ["LexGuard no puede evaluar, presentar ni referirlo a un abogado específico de mala praxis.", "No todo error es mala praxis — el abogado debe haber incumplido el estándar de cuidado y causado una pérdida."],
    },
    prerequisites: {
      en: [
        "An attorney-client relationship, a failure to meet the standard of care, and a loss caused by it.",
        "New York generally applies a three-year limitations period for non-medical malpractice (CPLR 214) — exact deadlines depend on your facts.",
      ],
      es: [
        "Una relación abogado-cliente, un incumplimiento del estándar de cuidado y una pérdida causada por él.",
        "Nueva York generalmente aplica un plazo de tres años para mala praxis no médica (CPLR 214) — los plazos exactos dependen de sus hechos.",
      ],
    },
    windows: {
      en: "New York's general period for attorney malpractice is commonly three years (CPLR 214). Verify with a licensed New York attorney.",
      es: "El plazo general para mala praxis de abogados en Nueva York suele ser de tres años (CPLR 214). Verifíquelo con un abogado con licencia en Nueva York.",
    },
    process: {
      en: "Consult a licensed New York attorney (legal aid, a law-school clinic, or a bar referral service). Bring your journal export — organized dates and documents reduce consultation cost.",
      es: "Consulte a un abogado con licencia en Nueva York (asistencia legal, una clínica universitaria o un servicio de referidos). Lleve su diario exportado — fechas y documentos ordenados reducen el costo de la consulta.",
    },
    links: [
      { label: "LawHelpNY.org — free civil legal help", url: "https://www.lawhelpny.org" },
      { label: "NY Courts — Help Center for court users", url: "https://www.nycourts.gov/courthelp/" },
    ],
    warnings: {
      en: ["Deadlines are strict — ask about limitations periods in your first consultation.", "This is general information, not advice about your specific case."],
      es: ["Los plazos son estrictos — pregunte por los períodos de prescripción en su primera consulta.", "Esta es información general, no asesoría sobre su caso específico."],
    },
    evidence: {
      en: ["Your full journal export (timeline, money log, documents).", "Court records from the underlying case, if any.", "The fee agreement and all correspondence."],
      es: ["Su diario completo exportado (línea de tiempo, registro de dinero, documentos).", "Registros judiciales del caso original, si los hay.", "El acuerdo de honorarios y toda la correspondencia."],
    },
  },
};

export const CHANNELS_AZ: Record<ChannelKind, ChannelDef> = {
  discipline: {
    kind: "discipline",
    name: { en: "State Bar of Arizona charge of misconduct", es: "Carga de mala conducta ante el Colegio de Abogados de Arizona" },
    tagline: {
      en: "The formal system that can investigate and sanction an Arizona attorney.",
      es: "El sistema formal que puede investigar y sancionar a un abogado de Arizona.",
    },
    canDo: {
      en: [
        "Investigates allegations of professional misconduct (neglect, no communication, trust-account misuse, settling without authority, dishonesty).",
        "Can impose discipline: reprimand, suspension, or disbarment.",
        "Its Lawyer Regulation Office investigates; the Attorney/Consumer Assistance Program (ACAP) answers questions first.",
      ],
      es: [
        "Investiga alegatos de mala praxis profesional (negligencia, falta de comunicación, mal uso de cuentas de depósito, acuerdos sin autorización, deshonestidad).",
        "Puede imponer disciplina: reprensión, suspensión o exclusión de la profesión.",
        "Su Oficina de Regulación de Abogados investiga; el Programa de Asistencia al Consumidor (ACAP) responde preguntas primero.",
      ],
    },
    cannotDo: {
      en: [
        "Cannot order the lawyer to return your money or pay you damages.",
        "Cannot give you legal advice or represent you.",
        "Cannot overturn a court's decision in your case.",
      ],
      es: [
        "No puede ordenar al abogado que le devuelva su dinero ni pagarle una indemnización.",
        "No puede darle asesoría legal ni representarlo.",
        "No puede revocar la decisión de un tribunal en su caso.",
      ],
    },
    prerequisites: {
      en: [
        "The lawyer must be a State Bar of Arizona member.",
        "A description of what happened, with dates, names, and any documents you have.",
      ],
      es: [
        "El abogado debe ser miembro del State Bar of Arizona.",
        "Una descripción de lo ocurrido, con fechas, nombres y los documentos que tenga.",
      ],
    },
    windows: {
      en: "There is no fixed filing deadline, but report as soon as you can — evidence and memories fade, and delay can make investigation harder.",
      es: "No existe un plazo fijo para presentar, pero hágalo cuanto antes — la evidencia y la memoria se pierden, y la demora dificulta la investigación.",
    },
    process: {
      en: "Call the Attorney/Consumer Assistance Program at 602-340-7280 to discuss your situation first, then submit the online charge of misconduct (tools.azbar.org) or a written complaint. The Lawyer Regulation Office reviews every charge.",
      es: "Llame primero al Programa de Asistencia al Consumidor al 602-340-7280 para comentar su situación, luego presente la carga de mala conducta en línea (tools.azbar.org) o una queja escrita. La Oficina de Regulación revisa toda carga.",
    },
    links: [
      { label: "State Bar of Arizona — concerns about your legal professional", url: "https://www.azbar.org/for-the-public/concerns-about-your-legal-professional/" },
      { label: "State Bar of Arizona — member search", url: "https://www.azbar.org/for-the-public/find-a-lawyer/" },
    ],
    warnings: {
      en: [
        "A bar charge is not a lawsuit — it cannot get your money back.",
        "Keep copies of everything you send; send copies only, never originals.",
        "If your matter also involves stolen money, ask about the Client Protection Fund separately.",
      ],
      es: [
        "Una carga ante el colegio no es una demanda — no puede recuperar su dinero.",
        "Guarde copias de todo lo que envíe; envíe solo copias, nunca originales.",
        "Si su asunto también implica dinero robado, pregunte aparte por el Fondo de Protección del Cliente.",
      ],
    },
    evidence: {
      en: [
        "Your dated journal entries and timeline export.",
        "Copies of emails, texts, letters, and invoices.",
        "The fee agreement, if you have one.",
        "Receipts or bank records showing payments.",
      ],
      es: [
        "Sus registros fechados y la línea de tiempo exportada.",
        "Copias de correos, mensajes, cartas y facturas.",
        "El acuerdo de honorarios, si lo tiene.",
        "Recibos o estados de cuenta que muestren los pagos.",
      ],
    },
  },
  csf: {
    kind: "csf",
    name: { en: "Arizona Client Protection Fund", es: "Fondo de Protección del Cliente de Arizona" },
    tagline: {
      en: "A fund that can reimburse clients who lost money because of an Arizona lawyer's dishonest conduct.",
      es: "Un fondo que puede reembolsar a clientes que perdieron dinero por conducta deshonesta de un abogado de Arizona.",
    },
    canDo: {
      en: [
        "Reimburses losses caused by a lawyer's dishonest conduct (theft of entrusted money or property).",
        "Pays up to $100,000 per claimant (with an aggregate cap per lawyer).",
      ],
      es: [
        "Reembolsa pérdidas causadas por conducta deshonesta del abogado (robo de dinero o bienes en custodia).",
        "Paga hasta $100,000 por reclamante (con un tope acumulado por abogado).",
      ],
    },
    cannotDo: {
      en: [
        "Does not cover negligence, malpractice, or dissatisfaction with how the case was handled.",
        "Does not cover simple fee disagreements.",
        "Cannot sanction the lawyer — that is the discipline system's job.",
      ],
      es: [
        "No cubre negligencia, mala praxis ni insatisfacción con cómo se manejó el caso.",
        "No cubre simples desacuerdos sobre honorarios.",
        "No puede sancionar al abogado — eso corresponde al sistema disciplinario.",
      ],
    },
    prerequisites: {
      en: [
        "The loss must come from the lawyer's dishonest conduct.",
        "A claim must be filed within five years after you knew or should have known of the loss.",
        "Cooperation with the fund's review, and restitution rights may be assigned to the fund if it pays.",
      ],
      es: [
        "La pérdida debe provenir de la conducta deshonesta del abogado.",
        "El reclamo debe presentarse dentro de los cinco años desde que supo o debió suponer de la pérdida.",
        "Colaborar con la revisión del fondo, y los derechos de restitución pueden cederse al fondo si paga.",
      ],
    },
    windows: {
      en: "Claim within 5 years after you know, or should have known, about the loss.",
      es: "Presente el reclamo dentro de los 5 años desde que supo o debió suponer de la pérdida.",
    },
    process: {
      en: "Request the Client Protection Fund claim packet from the State Bar of Arizona, complete the affidavit, sign and date it, and attach your evidence. The Fund's trustees review claims and decide reimbursements.",
      es: "Solicite el paquete de reclamos al State Bar of Arizona, complete la declaración jurada, fírmela con fecha y adjunte su evidencia. Los administradores del Fondo revisan los reclamos y deciden los reembolsos.",
    },
    links: [
      { label: "State Bar of Arizona — Client Protection Fund", url: "https://www.azbar.org/for-the-public/bar-provided-services-for-consumers/client-protection-fund" },
    ],
    warnings: {
      en: [
        "The 5-year window runs from discovery, not from the loss itself — file early anyway.",
        "The fund requires dishonesty; ordinary mistakes are for malpractice claims, not this fund.",
        "If the fund pays you, the lawyer owes restitution to the fund.",
      ],
      es: [
        "La ventana de 5 años corre desde el descubrimiento, no desde la pérdida — presente pronto de todos modos.",
        "El fondo exige deshonestidad; los errores ordinarios corresponden a una demanda de mala praxis, no a este fondo.",
        "Si el fondo le paga, el abogado debe restituir al fondo.",
      ],
    },
    evidence: {
      en: [
        "Proof you paid the lawyer (receipts, checks, bank statements).",
        "Trust-account or settlement paperwork showing where your money went.",
        "Your money-log export from this journal.",
      ],
      es: [
        "Prueba de lo que pagó al abogado (recibos, cheques, estados de cuenta).",
        "Documentos de cuenta de depósito o del acuerdo que muestren a dónde fue su dinero.",
        "El registro de dinero exportado de este diario.",
      ],
    },
  },
  fee: {
    kind: "fee",
    name: { en: "Arizona Fee Arbitration Program", es: "Programa de Arbitraje de Honorarios de Arizona" },
    tagline: {
      en: "A free, voluntary program to resolve a fee disagreement of over $1,000 with your (former) Arizona lawyer.",
      es: "Un programa gratuito y voluntario para resolver un desacuerdo de honorarios mayor a $1,000 con su (ex) abogado de Arizona.",
    },
    canDo: {
      en: [
        "Resolves disputes over legal fees through arbitration instead of court.",
        "Free and voluntary — for disputes over $1,000 between a State Bar member and their client.",
        "Includes contingent-fee disputes.",
      ],
      es: [
        "Resuelve disputas sobre honorarios mediante arbitraje en lugar de un tribunal.",
        "Gratuito y voluntario — para disputas mayores a $1,000 entre un miembro del colegio y su cliente.",
        "Incluye disputas de honorarios contingentes.",
      ],
    },
    cannotDo: {
      en: [
        "Cannot discipline the lawyer or award money beyond the fee dispute.",
        "Does not decide malpractice questions.",
      ],
      es: [
        "No puede disciplinar al abogado ni otorgar dinero más allá de la disputa de honorarios.",
        "No decide cuestiones de mala praxis.",
      ],
    },
    prerequisites: {
      en: [
        "A fee dispute of more than $1,000 with an Arizona State Bar member.",
        "Both sides must agree to arbitrate (the program is voluntary).",
      ],
      es: [
        "Una disputa de honorarios mayor a $1,000 con un miembro del State Bar de Arizona.",
        "Ambas partes deben aceptar el arbitraje (el programa es voluntario).",
      ],
    },
    windows: {
      en: "Ask early — arbitration works best soon after the fee dispute arises.",
      es: "Pida pronto — el arbitraje funciona mejor poco después de que surja la disputa.",
    },
    process: {
      en: "File a request with the State Bar's Fee Arbitration Program; if both sides agree, a neutral arbitrator reviews the bills, the agreement, and your response, and issues a decision.",
      es: "Presente una solicitud ante el Programa de Arbitraje del colegio; si ambos aceptan, un árbitro neutral revisa las facturas, el acuerdo y su respuesta, y emite una decisión.",
    },
    links: [
      { label: "State Bar of Arizona — Fee Arbitration Program", url: "https://www.azbar.org/for-the-public/bar-provided-services-for-consumers/fee-arbitration" },
    ],
    warnings: {
      en: [
        "Arbitration is usually binding — read the program's rules before agreeing.",
        "If the disagreement involves suspected theft, not just an amount dispute, the Client Protection Fund may fit better.",
      ],
      es: [
        "El arbitraje suele ser vinculante — lea las reglas del programa antes de aceptar.",
        "Si el desacuerdo implica un posible robo y no solo un monto, el Fondo de Protección del Cliente puede ser más apropiado.",
      ],
    },
    evidence: {
      en: ["The fee agreement (written or oral terms you can show).", "All invoices and your payment records.", "A short chronology of what you were billed for."],
      es: ["El acuerdo de honorarios (escrito o los términos verbales que pueda mostrar).", "Todas las facturas y sus registros de pago.", "Una cronología breve de lo que le facturaron."],
    },
  },
  malpractice: {
    kind: "malpractice",
    name: { en: "Legal malpractice claim (Arizona)", es: "Reclamo de mala praxis (Arizona)" },
    tagline: {
      en: "A civil lawsuit is the channel that can recover money for a lawyer's negligent work. LexGuard only explains it — you would need your own lawyer.",
      es: "Una demanda civil es la vía que puede recuperar dinero por el trabajo negligente de un abogado. LexGuard solo lo explica — necesitaría su propio abogado.",
    },
    canDo: {
      en: ["Can compensate you for losses caused by a lawyer's negligent or wrongful professional work.", "A lawyer who takes the case works only for you."],
      es: ["Puede compensar pérdidas causadas por el trabajo negligente o ilícito de un abogado.", "Un abogado que tome el caso trabajaría solo para usted."],
    },
    cannotDo: {
      en: ["LexGuard cannot evaluate, file, or refer you to a specific malpractice lawyer.", "Not every mistake is malpractice — a lawyer must have failed the standard of care and caused a loss."],
      es: ["LexGuard no puede evaluar, presentar ni referirlo a un abogado específico de mala praxis.", "No todo error es mala praxis — el abogado debe haber incumplido el estándar de cuidado y causado una pérdida."],
    },
    prerequisites: {
      en: [
        "An attorney-client relationship, a failure to meet the standard of care, and a loss caused by it.",
        "Arizona generally applies a two-year limitations period for attorney malpractice (A.R.S. 12-542) — exact deadlines depend on your facts.",
      ],
      es: [
        "Una relación abogado-cliente, un incumplimiento del estándar de cuidado y una pérdida causada por él.",
        "Arizona generalmente aplica un plazo de dos años para mala praxis de abogados (A.R.S. 12-542) — los plazos exactos dependen de sus hechos.",
      ],
    },
    windows: {
      en: "Arizona's general malpractice period is commonly two years (A.R.S. 12-542). Verify with a licensed Arizona attorney.",
      es: "El plazo general de mala praxis en Arizona suele ser de dos años (A.R.S. 12-542). Verifíquelo con un abogado con licencia en Arizona.",
    },
    process: {
      en: "Consult a licensed Arizona attorney (legal aid, a law-school clinic, or the State Bar's lawyer referral service). Bring your journal export — organized dates and documents reduce consultation cost.",
      es: "Consulte a un abogado con licencia en Arizona (asistencia legal, una clínica universitaria o el servicio de referidos del colegio). Lleve su diario exportado — fechas y documentos ordenados reducen el costo de la consulta.",
    },
    links: [
      { label: "AZLawHelp.org — free civil legal help", url: "https://www.azlawhelp.org" },
      { label: "Community Legal Services of Arizona", url: "https://www.clsaz.org" },
    ],
    warnings: {
      en: ["Deadlines are strict — ask about limitations periods in your first consultation.", "This is general information, not advice about your specific case."],
      es: ["Los plazos son estrictos — pregunte por los períodos de prescripción en su primera consulta.", "Esta es información general, no asesoría sobre su caso específico."],
    },
    evidence: {
      en: ["Your full journal export (timeline, money log, documents).", "Court records from the underlying case, if any.", "The fee agreement and all correspondence."],
      es: ["Su diario completo exportado (línea de tiempo, registro de dinero, documentos).", "Registros judiciales del caso original, si los hay.", "El acuerdo de honorarios y toda la correspondencia."],
    },
  },
};

export const CHANNELS_EXPANSION: Record<"FL" | "NY" | "AZ", Record<ChannelKind, ChannelDef>> = {
  FL: CHANNELS_FL,
  NY: CHANNELS_NY,
  AZ: CHANNELS_AZ,
};
