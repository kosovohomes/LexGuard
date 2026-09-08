// LexGuard Guide Library — combined index (PRD FR-1)
import { GUIDES_A, type Guide } from "./guides-a";
import { GUIDES_B } from "./guides-b";

export type { Guide, GuideSection, StateNote, BiText } from "./guides-a";

export const GUIDES: Guide[] = [...GUIDES_A, ...GUIDES_B].sort((a, b) => a.order - b.order);

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
