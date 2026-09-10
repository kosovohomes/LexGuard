// LexGuard Guide Library — combined index (PRD FR-1)
import { GUIDES_A, type Guide } from "./guides-a";
import { GUIDES_B } from "./guides-b";
import { EXPANSION_STATE_NOTES } from "./guides-expansion";

export type { Guide, GuideSection, StateNote, BiText } from "./guides-a";

// Merge expansion-state (FL/NY/AZ) notes over the launch guides. Launch-state
// (TX/CA) notes stay untouched; a guide without expansion notes is unchanged.
export const GUIDES: Guide[] = [...GUIDES_A, ...GUIDES_B]
  .map((g) => ({ ...g, stateNotes: { ...g.stateNotes, ...(EXPANSION_STATE_NOTES[g.slug] ?? {}) } }))
  .sort((a, b) => a.order - b.order);

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
