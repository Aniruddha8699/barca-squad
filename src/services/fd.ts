// src/services/fd.ts
import axios from "axios";
import type { Player } from "../types";

const host = typeof window !== "undefined" ? window.location.hostname : "";
const isLocal = /^(localhost|127\.0\.0\.1|::1)$/i.test(host);
const isGhPages = host.endsWith("github.io"); // ⬅️ add this
const token = "007ecd1015014a9c8931de6680ea7478";

export const FD = axios.create({
  baseURL: isLocal ? "/api" : "https://api.football-data.org/v4",
  headers: token ? { "X-Auth-Token": token } : {},
});

export type FdPlayer = { id: number; name: string; position?: string; nationality?: string; dateOfBirth?: string };
export type FdTeam = { id: number; name: string; crest: string; squad: FdPlayer[] };

export async function getBarcaTeam(): Promise<FdTeam> {
  // On GitHub Pages, load the baked JSON (no CORS, no token)
  if (isGhPages) {
    const url = `${process.env.PUBLIC_URL}/data/team_81.json`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`static team json fetch failed: ${resp.status}`);
    const json = await resp.json();
    // If someone accidentally baked only the squad array, wrap it
    const team: FdTeam = Array.isArray(json)
      ? { id: 81, name: "FC Barcelona", crest: "", squad: json }
      : json;
    return team;
  }

  // Dev (localhost): use proxy + token
  if (!token) throw new Error("Missing REACT_APP_FD_TOKEN. Add it to .env and restart.");
  const { data } = await FD.get<FdTeam>("/teams/81");
  return data;
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
