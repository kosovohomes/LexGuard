// LexGuard Referral Directory — PRD FR-7 (static, vetted listings; no paid placement)

import type { USState } from "./types";

export interface ReferralEntry {
  name: string;
  kind: "legal_aid" | "referral_service" | "clinic" | "self_help" | "government";
  url: string;
  note: { en: string; es: string };
  states: USState[];
}

export const REFERRALS: ReferralEntry[] = [
  {
    name: "Lone Star Legal Aid",
    kind: "legal_aid",
    url: "https://www.lonestarlegal.org",
    states: ["TX"],
    note: {
      en: "LSC-funded legal aid serving low-income Texans (family, housing, consumer).",
      es: "Asistencia legal con fondos LSC para texanos de bajos ingresos (familia, vivienda, consumo).",
    },
  },
  {
    name: "TexasLawHelp.org",
    kind: "self_help",
    url: "https://texaslawhelp.org",
    states: ["TX"],
    note: {
      en: "Free plain-language legal information and forms for Texans.",
      es: "Información legal gratuita en lenguaje claro y formularios para texanos.",
    },
  },
  {
    name: "State Bar of Texas — Lawyer Referral & Information Service",
    kind: "referral_service",
    url: "https://www.texasbar.com/lris",
    states: ["TX"],
    note: {
      en: "Official referral service; initial consultation at low or no cost.",
      es: "Servicio oficial de referencia; consulta inicial a bajo costo o gratis.",
    },
  },
  {
    name: "Texas A&M / UT Law Clinics",
    kind: "clinic",
    url: "https://law.tamu.edu/current-students/clinics/",
    states: ["TX"],
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
    note: {
      en: "Legal aid for low-income Angelenos; multiple offices.",
      es: "Asistencia legal para angelinos de bajos ingresos; varias oficinas.",
    },
  },
  {
    name: "State Bar of California — Lawyer Referral Service Directory",
    kind: "referral_service",
    url: "https://www.calbar.ca.gov/Public/Need-Lawyer-Help/Lawyer-Referral-Service",
    states: ["CA"],
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
    note: {
      en: "Official court self-help guides and forms (in Spanish available).",
      es: "Guías y formularios oficiales de autoayuda judicial (disponible en español).",
    },
  },
  {
    name: "Law School Clinics (CA)",
    kind: "clinic",
    url: "https://www.calbar.ca.gov/Access-Justice/Free-Low-Cost-Legal-Help",
    states: ["CA"],
    note: {
      en: "Free/low-cost clinics list maintained by the State Bar.",
      es: "Lista de clínicas gratuitas/de bajo costo mantenida por el Colegio.",
    },
  },
];

export const KIND_LABELS: Record<string, { en: string; es: string }> = {
  legal_aid: { en: "Legal aid", es: "Asistencia legal" },
  referral_service: { en: "Lawyer referral", es: "Referencia de abogados" },
  clinic: { en: "Law-school clinic", es: "Clínica universitaria" },
  self_help: { en: "Self-help", es: "Autoayuda" },
  government: { en: "Government", es: "Gobierno" },
};
