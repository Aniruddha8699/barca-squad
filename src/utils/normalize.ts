// src/utils/normalize.ts
export function normName(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z]/g, "")
    .toLowerCase();
}

// First_Last format for TheSportsDB search param
export function toTsbQuery(input: string): string {
  const ascii = (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return ascii.replace(/[^A-Za-z\s]/g, " ").trim().replace(/\s+/g, "_");
}

// Lowercased, ASCII, letters-only tokens
export function nameTokens(input: string): string[] {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
