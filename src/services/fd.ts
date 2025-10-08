// src/services/fd.ts
import axios from "axios";
import type { Player } from "../types";

const host = typeof window !== "undefined" ? window.location.hostname : "";
const isLocal = /^(localhost|127\.0\.0\.1|::1)$/i.test(host);
const token = process.env.REACT_APP_FD_TOKEN;

export const FD = axios.create({
  baseURL: isLocal ? "/api" : "https://api.football-data.org/v4",
  // Add header in BOTH dev and prod (browser -> dev server proxy -> API)
  headers: token ? { "X-Auth-Token": token } : {},
});

FD.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response) {
      const { status, statusText, data } = err.response;
      const detail = typeof data === "string" ? data : (data?.message as string) || "";
      return Promise.reject(new Error(`football-data: ${status} ${statusText} ${detail}`.trim()));
    }
    if (err.request) {
      return Promise.reject(new Error("football-data: no response (possible CORS or network issue)"));
    }
    return Promise.reject(new Error(`football-data: ${err.message}`));
  }
);

export type FdPlayer = { id: number; name: string; position?: string; nationality?: string; dateOfBirth?: string };
export type FdTeam = { id: number; name: string; crest: string; squad: FdPlayer[] };

export async function getBarcaTeam(): Promise<FdTeam> {
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
