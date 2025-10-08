// src/context/SquadContext.tsx
import React from "react";
import type { Player } from "../types";
import { getBarcaTeam, mapFdPlayers } from "../services/fd";
import { getWikiImageFor } from "../services/wiki";


type SquadState = {
  players: Player[];
  loading: boolean;
  error: string | null;
};

const SquadCtx = React.createContext<SquadState>({
  players: [],
  loading: true,
  error: null,
});

const CACHE_KEY = "barcaPlayers";

export function SquadProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SquadState>({
    players: [],
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));

        // 1) football-data.org — official Barça squad
        const team = await getBarcaTeam();
        let players: Player[] = mapFdPlayers(team.squad);

        // 2) Enrich images via TheSportsDB (cached; robust matching)
        try {
          const enriched: Player[] = await Promise.all(
            players.map(async (p) => {
              const img = await getWikiImageFor(p.name);
              return { ...p, image: img || null };
            })
          );
          players = enriched;
        } catch {
          // ignore enrichment failures; keep core data
        }

        if (!cancelled) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(players));
          setState({ players, loading: false, error: null });
        }
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to load squad data.";
        const cached = localStorage.getItem(CACHE_KEY);

        if (!cancelled) {
          if (cached) {
            setState({
              players: JSON.parse(cached) as Player[],
              loading: false,
              error: `Live fetch failed. ${message}`,
            });
          } else {
            setState({ players: [], loading: false, error: message });
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <SquadCtx.Provider value={state}>{children}</SquadCtx.Provider>;
}

export function useSquad() {
  return React.useContext(SquadCtx);
}
