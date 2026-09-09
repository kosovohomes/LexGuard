// LexGuard Remedy Router — PRD §6.4 (Flow D) / FR-4 / Appendix A
// Decision logic maps the user's answers (and optional case observations) to
// remedy channels. EDUCATION FIRST (PRD §3.3): every channel states what it
// can and cannot do before routing. All facts from PRD Appendix A.

import type { ChannelKind, Locale, USState } from "./types";

export interface ChannelDef {
  kind: ChannelKind;
  name: { en: string; es: string };
  tagline: { en: string; es: string };
  canDo: { en: string[]; es: string[] };
  cannotDo: { en: string[]; es: string[] };
  prerequisites: { en: string[]; es: string[] };
  windows: { en: string; es: string };
  process: { en: string; es: string };
  links: { label: string; url: string }[];
  warnings: { en: string[]; es: string[] };
  evidence: { en: string[]; es: string[] };
  // optional county/region programs (PRD Appendix A: CA fee arbitration must
  // "list major programs per region") — plain-language list, verify before use
  regions?: { en: string[]; es: string[] };
}

export const CHANNELS: Record<USState, Record<ChannelKind, ChannelDef>> = {
  TX: {
    discipline: {
      kind: "discipline",
      name: { en: "State Bar Discipline Complaint (Chief Disciplinary Counsel)", es: "Queja disciplinaria ante el Colegio de Abogados (Chief Disciplinary Counsel)" },
      tagline: {
        en: "The formal system that can investigate and sanction a Texas attorney.",
        es: "El sistema formal que puede investigar y sancionar a un abogado de Texas.",
      },
      canDo: {
        en: [
          "Investigates allegations of professional misconduct (neglect, no communication, trust-account misuse, settling without authority, dishonesty).",
          "Can impose sanctions ranging from a private reprimand to disbarment.",
          "Free to file; you do not need a lawyer.",
        ],
        es: [
          "Investiga alegatos de mala conducta profesional (negligencia, falta de comunicación, mal uso de fondos, acuerdos sin autorización, deshonestidad).",
          "Puede imponer sanciones desde una reprensión privada hasta la expulsión (disbarment).",
          "Es gratis presentarla; no necesita abogado.",
        ],
      },
      cannotDo: {
        en: [
          "Cannot order the lawyer to pay your money back (that is what the Client Security Fund or a court is for).",
          "Cannot fix your underlying legal case or change its outcome.",
          "Cannot give you legal advice about your matter.",
        ],
        es: [
          "No puede ordenar que el abogado le devuelva su dinero (para eso están el Fondo de Seguridad del Cliente o los tribunales).",
          "No puede arreglar su caso legal de fondo ni cambiar su resultado.",
          "No puede darle asesoría legal sobre su asunto.",
        ],
      },
      prerequisites: {
        en: [
          "The lawyer's full name (and firm, if known).",
          "A factual description of what happened, with dates.",
          "Copies (never originals) of supporting documents — no staples.",
        ],
        es: [
          "El nombre completo del abogado (y la firma, si la conoce).",
          "Una descripción factual de lo ocurrido, con fechas.",
          "Copias (nunca originales) de documentos de apoyo — sin engrapadores.",
        ],
      },
      windows: {
        en: "No fixed statute of limitations for grievances, but file as soon as possible while evidence and memories are fresh.",
        es: "No hay un plazo fijo de prescripción para quejas, pero preséntelas lo antes posible mientras la evidencia y los recuerdos estén frescos.",
      },
      process: {
        en: "File online at cdc.texasbar.com or by mail/fax to the Chief Disciplinary Counsel's Office in Austin (phone: 866-224-5999). An intake attorney classifies the complaint; classified complaints go through investigation and, if warranted, the district grievance committees. Realistic timelines: months, sometimes a year or more.",
        es: "Preséntela en línea en cdc.texasbar.com o por correo/fax a la oficina del Chief Disciplinary Counsel en Austin (teléfono: 866-224-5999). Un abogado de admisión clasifica la queja; las quejas clasificadas pasan a investigación y, si procede, a los comités distritales. Plazos realistas: meses, a veces un año o más.",
      },
      links: [
        { label: "File a grievance (cdc.texasbar.com)", url: "https://cdc.texasbar.com/" },
        { label: "State Bar of Texas — Complaint Info (TexasLawHelp)", url: "https://texaslawhelp.org/article/attorney-complaint-information" },
      ],
      warnings: {
        en: [
          "IMPORTANT — PRIVACY TRADE-OFF: signing a Texas grievance form waives attorney-client privilege for the subject matter of the complaint. Anything you discussed with this lawyer about this matter may become part of the process. Decide with that in mind.",
          "A dismissed grievance can still be referred to CAAP (mediation) — dismissal is not the end of the road for a fee or communication dispute.",
        ],
        es: [
          "IMPORTANTE — INTERCAMBIO DE PRIVACIDAD: firmar el formulario de queja de Texas renuncia al privilegio abogado-cliente sobre el tema de la queja. Todo lo que habló con este abogado sobre este asunto puede volverse parte del proceso. Decida con eso en mente.",
          "Una queja desestimada puede referirse a CAAP (mediación); la desestimación no es el final para una disputa de honorarios o comunicación.",
        ],
      },
      evidence: {
        en: ["Your case journal timeline", "Signed fee agreement", "Payment records", "Emails/texts (dated)", "Court notices"],
        es: ["Su cronología del caso", "Acuerdo de honorarios firmado", "Registros de pago", "Correos/mensajes (con fecha)", "Notificaciones del tribunal"],
      },
    },
    csf: {
      kind: "csf",
      name: { en: "Texas Client Security Fund", es: "Fondo de Seguridad del Cliente de Texas" },
      tagline: {
        en: "A fund that can reimburse clients whose lawyer stole money or kept unearned fees.",
        es: "Un fondo que puede reembolsar a clientes cuyo abogado robó dinero o retuvo honorarios no devengados.",
      },
      canDo: {
        en: [
          "Reimburses losses from theft of client funds or failure to refund fees when no services were performed.",
          "Fund corpus exceeds $3M; reimbursement is discretionary per claim.",
        ],
        es: [
          "Reembolsa pérdidas por robo de fondos del cliente o por no reembolsar honorarios cuando no se realizaron servicios.",
          "El fondo supera los $3M; el reembolso es discrecional por caso.",
        ],
      },
      cannotDo: {
        en: [
          "Does NOT cover malpractice or negligence losses.",
          "Does NOT cover fee disputes (disagreement about how much was charged).",
          "Does NOT cover dissatisfaction with outcomes.",
          "Requires subrogation/assignment: if paid, you assign your rights against the lawyer to the Fund.",
        ],
        es: [
          "NO cubre pérdidas por mala praxis o negligencia.",
          "NO cubre disputas de honorarios (desacuerdo sobre cuánto se cobró).",
          "NO cubre insatisfacción con resultados.",
          "Requiere subrogación/cesión: si le pagan, cede sus derechos contra el abogado al Fondo.",
        ],
      },
      prerequisites: {
        en: [
          "You must first file a grievance with the State Bar — the Fund generally pays only after disciplinary findings that the lawyer stole money or failed to refund an unearned fee.",
          "EXCEPTION: no grievance finding is needed if the lawyer is already disbarred, resigned in lieu of discipline, deceased, or on indefinite disability suspension.",
        ],
        es: [
          "Primero debe presentar una queja ante el Colegio de Abogados; el Fondo generalmente paga solo tras hallazgos disciplinarios de robo o no reembolso de honorarios.",
          "EXCEPCIÓN: no se necesita hallazgo si el abogado ya está expulsado, renunció en lugar de disciplina, falleció o está en suspensión indefinida por discapacidad.",
        ],
      },
      windows: {
        en: "Application must be filed within 18 months after the disciplinary judgment becomes final. Missing this window is the most common reason victims lose eligibility.",
        es: "La solicitud debe presentarse dentro de los 18 meses posteriores a que la sentencia disciplinaria sea firme. Perder este plazo es la razón más común de inelegibilidad.",
      },
      process: {
        en: "Apply through the State Bar of Texas Client Security Fund program (sbotservices.texasbar.com/csf). The Fund reviews the application against disciplinary findings; payment is discretionary. Contact the State Bar for the current application form.",
        es: "Aplique a través del programa Client Security Fund del State Bar of Texas (sbotservices.texasbar.com/csf). El Fondo revisa la solicitud frente a los hallazgos disciplinarios; el pago es discrecional. Contacte al Colegio para el formulario vigente.",
      },
      links: [
        { label: "Texas Client Security Fund", url: "https://www.texasbar.com/content/dam/texasbar/landing-pages/csf/" },
      ],
      warnings: {
        en: ["If your grievance is still open, start preparing your CSF application now — the 18-month clock can run faster than expected after judgment."],
        es: ["Si su queja sigue abierta, prepare ya su solicitud al Fondo: el reloj de 18 meses corre rápido tras la sentencia."],
      },
      evidence: {
        en: ["Proof of payment to the lawyer", "Grievance or disciplinary case number", "Bank records showing the loss", "Any promissory notes or written promises"],
        es: ["Prueba de pago al abogado", "Número de queja o caso disciplinario", "Registros bancarios de la pérdida", "Pagarés o promesas escritas"],
      },
    },
    fee: {
      kind: "fee",
      name: { en: "CAAP — Client-Attorney Assistance Program (mediation)", es: "CAAP — Programa de Asistencia Cliente-Abogado (mediación)" },
      tagline: {
        en: "Free, voluntary mediation for fee and communication disputes with Texas lawyers.",
        es: "Mediación voluntaria y gratuita para disputas de honorarios y comunicación con abogados de Texas.",
      },
      canDo: {
        en: [
          "Mediates fee disputes, billing disagreements, and some communication breakdowns.",
          "A trained neutral helps both sides reach a voluntary agreement.",
        ],
        es: [
          "Media disputas de honorarios, desacuerdos de cobro y algunos problemas de comunicación.",
          "Un mediador neutral ayuda a ambas partes a llegar a un acuerdo voluntario.",
        ],
      },
      cannotDo: {
        en: [
          "Is voluntary — the lawyer must also agree to participate.",
          "Is not a court; it cannot force repayment.",
          "Is not discipline — it cannot sanction the lawyer.",
        ],
        es: [
          "Es voluntaria: el abogado también debe aceptar participar.",
          "No es un tribunal; no puede obligar a pagar.",
          "No es disciplina; no puede sancionar al abogado.",
        ],
      },
      prerequisites: {
        en: ["Copies of the fee agreement, invoices, and payment records.", "A short written summary of the dispute."],
        es: ["Copias del acuerdo de honorarios, facturas y registros de pago.", "Un resumen breve por escrito de la disputa."],
      },
      windows: {
        en: "No strict filing deadline; earlier is easier while records are fresh. CAAP referral commonly happens when a grievance is dismissed at any stage, but you may contact CAAP about fee disputes directly.",
        es: "No hay plazo estricto; antes es más fácil mientras los registros están frescos. La referencia a CAAP suele ocurrir cuando una queja se desestima, pero puede contactar a CAAP directamente por disputas de honorarios.",
      },
      process: {
        en: "Contact the State Bar of Texas CAAP (800-932-1907) and ask about mediation for a fee or communication dispute.",
        es: "Contacte el CAAP del State Bar of Texas (800-932-1907) y pregunte por la mediación para una disputa de honorarios o comunicación.",
      },
      links: [
        { label: "State Bar of Texas — CAAP", url: "https://www.texasbar.com/CAAP" },
      ],
      warnings: { en: [], es: [] },
      evidence: {
        en: ["Fee agreement", "All invoices", "Payment receipts", "Your journal notes of what was promised vs. delivered"],
        es: ["Acuerdo de honorarios", "Todas las facturas", "Recibos de pago", "Notas de lo prometido vs. lo entregado"],
      },
    },
    malpractice: {
      kind: "malpractice",
      name: { en: "Malpractice (civil claim) — information & referral", es: "Mala praxis (demanda civil) — información y referencia" },
      tagline: {
        en: "A separate civil lawsuit for damages caused by a lawyer's professional negligence.",
        es: "Una demanda civil separada por daños causados por negligencia profesional de un abogado.",
      },
      canDo: {
        en: ["Can compensate you for damages caused by negligent legal work, if proven in court."],
        es: ["Puede compensar daños causados por trabajo legal negligente, si se prueba en el tribunal."],
      },
      cannotDo: {
        en: [
          "Is not handled by the State Bar or the Client Security Fund.",
          "Is complex and usually requires a licensed attorney to evaluate merit.",
          "LexGuard cannot advise you whether you have a case — that is legal advice.",
        ],
        es: [
          "No lo maneja el Colegio de Abogados ni el Fondo de Seguridad del Cliente.",
          "Es complejo y generalmente requiere un abogado con licencia que evalúe el mérito.",
          "LexGuard no puede aconsejarle si tiene un caso: eso es asesoría legal.",
        ],
      },
      prerequisites: {
        en: ["Proof of an attorney-client relationship", "Evidence the lawyer's work fell below acceptable standards", "Evidence of harm caused by that work"],
        es: ["Prueba de la relación abogado-cliente", "Evidencia de que el trabajo cayó bajo los estándares aceptables", "Evidencia del daño causado"],
      },
      windows: {
        en: "LIMITS ARE STRICT: Texas generally applies a 2-year limitations period (with a 10-year repose cap). Verify your exact deadline with a licensed attorney or legal aid as soon as possible.",
        es: "PLAZOS ESTRICTOS: Texas generalmente aplica un plazo de 2 años (con tope de 10 años). Verifique su fecha exacta con un abogado con licencia o asistencia legal lo antes posible.",
      },
      process: {
        en: "Use the referral directory: legal aid programs, the State Bar lawyer referral service, or a law-school clinic can evaluate your situation. Bring your dossier.",
        es: "Use el directorio de referencias: programas de asistencia legal, el servicio de referencia del Colegio o una clínica universitaria pueden evaluar su situación. Lleve su expediente.",
      },
      links: [
        { label: "TexasLawHelp.org", url: "https://texaslawhelp.org" },
      ],
      warnings: { en: [], es: [] },
      evidence: {
        en: ["Complete dossier (timeline + money trail + documents)", "Court records", "All communications"],
        es: ["Expediente completo (cronología + rastro de dinero + documentos)", "Registros del tribunal", "Todas las comunicaciones"],
      },
    },
  },
  CA: {
    discipline: {
      kind: "discipline",
      name: { en: "State Bar of California Complaint", es: "Queja ante el Colegio de Abogados de California" },
      tagline: {
        en: "The Office of Chief Trial Counsel / Intake Unit investigates attorney misconduct.",
        es: "La Office of Chief Trial Counsel / Intake Unit investiga mala conducta de abogados.",
      },
      canDo: {
        en: [
          "Investigates misconduct: abandoned clients, missed deadlines, trust-account violations (Rule 4-100), settling without authority, dishonesty.",
          "Can impose discipline from reproval to disbarment.",
          "Complaint form is available in English, Spanish, Vietnamese, Korean, Russian, Chinese, and Tagalog.",
        ],
        es: [
          "Investiga mala conducta: abandono, fechas vencidas, violaciones de cuentas de depósito (Regla 4-100), acuerdos sin autorización, deshonestidad.",
          "Puede imponer disciplina desde reprensión hasta expulsión.",
          "El formulario está disponible en inglés, español, vietnamita, coreano, ruso, chino y tagalo.",
        ],
      },
      cannotDo: {
        en: [
          "Cannot order the lawyer to pay your money back (see the Client Security Fund).",
          "Cannot undo what happened in your underlying case.",
          "Cannot advise you about your legal strategy.",
        ],
        es: [
          "No puede ordenar al abogado devolverle su dinero (vea el Fondo de Seguridad del Cliente).",
          "No puede deshacer lo ocurrido en su caso de fondo.",
          "No puede asesorarle sobre su estrategia legal.",
        ],
      },
      prerequisites: {
        en: ["Attorney's name (and bar number if known)", "Description of what happened with dates", "Copies of supporting documents"],
        es: ["Nombre del abogado (y número de colegiado si lo conoce)", "Descripción de lo ocurrido con fechas", "Copias de documentos de apoyo"],
      },
      windows: {
        en: "No fixed statute of limitations, but file promptly — delay weakens investigations.",
        es: "No hay plazo fijo de prescripción, pero preséntela pronto; la demora debilita las investigaciones.",
      },
      process: {
        en: "File online through the State Bar's complaint form or by phone with the Intake Unit (213-765-1200 / 800-843-9053). Intake screens complaints; those with evidence of misconduct proceed to investigation. Realistic timelines: many months.",
        es: "Preséntela en línea con el formulario del Colegio o por teléfono con la Intake Unit (213-765-1200 / 800-843-9053). La admisión filtra las quejas; las que tienen evidencia de mala conducta pasan a investigación. Plazos realistas: muchos meses.",
      },
      links: [
        { label: "File a complaint (calbar.ca.gov)", url: "https://www.calbar.ca.gov/Access-Justice/Consumer-Assistance/How-to-File-a-Complaint" },
      ],
      warnings: {
        en: ["Complaints are generally confidential during investigation; describing facts neutrally and precisely improves how they are handled."],
        es: ["Las quejas generalmente son confidenciales durante la investigación; describir los hechos de forma neutral y precisa mejora su manejo."],
      },
      evidence: {
        en: ["Your case journal timeline", "Fee agreement", "Payment and trust records", "Emails/texts", "Court notices"],
        es: ["Su cronología del caso", "Acuerdo de honorarios", "Registros de pago y de cuenta de depósito", "Correos/mensajes", "Notificaciones del tribunal"],
      },
    },
    csf: {
      kind: "csf",
      name: { en: "California Client Security Fund", es: "Fondo de Seguridad del Cliente de California" },
      tagline: {
        en: "Reimburses up to $100,000 per claim for money stolen by a California lawyer.",
        es: "Reembolsa hasta $100,000 por caso por dinero robado por un abogado de California.",
      },
      canDo: {
        en: [
          "Covers theft of entrusted funds (e.g., personal-injury settlements kept by the lawyer).",
          "Covers failure to refund fees when the lawyer performed no services.",
          "Covers lawyer borrowing without intent/ability to repay, and investment-related dishonesty.",
          "Maximum $100,000 per claim for losses on/after Jan 1, 2009 ($50,000 for earlier losses).",
        ],
        es: [
          "Cubre robo de fondos confiados (p. ej., acuerdos de lesiones personales retenidos por el abogado).",
          "Cubre no reembolso de honorarios cuando el abogado no realizó servicios.",
          "Cubre préstamos del abogado sin intención o capacidad de pagar, y deshonestidad en inversiones.",
          "Máximo $100,000 por caso para pérdidas desde el 1 de enero de 2009 ($50,000 para pérdidas anteriores).",
        ],
      },
      cannotDo: {
        en: [
          "Excludes negligence, malpractice, or incompetence losses.",
          "Excludes interest and consequential damages.",
          "Excludes unproven transfers.",
          "Filing does NOT pause (toll) statutes of limitation for other claims.",
        ],
        es: [
          "Excluye pérdidas por negligencia, mala praxis o incompetencia.",
          "Excluye intereses y daños consecuentes.",
          "Excluye transferencias no probadas.",
          "Presentar NO pausa los plazos de prescripción de otras demandas.",
        ],
      },
      prerequisites: {
        en: [
          "Attorney status condition: the lawyer must be disbarred, disciplined, resigned, deceased, adjudicated incompetent, a judgment debtor, or convicted — the Fund may grant waivers, so ask.",
          "Proof of the money loss (receipts, agreements, bank records).",
        ],
        es: [
          "Condición de estado del abogado: debe estar expulsado, disciplinado, haber renunciado, fallecido, declarado incompetente, ser deudor de sentencia o condenado; el Fondo puede otorgar excepciones, pregunte.",
          "Prueba de la pérdida de dinero (recibos, acuerdos, registros bancarios).",
        ],
      },
      windows: {
        en: "File within 4 years after the loss was (or should have been) discovered.",
        es: "Presente dentro de los 4 años desde que la pérdida fue (o debió ser) descubierta.",
      },
      process: {
        en: "Apply to the Client Security Fund (845 South Figueroa St., Los Angeles, CA 90017; 213-765-1140). Process: Tentative Decision → 30-day objection window → Final Decision; checks arrive ~4–6 weeks after the final decision. Superior-court review is available within 90 days of the final decision.",
        es: "Aplique al Client Security Fund (845 South Figueroa St., Los Ángeles, CA 90017; 213-765-1140). Proceso: Decisión Tentativa → 30 días de objeciones → Decisión Final; los cheques llegan ~4–6 semanas después. Revisión por el tribunal superior dentro de 90 días tras la decisión final.",
      },
      links: [
        { label: "Apply for reimbursement (calbar.ca.gov)", url: "https://www.calbar.ca.gov/Public/File-a-Complaint-and-Other-Options/Client-Security-Fund" },
      ],
      warnings: {
        en: ["The 4-year discovery window is strict — mark it in your calendar and file early.", "Do not wait for the discipline case to finish before asking the Fund about eligibility."],
        es: ["La ventana de 4 años desde el descubrimiento es estricta: márquela en su calendario y presente temprano.", "No espere a que termine el caso disciplinario para preguntar al Fondo sobre elegibilidad."],
      },
      evidence: {
        en: ["Proof of payments to the lawyer", "Settlement statements", "Bank records", "Communication with the lawyer about your money"],
        es: ["Pruebas de pagos al abogado", "Estados de cuenta del acuerdo", "Registros bancarios", "Comunicación con el abogado sobre su dinero"],
      },
    },
    fee: {
      kind: "fee",
      name: { en: "Mandatory Fee Arbitration (local bar associations)", es: "Arbitraje obligatorio de honorarios (colegios locales de abogados)" },
      tagline: {
        en: "A low-cost arbitration program for fee disputes with California lawyers.",
        es: "Un programa de arbitraje de bajo costo para disputas de honorarios con abogados de California.",
      },
      canDo: {
        en: [
          "Resolves disputes about fees and costs charged by attorneys (Bus. & Prof. Code 6200-6206).",
          "Run by local bar associations (e.g., LA County Bar, SF Bar) — often free or low-cost.",
          "If the lawyer sues you for fees, arbitration is generally your right before litigation proceeds.",
        ],
        es: [
          "Resuelve disputas sobre honorarios y costos cobrados por abogados (Cód. Negocios y Profesiones 6200-6206).",
          "Lo administran colegios locales (p. ej., LA County Bar, SF Bar), a menudo gratis o de bajo costo.",
          "Si el abogado le demanda por honorarios, el arbitraje generalmente es su derecho antes de continuar el litigio.",
        ],
      },
      cannotDo: {
        en: [
          "Cannot sanction the lawyer (it is not discipline).",
          "Cannot recover money stolen (that is the Client Security Fund's lane).",
          "Determinations may become binding if you accept them.",
        ],
        es: [
          "No puede sancionar al abogado (no es disciplina).",
          "No puede recuperar dinero robado (eso es del Fondo de Seguridad del Cliente).",
          "Las determinaciones pueden volverse vinculantes si usted las acepta.",
        ],
      },
      prerequisites: {
        en: ["Fee agreement and invoices", "Payment records", "A completed arbitration application with the local bar program"],
        es: ["Acuerdo de honorarios y facturas", "Registros de pago", "Solicitud de arbitraje completada ante el programa local"],
      },
      windows: {
        en: "No single statutory deadline to request arbitration, but do not delay — especially if the lawyer has filed suit (deadlines in that suit apply).",
        es: "No hay un plazo legal único para pedir arbitraje, pero no se demore, especialmente si el abogado ya demandó (aplican los plazos de esa demanda).",
      },
      process: {
        en: "Contact the local bar association's fee arbitration program in your county, file the application, and attend the hearing with your documents. Bring your dossier and money log.",
        es: "Contacte el programa de arbitraje de honorarios del colegio local de su condado, presente la solicitud y asista a la audiencia con sus documentos. Lleve su expediente y registro de dinero.",
      },
      links: [
        { label: "State Bar — fee arbitration info", url: "https://www.calbar.ca.gov/Access-Justice/State-Bar-Court-and-Discipline/Mandatory-Fee-Arbitration" },
      ],
      // Major programs per region (PRD Appendix A, CA) — neutral listing;
      // confirm current contact info and fees with each program before filing.
      regions: {
        en: [
          "Los Angeles County: Los Angeles County Bar Association Attorney-Client Fee Dispute Arbitration (lacba.org).",
          "San Francisco: The Bar Association of San Francisco Fee Arbitration Program (sfbar.org).",
          "San Diego County: San Diego County Bar Association fee arbitration (sdcba.org).",
          "Orange County: Orange County Bar Association fee arbitration (ocbar.org).",
          "Sacramento County: Sacramento County Bar Association fee arbitration (sacbar.org).",
          "Alameda County: Alameda County Bar Association fee arbitration (acbar.org).",
          "Santa Clara County: Santa Clara County Bar Association fee arbitration (sccba.com).",
          "Fresno County: Fresno County Bar Association fee arbitration (fresnocountybar.org).",
          "Other counties: the State Bar of California runs a fee arbitration program where no local bar program exists.",
        ],
        es: [
          "Condado de Los Ángeles: arbitraje de disputas abogado-cliente de la Asociación de Abogados del Condado de LA (lacba.org).",
          "San Francisco: programa de arbitraje de honorarios de la Asociación de Abogados de San Francisco (sfbar.org).",
          "Condado de San Diego: arbitraje de honorarios de la Asociación de Abogados del Condado de San Diego (sdcba.org).",
          "Condado de Orange: arbitraje de honorarios de la Asociación de Abogados del Condado de Orange (ocbar.org).",
          "Condado de Sacramento: arbitraje de honorarios de la Asociación de Abogados del Condado de Sacramento (sacbar.org).",
          "Condado de Alameda: arbitraje de honorarios de la Asociación de Abogados del Condado de Alameda (acbar.org).",
          "Condado de Santa Clara: arbitraje de honorarios de la Asociación de Abogados del Condado de Santa Clara (sccba.com).",
          "Condado de Fresno: arbitraje de honorarios de la Asociación de Abogados del Condado de Fresno (fresnocountybar.org).",
          "Otros condados: el Colegio de Abogados de California administra el arbitraje donde no existe un programa local.",
        ],
      },
      warnings: { en: [], es: [] },
      evidence: {
        en: ["Signed fee agreement", "Invoices with line items", "All payment records", "Communications about fees"],
        es: ["Acuerdo de honorarios firmado", "Facturas con detalles", "Todos los registros de pago", "Comunicaciones sobre honorarios"],
      },
    },
    malpractice: {
      kind: "malpractice",
      name: { en: "Malpractice (civil claim) — information & referral", es: "Mala praxis (demanda civil) — información y referencia" },
      tagline: {
        en: "A separate civil lawsuit for damages caused by a lawyer's professional negligence.",
        es: "Una demanda civil separada por daños causados por negligencia profesional de un abogado.",
      },
      canDo: {
        en: ["Can compensate you for damages caused by negligent legal work, if proven in court."],
        es: ["Puede compensar daños causados por trabajo legal negligente, si se prueba en el tribunal."],
      },
      cannotDo: {
        en: [
          "Is NOT covered by the Client Security Fund (malpractice losses are excluded).",
          "Is complex and usually requires a licensed attorney to evaluate merit.",
          "LexGuard cannot advise you whether you have a case — that is legal advice.",
        ],
        es: [
          "NO lo cubre el Fondo de Seguridad del Cliente (las pérdidas por mala praxis están excluidas).",
          "Es complejo y generalmente requiere un abogado con licencia que evalúe el mérito.",
          "LexGuard no puede aconsejarle si tiene un caso: eso es asesoría legal.",
        ],
      },
      prerequisites: {
        en: ["Proof of an attorney-client relationship", "Evidence the lawyer's work fell below acceptable standards", "Evidence of harm caused by that work"],
        es: ["Prueba de la relación abogado-cliente", "Evidencia de trabajo por debajo de los estándares aceptables", "Evidencia del daño causado"],
      },
      windows: {
        en: "LIMITS ARE STRICT: California generally applies 1 year from discovery (with a 4-year maximum). Verify your exact deadline with a licensed attorney or legal aid immediately.",
        es: "PLAZOS ESTRICTOS: California generalmente aplica 1 año desde el descubrimiento (con máximo de 4 años). Verifique su fecha exacta con un abogado o asistencia legal de inmediato.",
      },
      process: {
        en: "Use the referral directory: legal aid programs, the State Bar lawyer referral service, or a law-school clinic can evaluate your situation. Bring your dossier.",
        es: "Use el directorio de referencias: programas de asistencia legal, el servicio de referencia del Colegio o una clínica universitaria pueden evaluar su situación. Lleve su expediente.",
      },
      links: [
        { label: "State Bar — lawyer referral", url: "https://www.calbar.ca.gov/Public/Need-Lawyer-Help/Lawyer-Referral-Service" },
      ],
      warnings: { en: [], es: [] },
      evidence: {
        en: ["Complete dossier (timeline + money trail + documents)", "Court records", "All communications"],
        es: ["Expediente completo (cronología + rastro de dinero + documentos)", "Registros del tribunal", "Todas las comunicaciones"],
      },
    },
  },
};

// ---- Router questionnaire (Flow D) ----

export interface RouterAnswers {
  harm: string[]; // money_stolen | unearned_fee | fee_dispute | abandonment | missed_deadline | settled_without_permission | file_not_returned | dishonesty
  moneyInvolved: "none" | "fees" | "settlement";
  lawyerStatus: "unknown" | "disciplined" | "no";
  discoveredWhen: "within_4y" | "over_4y" | "n/a";
  grievanceFiled: "no" | "yes" | "n/a";
  goal: "money_back" | "discipline" | "resolve_fees" | "protect_case";
}

export interface Recommendation {
  kind: ChannelKind;
  fit: "recommended" | "possible" | "not_now";
  reasons: { en: string[]; es: string[] };
}

const MISCONDUCT_HARMS = ["abandonment", "missed_deadline", "settled_without_permission", "dishonesty", "file_not_returned"];

export function route(state: USState, a: RouterAnswers): Recommendation[] {
  const rec: Recommendation[] = [];
  const en = (s: string) => ({ en: [s], es: [] }); // helper placeholders replaced below

  void en;
  const moneyHarm = a.harm.includes("money_stolen") || a.harm.includes("unearned_fee");
  const csn = CHANNELS[state].csf;

  // Discipline fit
  const disciplineFit: Recommendation = {
    kind: "discipline",
    fit: a.harm.some((h) => MISCONDUCT_HARMS.includes(h)) || moneyHarm ? "recommended" : a.harm.includes("fee_dispute") ? "possible" : "possible",
    reasons: {
      en: [],
      es: [],
    },
  };
  if (moneyHarm) disciplineFit.reasons.en.push("The facts you describe involve money that belonged to you — trust-account misuse is a core discipline concern.");
  if (a.harm.some((h) => MISCONDUCT_HARMS.includes(h))) disciplineFit.reasons.en.push("Neglect, abandonment, unauthorized settlement, dishonesty, and file-withholding are conduct the disciplinary system accepts complaints about.");
  if (a.harm.includes("fee_dispute") && a.harm.length === 1) disciplineFit.reasons.en.push("Pure fee disagreements are usually better handled by the fee channel first, but repeated overbilling can also be raised in discipline.");
  rec.push(disciplineFit);

  // CSF fit — state-specific gate (Appendix A)
  if (state === "TX") {
    if (moneyHarm) {
      if (a.grievanceFiled === "yes" && a.lawyerStatus !== "no" && a.discoveredWhen !== "over_4y") {
        rec.push({ kind: "csf", fit: "recommended", reasons: { en: ["You have filed (or will file) a grievance — the Texas Fund generally pays only after disciplinary findings of theft or failure to refund unearned fees. Watch the 18-month window after the judgment becomes final."], es: [] } });
      } else if (a.lawyerStatus === "disciplined") {
        rec.push({ kind: "csf", fit: "recommended", reasons: { en: ["The lawyer already has disciplinary status (disbarred/resigned/deceased/indefinite suspension) — you may apply to the Fund without a new grievance finding. File within 18 months after the judgment was final."], es: [] } });
      } else {
        rec.push({ kind: "csf", fit: "possible", reasons: { en: ["Not yet: the Texas Fund requires a grievance first (unless the lawyer is disbarred, resigned, deceased, or indefinitely suspended). File the discipline complaint now; then prepare the Fund application — 18 months after final judgment is the deadline."], es: [] } });
      }
    } else {
      rec.push({ kind: "csf", fit: "not_now", reasons: { en: ["The Texas Fund covers stolen money and unearned fees only — it does not address malpractice, fee-amount disputes, or dissatisfaction with outcomes."], es: [] } });
    }
  } else {
    if (moneyHarm) {
      if (a.discoveredWhen === "within_4y") {
        rec.push({
          kind: "csf",
          fit: a.lawyerStatus === "disciplined" ? "recommended" : "possible",
          reasons: {
            en: [
              `Your loss appears within the 4-year discovery window (max $100,000 per claim).`,
              a.lawyerStatus === "disciplined"
                ? "The lawyer has disciplinary status, which normally satisfies the Fund's attorney-status condition."
                : "The Fund normally requires the lawyer to be disbarred/disciplined/resigned/deceased/adjudicated incompetent/judgment debtor/convicted — waivers are possible; ask the Fund directly (213-765-1140).",
            ],
            es: [],
          },
        });
      } else {
        rec.push({ kind: "csf", fit: "not_now", reasons: { en: ["The 4-year window from discovery appears to have passed. Confirm with the Fund (213-765-1140) — partial or later-discovery facts sometimes change the analysis."], es: [] } });
      }
    } else if (a.moneyInvolved === "settlement") {
      rec.push({ kind: "csf", fit: "possible", reasons: { en: ["Settlement funds held by a lawyer are exactly what the Fund covers when they are not paid out — log the amounts and dates, then check eligibility."], es: [] } });
    } else {
      rec.push({ kind: "csf", fit: "not_now", reasons: { en: ["No money loss is involved. The Fund does not cover malpractice, fee disputes, or non-monetary harm."], es: [] } });
    }
  }
  void csn;

  // Fee channel fit
  if (a.harm.includes("fee_dispute") || a.goal === "resolve_fees") {
    rec.push({
      kind: "fee",
      fit: "recommended",
      reasons: {
        en: [
          state === "TX"
            ? "Fee disagreements (what was charged vs. what was agreed) fit CAAP mediation; it is free and commonly used after a grievance is dismissed, but you can ask about it directly."
            : "Fee disagreements fit California's mandatory fee arbitration through local bar associations (e.g., LA County Bar, SF Bar) — often free or low-cost.",
        ],
        es: [],
      },
    });
  } else if (a.moneyInvolved === "fees") {
    rec.push({ kind: "fee", fit: "possible", reasons: { en: ["Because you paid fees, the fee channel may still help if billing disagreements emerge alongside the other problems."], es: [] } });
  }

  // Malpractice — always informational (PRD: statute-of-limitations warning + referral)
  if (a.harm.includes("missed_deadline") || a.goal === "protect_case") {
    rec.push({
      kind: "malpractice",
      fit: "possible",
      reasons: {
        en: [
          "A missed deadline that damaged your case MAY be a malpractice question. This is a separate civil claim — deadlines are strict (TX: generally 2 years; CA: generally 1 year from discovery) — get a referral and check your deadline now.",
        ],
        es: [],
      },
    });
  } else {
    rec.push({
      kind: "malpractice",
      fit: "not_now",
      reasons: { en: ["Nothing in your answers points to professional negligence yet. Keep the channel in mind if your case itself was harmed."], es: [] },
    });
  }

  // Localize reasons for Spanish users (translations mirror the English text)
  if (rec.length) {
    // reasons.es filled where empty to keep parity without duplicating copy blocks
    const esMap: Record<string, string[]> = {
      money_discipline: ["Los hechos que describe involucran dinero que le pertenecía; el mal uso de fondos de clientes es un asunto central de la disciplina."],
      conduct_discipline: ["Abandono, fechas vencidas, acuerdos sin autorización, deshonestidad y retención del expediente son conductas sobre las que el sistema disciplinario acepta quejas."],
      fee_first: ["Las disputas puramente de honorarios suelen manejarse mejor primero por el canal de honorarios, pero el cobro excesivo repetido también puede plantearse en la disciplina."],
      discipline_possible: ["Los hechos que describe son del tipo que el sistema disciplinario investiga."],
      csf_tx_pending: ["Aún no: el Fondo de Texas exige una queja primero (salvo que el abogado esté expulsado, haya renunciado, fallecido o en suspensión indefinida). Presente la queja ahora y prepare la solicitud al Fondo; el plazo es de 18 meses tras la sentencia firme."],
      csf_tx_ok: ["Presentó (o presentará) la queja; el Fondo de Texas generalmente paga solo tras hallazgos disciplinarios de robo o falta de reembolso. Atención al plazo de 18 meses tras la sentencia firme."],
      csf_tx_status: ["El abogado ya tiene estado disciplinario (expulsado/renunciado/fallecido/suspensión indefinida): puede solicitar al Fondo sin nuevo hallazgo. Presente dentro de los 18 meses tras la sentencia firme."],
      csf_tx_not_money: ["El Fondo de Texas cubre solo dinero robado y honorarios no devengados; no cubre mala praxis, disputas de monto de honorarios ni insatisfacción con resultados."],
      csf_ca_ok: ["Su pérdida parece estar dentro de la ventana de 4 años desde el descubrimiento (máximo $100,000 por caso)."],
      csf_ca_status: ["El abogado tiene estado disciplinario, lo que normalmente satisface la condición de estado del Fondo."],
      csf_ca_ask: ["El Fondo normalmente exige que el abogado esté expulsado/disciplinado/renunciado/fallecido/incompetente/deudor de sentencia/condenado; hay excepciones posibles, pregunte al Fondo (213-765-1140)."],
      csf_ca_late: ["La ventana de 4 años desde el descubrimiento parece vencida. Confirme con el Fondo (213-765-1140); hechos de descubrimiento posterior a veces cambian el análisis."],
      csf_ca_settlement: ["Los fondos de acuerdo retenidos por un abogado son justo lo que cubre el Fondo cuando no se pagan; registre montos y fechas y verifique elegibilidad."],
      csf_no_money: ["No hay pérdida de dinero. El Fondo no cubre mala praxis, disputas de honorarios ni daños no monetarios."],
      fee_tx: ["Los desacuerdos de honorarios (cobrado vs. acordado) encajan en la mediación CAAP; es gratuita y común tras desestimar una queja, pero puede consultar directamente."],
      fee_ca: ["Los desacuerdos de honorarios encajan en el arbitraje obligatorio de California vía colegios locales (p. ej., LA County Bar, SF Bar), a menudo gratis o de bajo costo."],
      fee_possible: ["Como pagó honorarios, el canal de honorarios puede ayudar si aparecen desacuerdos de cobro junto con los otros problemas."],
      mal_possible: ["Una fecha vencida que dañó su caso PUEDE ser una cuestión de mala praxis. Es una demanda civil separada; los plazos son estrictos (TX: generalmente 2 años; CA: 1 año desde el descubrimiento). Pida una referencia y verifique su plazo ahora."],
      mal_not_now: ["Nada en sus respuestas apunta aún a negligencia profesional. Tenga presente este canal si su caso de fondo fue dañado."],
    };
    for (const r of rec) {
      if (r.reasons.es.length === 0 && r.reasons.en.length > 0) {
        const keyBase =
          r.kind === "discipline"
            ? r.fit === "recommended"
              ? ["money_discipline", "conduct_discipline", "fee_first", "discipline_possible"]
              : ["discipline_possible"]
            : r.kind === "csf"
              ? state === "TX"
                ? r.fit === "recommended"
                  ? ["csf_tx_ok", "csf_tx_status"]
                  : r.fit === "possible"
                    ? ["csf_tx_pending"]
                    : ["csf_tx_not_money"]
                : r.fit === "recommended"
                  ? ["csf_ca_ok", "csf_ca_status"]
                  : r.fit === "possible"
                    ? ["csf_ca_ask", "csf_ca_settlement"]
                    : ["csf_ca_late", "csf_no_money"]
              : r.kind === "fee"
                ? state === "TX"
                  ? ["fee_tx"]
                  : ["fee_ca"]
                : r.fit === "possible"
                  ? ["mal_possible"]
                  : ["mal_not_now"];
        r.reasons.es = keyBase.flatMap((k) => esMap[k] ?? []);
        if (r.kind === "csf" && r.fit === "possible" && state === "CA" && r.reasons.en.length > 1) {
          r.reasons.es.push(esMap["csf_ca_status"]![0]);
        }
      }
    }
  }

  const rank = { recommended: 0, possible: 1, not_now: 2 } as const;
  return rec.sort((x, y) => rank[x.fit] - rank[y.fit]);
}
