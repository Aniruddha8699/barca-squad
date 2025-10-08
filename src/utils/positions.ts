// src/utils/positions.ts
export type PositionGroup = "Goalkeeper" | "Defence" | "Midfield" | "Offence" | "Other";

const MAP: Record<PositionGroup, string[]> = {
  Goalkeeper: ["Goalkeeper"],
  Defence: ["Defence", "Center Back", "Centre-Back", "Left-Back", "Right-Back", "Fullback", "Defender"],
  Midfield: ["Midfield", "Midfielder", "Defensive Midfield", "Central Midfield", "Attacking Midfield", "Left Midfield", "Right Midfield"],
  Offence: ["Offence", "Forward", "Striker", "Centre-Forward", "Right Winger", "Left Winger", "Winger", "Attacker"],
  Other: ["Substitute", "Coach", "Unknown", ""]
};

export const POSITION_GROUPS: PositionGroup[] = ["Goalkeeper", "Defence", "Midfield", "Offence"];

export function groupOf(position?: string | null): PositionGroup {
  const p = (position || "").toLowerCase();
  for (const g of POSITION_GROUPS) {
    if (MAP[g].some(alias => p === alias.toLowerCase())) return g;
    if (MAP[g].some(alias => p.includes(alias.toLowerCase()))) return g; // fuzzy match
  }
  return "Other";
}
