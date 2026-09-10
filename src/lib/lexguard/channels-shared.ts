// Shared channel types (used by channels.ts and channels-expansion.ts).

import type { ChannelKind } from "./types";

export type { ChannelKind, Locale, USState } from "./types";

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
