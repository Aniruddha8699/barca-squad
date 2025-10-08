// src/pages/ListView.tsx
import React from "react";
import { useSquad } from "../context/SquadContext";
import PlayerCard from "../components/PlayerCard";
import grid from "../styles/list.module.css";
import controls from "../styles/controls.module.css";
import { POSITION_GROUPS, groupOf } from "../utils/positions";
import type { Player } from "../types";

type SortKey = "name" | "position" | "nationality";
type SortDir = "asc" | "desc";

export default function ListView() {
  const { players, loading, error } = useSquad();

  const [query, setQuery] = React.useState("");
  const [posFilter, setPosFilter] = React.useState<string>("All");
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = players
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .filter((p) => (posFilter === "All" ? true : groupOf(p.position) === posFilter));

    const get = (p: Player, k: SortKey) =>
      (p[k] || "").toString().toLowerCase();

    const sorted = [...filtered].sort((a, b) => {
      const av = get(a, sortKey);
      const bv = get(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [players, query, posFilter, sortKey, sortDir]);

  return (
    <>
      {/* Controls row */}
      <div className={grid.controls}>
        <input
          className={controls.input}
          placeholder="Type to filter by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter by name"
        />

        <div className={controls.sortWrap} aria-label="Sort options">
          <span className={controls.label}>Sort by</span>
          <select
            className={controls.select}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="name">Name</option>
            <option value="position">Position</option>
            <option value="nationality">Country</option>
          </select>

          <span className={controls.label}>Order</span>
          <select
            className={controls.select}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDir)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className={grid.count}>{shown.length} shown</div>
      </div>

      {/* Position chips */}
      <div className={controls.chips} role="tablist" aria-label="Position filters">
        {["All", ...POSITION_GROUPS].map((g) => (
          <button
            key={g}
            className={`${controls.chip} ${posFilter === g ? controls.chipOn : ""}`}
            onClick={() => setPosFilter(g)}
            aria-pressed={posFilter === g}
          >
            {g}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && <p>Loading squad…</p>}
      {!loading && error && <p>{error}</p>}

      {/* Grid */}
      {!loading && !error && (
        <div className={grid.grid}>
          {shown.map((p) => (
            <PlayerCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}
