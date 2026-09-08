// LexGuard Red-Flag Rule Library — PRD §8 (Phase 1, 20 rules)
//
// GOVERNANCE (PRD FR-3): rules are declarative data; each rule carries its own
// version, state applicability, neutral observation template, citations, channel
// mapping, severity and attorney-review sign-off status. Templates use
// {placeholders} interpolated from computed CaseFacts — no free-text generation.
//
// LANGUAGE POLICY (PRD §3.1): every template is conditional and non-accusatory.
// It states facts, cites the rule, and names channels — never conclusions.

import type { ChannelKind, Locale, Severity, USState } from "./types";

export const RULE_LIBRARY_VERSION = "1.0.0";

export type TriggerType =
  | "settlement_no_disbursement"
  | "retainer_no_refund"
  | "cash_or_personal_payments"
  | "charges_not_in_agreement"
  | "silence_after_attempts_30d"
  | "missed_deadline_no_prep"
  | "missed_appearance"
  | "case_dormant_90d"
  | "repeated_unanswered_14d"
  | "staff_only_contact"
  | "settlement_without_authorization"
  | "file_not_returned"
  | "conflict_of_interest"
  | "paid_exceeds_agreement"
  | "contingency_overage"
  | "unrelated_billing"
  | "admin_fees_not_in_agreement"
  | "asked_to_lie"
  | "guaranteed_outcome"
  | "missing_fee_agreement";

export interface RedFlagRule {
  id: string; // RF-01 … RF-20 (stable IDs, referenced by dossiers)
  trigger: TriggerType;
  states: USState[];
  severity: Severity;
  title: { en: string; es: string };
  template: { en: string; es: string };
  citations: Record<USState, string[]>;
  channels: ChannelKind[];
  evidence: { en: string[]; es: string[] };
  reviewer: string | null; // licensed-attorney sign-off (FR-3.4) — null = pending
  reviewedAt: string | null;
  effectiveFrom: string; // ISO date
}

const D = "2026-09-09"; // library effective date (PRD date)

export const RULES: RedFlagRule[] = [
  {
    id: "RF-01",
    trigger: "settlement_no_disbursement",
    states: ["TX", "CA"],
    severity: "high",
    title: {
      en: "Settlement funds held without logged disbursement",
      es: "Fondos de acuerdo recibidos sin desembolso registrado",
    },
    template: {
      en: "Your journal shows a settlement of {amount} was received by the attorney on {date}, and no disbursement to you has been logged after {days} days. Lawyers in {state} generally must hold client funds in a trust account and pay them out promptly ({cite}). Delayed disbursement of settlement funds is a frequent subject of discipline complaints. You may wish to consider the channels below.",
      es: "Su registro muestra que un acuerdo de {amount} fue recibido por el abogado el {date} y no se ha registrado ningún desembolso a usted después de {days} días. En {state}, los abogados generalmente deben guardar los fondos del cliente en una cuenta de depósito y pagarlos prontamente ({cite}). La demora en el desembolso de fondos de acuerdos es un motivo frecuente de quejas ante el colegio de abogados. Puede considerar los canales siguientes.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.14(b)"], CA: ["CA Rule of Professional Conduct 4-100"] },
    channels: ["discipline", "csf"],
    evidence: {
      en: ["Settlement statement or check copy", "Any written promise about when you would be paid", "Your bank statements showing no deposit"],
      es: ["Estado de cuenta del acuerdo o copia del cheque", "Cualquier promesa escrita sobre cuándo le pagarían", "Sus estados de cuenta bancarios sin el depósito"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-02",
    trigger: "retainer_no_refund",
    states: ["TX", "CA"],
    severity: "high",
    title: {
      en: "Retainer paid, no refund after case ended",
      es: "Retainer pagado, sin reembolso tras terminar el caso",
    },
    template: {
      en: "You logged a retainer of {amount}, your case is marked ended{ended}, and no refund has been logged. Unearned fees generally must be refunded when a lawyer has not performed the agreed services ({cite}). Client Security Funds in both states can cover failure to refund fees when no services were performed — see the CSF channel for eligibility details.",
      es: "Registró un retainer de {amount}, su caso está marcado como terminado{ended} y no se ha registrado ningún reembolso. Generalmente, los honorarios no devengados deben reembolsarse cuando el abogado no realizó los servicios acordados ({cite}). Los Fondos de Seguridad del Cliente en ambos estados cubren el no reembolso de honorarios cuando no se realizaron servicios; consulte el canal CSF para detalles de elegibilidad.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.14"], CA: ["CA Rule 4-100", "CA Rule 1.16(d)"] },
    channels: ["discipline", "csf"],
    evidence: {
      en: ["Signed fee agreement", "Payment receipt or check", "Termination letter or email", "Invoices showing little or no work"],
      es: ["Acuerdo de honorarios firmado", "Recibo de pago o cheque", "Carta o correo de terminación", "Facturas que muestren poco o ningún trabajo"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-03",
    trigger: "cash_or_personal_payments",
    states: ["TX", "CA"],
    severity: "medium",
    title: {
      en: "Cash payments without receipts or payments to the lawyer personally",
      es: "Pagos en efectivo sin recibo o pagos al abogado personalmente",
    },
    template: {
      en: "Your money log includes {cash} cash payment(s) without receipts and/or {personal} payment(s) made to the attorney personally rather than to the firm or its trust account. Client funds are generally required to be kept separate from the lawyer's own money ({cite}). These facts may be worth raising in a complaint; the channels below accept trust-account concerns.",
      es: "Su registro de dinero incluye {cash} pago(s) en efectivo sin recibo y/o {personal} pago(s) hechos al abogado personalmente en lugar de a la firma o su cuenta de depósito. Generalmente se requiere que los fondos del cliente se mantengan separados del dinero del abogado ({cite}). Estos hechos pueden mencionarse en una queja; los canales siguientes aceptan inquietudes sobre cuentas de depósito.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.14"], CA: ["CA Rule 4-100"] },
    channels: ["discipline"],
    evidence: {
      en: ["Any receipt, text, or email acknowledging the payment", "Check or transfer records", "Notes of who asked for cash"],
      es: ["Cualquier recibo, mensaje o correo que confirme el pago", "Registros de cheque o transferencia", "Notas de quién pidió el efectivo"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-04",
    trigger: "charges_not_in_agreement",
    states: ["TX", "CA"],
    severity: "medium",
    title: {
      en: "Charges that do not match the fee agreement",
      es: "Cargos que no coinciden con el acuerdo de honorarios",
    },
    template: {
      en: "You logged {count} charge(s) that were not part of your fee agreement. Fees must be reasonable and explained ({cite}); unexplained charges are a common fee-dispute subject. The fee channel below handles disputes about charges; discipline handles reasonableness concerns.",
      es: "Registró {count} cargo(s) que no formaban parte de su acuerdo de honorarios. Los honorarios deben ser razonables y explicados ({cite}); los cargos sin explicación son un motivo común de disputas. El canal de honorarios siguiente maneja disputas por cargos; la disciplina maneja inquietudes de razonabilidad.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.04"], CA: ["CA Rule 4-200", "Bus. & Prof. Code 6148"] },
    channels: ["discipline", "fee"],
    evidence: {
      en: ["Signed fee agreement", "Invoices with line items", "Your notes asking about the charge (and any reply)"],
      es: ["Acuerdo de honorarios firmado", "Facturas con detalles", "Sus notas preguntando por el cargo (y cualquier respuesta)"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-05",
    trigger: "silence_after_attempts_30d",
    states: ["TX", "CA"],
    severity: "medium",
    title: {
      en: "No substantive contact for 30+ days despite repeated attempts",
      es: "Sin contacto sustantivo por más de 30 días pese a intentos repetidos",
    },
    template: {
      en: "You logged {attempts} attempt(s) to contact your attorney over {span} days with no substantive response. In {state}, a lawyer is generally required to keep a client reasonably informed and respond promptly ({cite}). Many complaints to the disciplinary system concern communication. The channels below may apply.",
      es: "Registró {attempts} intento(s) de contactar a su abogado durante {span} días sin respuesta sustantiva. En {state}, generalmente se requiere que el abogado mantenga al cliente razonablemente informado y responda prontamente ({cite}). Muchas quejas al sistema disciplinario se refieren a la comunicación. Los canales siguientes pueden aplicar.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.03"], CA: ["CA Rule 1.4"] },
    channels: ["discipline"],
    evidence: {
      en: ["Emails and text messages (keep originals with dates)", "Call log screenshots", "Notes of each attempt: date, time, what you asked"],
      es: ["Correos y mensajes de texto (conserve originales con fechas)", "Capturas del registro de llamadas", "Notas de cada intento: fecha, hora, qué preguntó"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-06",
    trigger: "missed_deadline_no_prep",
    states: ["TX", "CA"],
    severity: "high",
    title: {
      en: "Deadline passed without logged preparation",
      es: "Fecha límite vencida sin preparación registrada",
    },
    template: {
      en: "Your journal shows a deadline or court date on {date} marked as missed, with no preparation or filing logged in the two weeks before it. Diligence and competence rules generally require prompt attention to matters ({cite}). Missed deadlines can cause serious harm; the malpractice-information channel explains limitations periods, and discipline accepts neglect complaints.",
      es: "Su registro muestra una fecha límite o audiencia el {date} marcada como vencida, sin preparación ni presentación registrada en las dos semanas anteriores. Las reglas de diligencia y competencia generalmente requieren atención pronta a los asuntos ({cite}). Las fechas vencidas pueden causar daño grave; el canal informativo de mala praxis explica los plazos de prescripción, y la disciplina acepta quejas por negligencia.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.01"], CA: ["CA Rule 1.3"] },
    channels: ["discipline", "malpractice"],
    evidence: {
      en: ["Court notices with dates", "Calendar entries", "Any communications about the deadline"],
      es: ["Notificaciones del tribunal con fechas", "Entradas del calendario", "Cualquier comunicación sobre la fecha límite"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-07",
    trigger: "missed_appearance",
    states: ["TX", "CA"],
    severity: "high",
    title: {
      en: "Attorney did not appear at a scheduled event",
      es: "El abogado no compareció a una audiencia programada",
    },
    template: {
      en: "You logged that the attorney did not appear at a scheduled court event on {date}. Failure to appear is treated seriously by disciplinary systems ({cite}). Preserve any court notice and write down what the court staff said happened; the channels below accept this type of complaint.",
      es: "Registró que el abogado no compareció a una audiencia el {date}. La incomparecencia se trata con seriedad por los sistemas disciplinarios ({cite}). Conserve la notificación del tribunal y anote lo que el personal dijo que ocurrió; los canales siguientes aceptan este tipo de queja.",
    },
    citations: { TX: ["TX Disciplinary Rules 1.01, 3.02"], CA: ["CA Rules 1.3, 3.2"] },
    channels: ["discipline", "malpractice"],
    evidence: {
      en: ["Court notice or minute order", "Names of court staff you spoke with", "Photos of the docket/room if available"],
      es: ["Notificación del tribunal o acta", "Nombres del personal con quien habló", "Fotos del tablero de audiencias si las tiene"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-08",
    trigger: "case_dormant_90d",
    states: ["TX", "CA"],
    severity: "medium",
    title: {
      en: "No case activity for 90+ days",
      es: "Sin actividad del caso por más de 90 días",
    },
    template: {
      en: "Your journal shows no activity of any kind for {days} days while your case is still open. A pattern of inactivity may be consistent with neglect or abandonment ({cite}). Consider requesting a written status update first; if none comes, the channels below may help.",
      es: "Su registro no muestra actividad de ningún tipo durante {days} días mientras su caso sigue abierto. Un patrón de inactividad puede ser consistente con negligencia o abandono ({cite}). Considere primero pedir una actualización por escrito; si no llega, los canales siguientes pueden ayudar.",
    },
    citations: { TX: ["TX Disciplinary Rules 1.01, 1.03"], CA: ["CA Rules 1.3, 1.4"] },
    channels: ["discipline"],
    evidence: {
      en: ["Your dated contact attempts", "Last known filing or letter", "Case number and court contact info"],
      es: ["Sus intentos de contacto con fecha", "Última presentación o carta conocida", "Número de caso y contacto del tribunal"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-09",
    trigger: "repeated_unanswered_14d",
    states: ["TX", "CA"],
    severity: "standard",
    title: {
      en: "Multiple unanswered contact attempts in 14 days",
      es: "Varios intentos de contacto sin respuesta en 14 días",
    },
    template: {
      en: "You logged {attempts} contact attempts within 14 days with no response. Clients are generally entitled to timely updates about their matter ({cite}). If the silence continues, consider a written request (email or letter) so you have a dated record — that record strengthens any later complaint.",
      es: "Registró {attempts} intentos de contacto en 14 días sin respuesta. Generalmente, los clientes tienen derecho a actualizaciones oportunas sobre su asunto ({cite}). Si el silencio continúa, considere una solicitud por escrito (correo o carta) para tener un registro con fecha; ese registro fortalece una queja posterior.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.03"], CA: ["CA Rule 1.4"] },
    channels: ["discipline"],
    evidence: {
      en: ["Emails/texts with timestamps", "Call logs", "Copies of any letters sent"],
      es: ["Correos/mensajes con fecha y hora", "Registro de llamadas", "Copias de cartas enviadas"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-10",
    trigger: "staff_only_contact",
    states: ["TX", "CA"],
    severity: "standard",
    title: {
      en: "Only staff respond despite requests to reach the attorney",
      es: "Solo responde el personal pese a sus pedidos de contactar al abogado",
    },
    template: {
      en: "Your journal shows {count} recent response(s) came only from staff, and you asked to speak with the attorney directly. In {state}, a lawyer must reasonably supervise staff but also keep the client informed ({cite}); delegation alone does not remove the duty to communicate. Note this pattern with dates in your journal.",
      es: "Su registro muestra {count} respuesta(s) recientes solo del personal y usted pidió hablar directamente con el abogado. En {state}, el abogado debe supervisar razonablemente al personal y también mantener informado al cliente ({cite}); la delegación no elimina el deber de comunicarse. Anote este patrón con fechas en su registro.",
    },
    citations: { TX: ["TX Disciplinary Rules 1.03, 5.03"], CA: ["CA Rules 1.4, 5.3"] },
    channels: ["discipline"],
    evidence: {
      en: ["Emails showing who replied", "Your request to speak with the attorney", "Dates of each exchange"],
      es: ["Correos que muestren quién respondió", "Su pedido de hablar con el abogado", "Fechas de cada intercambio"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-11",
    trigger: "settlement_without_authorization",
    states: ["TX", "CA"],
    severity: "high",
    title: {
      en: "Settlement accepted without your authorization",
      es: "Acuerdo aceptado sin su autorización",
    },
    template: {
      en: "You logged that settlement terms were accepted on your behalf without your authorization. In {state}, decisions to settle belong to the client ({cite}). This is one of the most serious categories in the disciplinary system. Write down exactly what was agreed and when you learned of it; the channels below accept this type of complaint.",
      es: "Registró que los términos de un acuerdo fueron aceptados en su nombre sin su autorización. En {state}, la decisión de acordar pertenece al cliente ({cite}). Esta es una de las categorías más graves del sistema disciplinario. Anote exactamente qué se acordó y cuándo se enteró; los canales siguientes aceptan este tipo de queja.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.02"], CA: ["CA Rule 1.2"] },
    channels: ["discipline", "malpractice"],
    evidence: {
      en: ["Settlement paperwork you never signed", "Messages about the settlement", "Your written objection, if you sent one"],
      es: ["Documentos del acuerdo que nunca firmó", "Mensajes sobre el acuerdo", "Su objeción por escrito, si envió una"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-12",
    trigger: "file_not_returned",
    states: ["TX", "CA"],
    severity: "medium",
    title: {
      en: "Client file not returned after request",
      es: "Expediente del cliente no devuelto tras solicitarlo",
    },
    template: {
      en: "You requested your client file {days} day(s) ago and it has not been returned{refused}. Clients generally own their file at termination and are entitled to papers and property that belong to them ({cite}). The guide \"You Are Entitled to Your File\" includes a template request letter; discipline and, in some situations, the courts handle refusals.",
      es: "Solicitó su expediente hace {days} día(s) y no ha sido devuelto{refused}. Generalmente, el cliente es dueño de su expediente al terminar la relación y tiene derecho a sus papeles y pertenencias ({cite}). La guía \u00abUsted tiene derecho a su expediente\u00bb incluye una carta modelo; la disciplina y, en algunos casos, los tribunales manejan las negativas.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.16(d)"], CA: ["CA Rule 1.16(e)"] },
    channels: ["discipline"],
    evidence: {
      en: ["Your written request (keep a copy)", "Retainer agreement", "List of documents you handed the lawyer"],
      es: ["Su solicitud por escrito (conserve copia)", "Acuerdo de retainer", "Lista de documentos que entregó al abogado"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-13",
    trigger: "conflict_of_interest",
    states: ["TX", "CA"],
    severity: "high",
    title: {
      en: "Possible connection to the opposing side",
      es: "Posible conexión con la parte contraria",
    },
    template: {
      en: "You logged facts suggesting your attorney has a connection to the opposing side or a former opposing party in the same matter. Conflict-of-interest rules generally prohibit this without informed consent ({cite}). These are fact-sensitive situations; describe what you observed with dates and consider raising them with the channels below.",
      es: "Registró hechos que sugieren que su abogado tiene una conexión con la parte contraria o con una ex parte contraria en el mismo asunto. Las reglas de conflictos de interés generalmente lo prohíben sin consentimiento informado ({cite}). Son situaciones sensibles a los hechos; describa lo que observó con fechas y considere plantearlo a los canales siguientes.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.06"], CA: ["CA Rule 1.7"] },
    channels: ["discipline"],
    evidence: {
      en: ["What you saw or heard, with dates", "Names of the other parties", "Any documents showing the connection"],
      es: ["Lo que vio u oyó, con fechas", "Nombres de las otras partes", "Documentos que muestren la conexión"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-14",
    trigger: "paid_exceeds_agreement",
    states: ["TX", "CA"],
    severity: "medium",
    title: {
      en: "Total paid exceeds the agreed fee without explanation",
      es: "Total pagado excede el honorario acordado sin explicación",
    },
    template: {
      en: "Your money log shows total payments of {paid}, which exceeds the {agreed} recorded in your fee agreement, with no logged explanation. Fee rules generally require agreed and reasonable charges ({cite}). Keep every invoice; the fee channel below resolves billing disputes outside of court in both states.",
      es: "Su registro muestra pagos totales de {paid}, que exceden el {agreed} anotado en su acuerdo de honorarios, sin explicación registrada. Las reglas de honorarios generalmente requieren cargos acordados y razonables ({cite}). Conserve cada factura; el canal de honorarios siguiente resuelve disputas de cobro fuera del tribunal en ambos estados.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.04"], CA: ["CA Rule 4-200", "Bus. & Prof. Code 6148"] },
    channels: ["discipline", "fee"],
    evidence: {
      en: ["Fee agreement", "All invoices and receipts", "Your payment records"],
      es: ["Acuerdo de honorarios", "Todas las facturas y recibos", "Sus registros de pagos"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-15",
    trigger: "contingency_overage",
    states: ["TX", "CA"],
    severity: "medium",
    title: {
      en: "Contingency percentage higher than agreed",
      es: "Porcentaje de contingency mayor al acordado",
    },
    template: {
      en: "You logged a payout of {percent}%, but your agreement recorded {agreed}%. Contingency fees must match what was agreed in writing ({cite}). Take a photo of the signed agreement page before you raise the issue; the fee channel below handles these disputes.",
      es: "Registró un pago del {percent}%, pero su acuerdo anotaba {agreed}%. Los honorarios de contingency deben coincidir con lo acordado por escrito ({cite}). Tome una foto de la página firmada del acuerdo antes de plantear el tema; el canal de honorarios siguiente maneja estas disputas.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.04(d)"], CA: ["CA Rule 4-200(a)", "Bus. & Prof. Code 6147"] },
    channels: ["discipline", "fee"],
    evidence: {
      en: ["Signed contingency agreement", "Settlement statement", "Payment records"],
      es: ["Acuerdo de contingency firmado", "Estado de cuenta del acuerdo", "Registros de pago"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-16",
    trigger: "unrelated_billing",
    states: ["TX", "CA"],
    severity: "standard",
    title: {
      en: "Billed items that do not look like your matter",
      es: "Cobros que no parecen de su asunto",
    },
    template: {
      en: "You marked {count} billed item(s) as work you do not recognize or that seems unrelated to your matter. Fees must be reasonable and related to the representation ({cite}). Keep the invoices exactly as received; the fee channel below reviews billing disputes line by line.",
      es: "Marcó {count} cobro(s) como trabajo que no reconoce o que parece no relacionado con su asunto. Los honorarios deben ser razonables y relacionados con la representación ({cite}). Conserve las facturas tal como las recibió; el canal de honorarios siguiente revisa las disputas de cobro línea por línea.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.04"], CA: ["CA Rule 4-200"] },
    channels: ["fee", "discipline"],
    evidence: {
      en: ["Invoices with line items", "Notes on which items you question and why"],
      es: ["Facturas con detalles", "Notas sobre qué cobros cuestiona y por qué"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-17",
    trigger: "admin_fees_not_in_agreement",
    states: ["TX", "CA"],
    severity: "standard",
    title: {
      en: "Unexplained administrative charges",
      es: "Cargos administrativos sin explicación",
    },
    template: {
      en: "You logged {count} administrative charge(s) that do not appear in your fee agreement. Charges should be tied to the agreement's terms ({cite}). Ask in writing for an itemized explanation and keep the reply; the fee channel below can help if the answer is not satisfactory.",
      es: "Registró {count} cargo(s) administrativo(s) que no aparecen en su acuerdo de honorarios. Los cargos deben corresponder a los términos del acuerdo ({cite}). Pida por escrito una explicación detallada y conserve la respuesta; el canal de honorarios siguiente puede ayudar si la respuesta no es satisfactoria.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.04"], CA: ["CA Rule 4-200", "Bus. & Prof. Code 6148"] },
    channels: ["fee", "discipline"],
    evidence: {
      en: ["Invoices showing the charge", "Your written question and the reply"],
      es: ["Facturas que muestren el cargo", "Su pregunta por escrito y la respuesta"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-18",
    trigger: "asked_to_lie",
    states: ["TX", "CA"],
    severity: "high",
    title: {
      en: "Asked to make a false statement",
      es: "Le pidieron hacer una declaración falsa",
    },
    template: {
      en: "Your journal records that you were asked to make a false statement to a court or insurer. Candor toward the tribunal and honesty rules treat this very seriously ({cite}). Do not confront the lawyer; write down exactly what was asked, when, and who was present. The discipline channel below accepts such complaints, and you may wish to consult a lawyer referral service about your own exposure.",
      es: "Su registro indica que le pidieron hacer una declaración falsa a un tribunal o aseguradora. Las reglas de sinceridad ante el tribunal y honestidad tratan esto con mucha seriedad ({cite}). No confronte al abogado; anote exactamente qué le pidieron, cuándo y quién estaba presente. El canal de disciplina siguiente acepta tales quejas y puede consultar un servicio de referencia de abogados sobre su propia situación.",
    },
    citations: { TX: ["TX Disciplinary Rules 3.03, 8.03"], CA: ["CA Rules 3.3, 8.3"] },
    channels: ["discipline", "malpractice"],
    evidence: {
      en: ["Your dated notes of the request", "Any text/email about it", "Names of witnesses"],
      es: ["Sus notas con fecha del pedido", "Cualquier mensaje sobre ello", "Nombres de testigos"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-19",
    trigger: "guaranteed_outcome",
    states: ["TX", "CA"],
    severity: "standard",
    title: {
      en: "Guarantee of a specific outcome was promised",
      es: "Se prometió garantía de un resultado específico",
    },
    template: {
      en: "Your journal records a promise that a specific outcome was guaranteed. In {state}, lawyers generally may not guarantee outcomes ({cite}). Save the message or write down what was said, when, and who heard it; this can matter both in discipline and in any fee or malpractice discussion.",
      es: "Su registro indica una promesa de garantía de un resultado específico. En {state}, los abogados generalmente no pueden garantizar resultados ({cite}). Guarde el mensaje o anote lo que se dijo, cuándo y quién lo escuchó; esto puede importar tanto en la disciplina como en cualquier discusión de honorarios o mala praxis.",
    },
    citations: { TX: ["TX Disciplinary Rule 7.02"], CA: ["CA Rule 7.1"] },
    channels: ["discipline", "malpractice"],
    evidence: {
      en: ["Emails/texts with the promise", "Your notes: date, place, witnesses"],
      es: ["Correos/mensajes con la promesa", "Sus notas: fecha, lugar, testigos"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
  {
    id: "RF-20",
    trigger: "missing_fee_agreement",
    states: ["TX", "CA"],
    severity: "standard",
    title: {
      en: "No written fee agreement on file",
      es: "No hay acuerdo de honorarios por escrito",
    },
    template: {
      en: "You have logged payments totaling {paid}, but no fee agreement is stored in your documents vault. {stateNote} Ask the lawyer for a copy of your signed agreement in writing; the reply (or silence) itself becomes evidence. The fee channel below handles disputes where terms were never made clear.",
      es: "Registró pagos por un total de {paid}, pero no hay acuerdo de honorarios guardado en su bóveda de documentos. {stateNote} Pida al abogado por escrito una copia de su acuerdo firmado; la respuesta (o el silencio) se convierte en evidencia. El canal de honorarios siguiente maneja disputas cuando los términos nunca fueron claros.",
    },
    citations: { TX: ["TX Disciplinary Rule 1.04(d)"], CA: ["CA Rule 4-200(a)", "Bus. & Prof. Code 6148"] },
    channels: ["fee", "discipline"],
    evidence: {
      en: ["Any emails describing the fee arrangement", "Payment records", "Your written request for the agreement"],
      es: ["Correos que describan el arreglo de honorarios", "Registros de pago", "Su solicitud escrita del acuerdo"],
    },
    reviewer: null,
    reviewedAt: null,
    effectiveFrom: D,
  },
];

export function ruleById(id: string): RedFlagRule | undefined {
  return RULES.find((r) => r.id === id);
}

export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : "",
  );
}

export function ruleCitationString(rule: RedFlagRule, state: USState): string {
  return rule.citations[state].join("; ");
}

export function localizedSeverity(sev: Severity, locale: Locale): string {
  if (locale === "es") return sev === "high" ? "Alta" : sev === "medium" ? "Media" : "Informativa";
  return sev === "high" ? "High" : sev === "medium" ? "Medium" : "Informational";
}
