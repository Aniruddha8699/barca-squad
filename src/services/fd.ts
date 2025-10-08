// src/services/fd.ts
import axios from "axios";
import type { Player } from "../types";

const host = typeof window !== "undefined" ? window.location.hostname : "";
const isLocal = /^(localhost|127\.0\.0\.1|::1)$/i.test(host);
// const isGhPages = host.endsWith("github.io"); // ⬅️ add this
const token = "007ecd1015014a9c8931de6680ea7478";

export const FD = axios.create({
  baseURL: isLocal ? "/api" : "https://api.football-data.org/v4",
  headers: token ? { "X-Auth-Token": token } : {},
});

export type FdPlayer = { id: number; name: string; position?: string; nationality?: string; dateOfBirth?: string };
export type FdTeam = { id: number; name: string; crest: string; squad: FdPlayer[] };

export async function getBarcaTeam(): Promise<FdTeam> {
  // Always read local static JSON
  const url = `${process.env.PUBLIC_URL}/data/team_81.json`;
  const resp = await fetch(url, { cache: "no-store" });

  if (!resp.ok) {
    // If someone saved only an array (squad) by mistake, gracefully fallback below
    throw new Error(`static team_81.json fetch failed: ${resp.status}`);
  }

  const json = await resp.json();
  // Support either full team object or just the squad array
  const team: FdTeam = Array.isArray(json)
    ? { id: 81, name: "FC Barcelona", crest: "https://crests.football-data.org/81.png", squad: json }
    : json;

  return team;
}

export function mapFdPlayers(squad: FdPlayer[]): Player[] {
  return squad.map((p) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    nationality: p.nationality,
    dateOfBirth: p.dateOfBirth,
    image: null,
  }));
}
