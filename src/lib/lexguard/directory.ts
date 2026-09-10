// LexGuard Referral Directory — PRD FR-7 (static, vetted listings; no paid placement)
// Phase 2: phones, verified dates, victim-compensation programs, more coverage.

import type { USState } from "./types";

export interface ReferralEntry {
  name: string;
  kind: "legal_aid" | "referral_service" | "clinic" | "self_help" | "government";
  url: string;
  phone?: string;
  note: { en: string; es: string };
  states: USState[];
  verified: string;
}

export const DIRECTORY_VERIFIED = "2026-09-09";
export const EXPANSION_VERIFIED = "2026-09-10"; // FL/NY/AZ fact-verification date (Phase 5)

export const REFERRALS: ReferralEntry[] = [
  {
    name: "Lone Star Legal Aid",
    kind: "legal_aid",
    url: "https://www.lonestarlegal.org",
    states: ["TX"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "LSC-funded legal aid serving low-income Texans (family, housing, consumer).",
      es: "Asistencia legal con fondos LSC para texanos de bajos ingresos (familia, vivienda, consumo).",
    },
  },
  {
    name: "Texas RioGrande Legal Aid (TRLA)",
    kind: "legal_aid",
    url: "https://www.trla.org",
    states: ["TX"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "LSC-funded legal aid for South and West Texas, including farmworker and border communities.",
      es: "Asistencia legal con fondos LSC para el sur y oeste de Texas, incluidas comunidades de trabajadores agrícolas y fronterizas.",
    },
  },
  {
    name: "TexasLawHelp.org",
    kind: "self_help",
    url: "https://texaslawhelp.org",
    states: ["TX"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Free plain-language legal information and forms for Texans.",
      es: "Información legal gratuita en lenguaje claro y formularios para texanos.",
    },
  },
  {
    name: "State Bar of Texas — Lawyer Referral & Information Service",
    kind: "referral_service",
    url: "https://www.texasbar.com/lris",
    phone: "800-252-9690",
    states: ["TX"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Official referral service; initial consultation at low or no cost.",
      es: "Servicio oficial de referencia; consulta inicial a bajo costo o gratis.",
    },
  },
  {
    name: "Texas Attorney General — Crime Victim Compensation",
    kind: "government",
    url: "https://www.texasattorneygeneral.gov/crime-victims/crime-victims-compensation-program",
    phone: "800-983-9933",
    states: ["TX"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "State program covering crime-related expenses for eligible victims (separate from attorney remedies).",
      es: "Programa estatal que cubre gastos relacionados con delitos para víctimas elegibles (independiente de los remedios contra abogados).",
    },
  },
  {
    name: "Texas State Law Library — legal help guides",
    kind: "self_help",
    url: "https://www.sll.texas.gov/legal-help/",
    states: ["TX"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Free guides, forms, and a librarian helpline for finding Texas legal help.",
      es: "Guías, formularios y línea de ayuda de bibliotecarios para encontrar asistencia legal en Texas.",
    },
  },
  {
    name: "Texas A&M / UT Law Clinics",
    kind: "clinic",
    url: "https://law.tamu.edu/current-students/clinics/",
    states: ["TX"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Law-school clinics (check current intake areas) — supervised student work.",
      es: "Clínicas universitarias (verifique áreas de admisión vigentes) — trabajo estudiantil supervisado.",
    },
  },
  {
    name: "Bay Area Legal Aid",
    kind: "legal_aid",
    url: "https://baylegal.org",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "LSC-funded legal aid for the Bay Area (family, housing, consumer, health).",
      es: "Asistencia legal con fondos LSC para el Área de la Bahía (familia, vivienda, consumo, salud).",
    },
  },
  {
    name: "Legal Aid Foundation of Los Angeles (LAFLA)",
    kind: "legal_aid",
    url: "https://lafla.org",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Legal aid for low-income Angelenos; multiple offices.",
      es: "Asistencia legal para angelinos de bajos ingresos; varias oficinas.",
    },
  },
  {
    name: "Legal Aid Association of California — find local legal aid",
    kind: "legal_aid",
    url: "https://laaconline.org",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Statewide directory of local legal aid organizations by county.",
      es: "Directorio estatal de organizaciones locales de asistencia legal por condado.",
    },
  },
  {
    name: "LawHelpCA.org",
    kind: "self_help",
    url: "https://lawhelpca.org",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Free legal information and referrals statewide (available in Spanish).",
      es: "Información legal gratuita y referencias en todo el estado (disponible en español).",
    },
  },
  {
    name: "State Bar of California — Lawyer Referral Service Directory",
    kind: "referral_service",
    url: "https://www.calbar.ca.gov/Public/Need-Lawyer-Help/Lawyer-Referral-Service",
    phone: "800-843-7053",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Find your county's certified lawyer referral service.",
      es: "Encuentre el servicio de referencia certificado de su condado.",
    },
  },
  {
    name: "California Courts Self-Help Center",
    kind: "self_help",
    url: "https://selfhelp.courts.ca.gov",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Official court self-help guides and forms (in Spanish available).",
      es: "Guías y formularios oficiales de autoayuda judicial (disponible en español).",
    },
  },
  {
    name: "California Victim Compensation Board (CalVCB)",
    kind: "government",
    url: "https://victims.ca.gov",
    phone: "800-777-9229",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "State program covering crime-related expenses for eligible victims (separate from attorney remedies).",
      es: "Programa estatal que cubre gastos relacionados con delitos para víctimas elegibles (independiente de los remedios contra abogados).",
    },
  },
  {
    name: "Law School Clinics (CA)",
    kind: "clinic",
    url: "https://www.calbar.ca.gov/Access-Justice/Free-Low-Cost-Legal-Help",
    states: ["CA"],
    verified: DIRECTORY_VERIFIED,
    note: {
      en: "Free/low-cost clinics list maintained by the State Bar.",
      es: "Lista de clínicas gratuitas/de bajo costo mantenida por el Colegio.",
    },
  },
  // ---- Phase-5 expansion states (FL / NY / AZ) ------------------------------
  // Public, official or LSC-funded resources only — same vetting bar as the
  // launch states. Verified 2026-09-10; re-verify at publication.
  {
    name: "FloridaLawHelp.org",
    kind: "legal_aid",
    url: "https://www.floridalawhelp.org",
    states: ["FL"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "Free civil legal information and legal-aid directory for Floridians (LSC network).",
      es: "Información legal civil gratuita y directorio de asistencia legal para floridanos (red LSC).",
    },
  },
  {
    name: "The Florida Bar Lawyer Referral Service",
    kind: "referral_service",
    url: "https://www.floridabar.org/public/lrs/",
    states: ["FL"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "The Bar's official referral service — connects you to a screened attorney for a consultation.",
      es: "El servicio oficial de referidos del Colegio — lo conecta con un abogado evaluado para una consulta.",
    },
  },
  {
    name: "The Florida Bar — Consumer & ACAP",
    kind: "self_help",
    url: "https://www.floridabar.org/public/acap/",
    states: ["FL"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "Attorney Consumer Assistance Program — the central intake for complaints and consumer guidance.",
      es: "Programa de Asistencia al Consumidor — la recepción central de quejas y orientación al consumidor.",
    },
  },
  {
    name: "LawHelpNY.org",
    kind: "legal_aid",
    url: "https://www.lawhelpny.org",
    states: ["NY"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "Free civil legal information and legal-aid directory for New Yorkers (LSC network).",
      es: "Información legal civil gratuita y directorio de asistencia legal para neoyorquinos (red LSC).",
    },
  },
  {
    name: "NY Courts Help Center (CourtHelp)",
    kind: "self_help",
    url: "https://www.nycourts.gov/courthelp/",
    states: ["NY"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "The Unified Court System's plain-language guide to courts, forms, and representing yourself.",
      es: "La guía en lenguaje sencillo del Sistema Unificado de Tribunales sobre tribunales, formularios y representarse a sí mismo.",
    },
  },
  {
    name: "NYS Bar Association Lawyer Referral & Information Service",
    kind: "referral_service",
    url: "https://nysba.org/for-the-public/lawyer-referral-service/",
    states: ["NY"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "Statewide referral service — matches you with a lawyer for an initial consultation.",
      es: "Servicio de referidos estatal — lo empareja con un abogado para una consulta inicial.",
    },
  },
  {
    name: "Community Legal Services of Arizona",
    kind: "legal_aid",
    url: "https://www.clsaz.org",
    states: ["AZ"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "LSC-funded legal aid serving low-income Arizonans (Maricopa, Pima and nearby counties).",
      es: "Asistencia legal con fondos LSC para arizonenses de bajos ingresos (condados Maricopa, Pima y cercanos).",
    },
  },
  {
    name: "AZLawHelp.org",
    kind: "self_help",
    url: "https://www.azlawhelp.org",
    states: ["AZ"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "Arizona's legal-information portal with articles and referrals for common civil problems.",
      es: "Portal de información legal de Arizona con artículos y referidos para problemas civiles comunes.",
    },
  },
  {
    name: "State Bar of Arizona Lawyer Referral Service",
    kind: "referral_service",
    url: "https://www.azbar.org/for-the-public/lawyer-referral-service/",
    states: ["AZ"],
    verified: EXPANSION_VERIFIED,
    note: {
      en: "The Bar's referral service — an initial consultation with a participating attorney at reduced cost.",
      es: "El servicio de referidos del colegio — una consulta inicial con un abogado participante a costo reducido.",
    },
  },
];

export const KIND_LABELS: Record<string, { en: string; es: string }> = {
  legal_aid: { en: "Legal aid", es: "Asistencia legal" },
  referral_service: { en: "Lawyer referral", es: "Referencia de abogados" },
  clinic: { en: "Law-school clinic", es: "Clínica universitaria" },
  self_help: { en: "Self-help", es: "Autoayuda" },
  government: { en: "Government program", es: "Programa gubernamental" },
};
