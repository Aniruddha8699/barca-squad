// src/pages/GalleryView.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useSquad } from "../context/SquadContext";
import styles from "../styles/gallery.module.css";
import controls from "../styles/controls.module.css";
import { POSITION_GROUPS, groupOf } from "../utils/positions";

export default function GalleryView() {
  const { players, loading, error } = useSquad();

  const [posFilter, setPosFilter] = React.useState<string>("All");

  const shown = React.useMemo(() => {
    return players.filter((p) =>
      posFilter === "All" ? true : groupOf(p.position) === posFilter
    );
  }, [players, posFilter]);

  const placeholder = "/player.jpg";

  return (
    <>
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
      {loading && <p>Loading gallery…</p>}
      {!loading && error && <p>{error}</p>}

      {/* Grid */}
      {!loading && !error && (
        <div className={styles.grid}>
          {shown.map((p) => (
            <Link key={p.id} to={`/player/${p.id}`} className={styles.card}>
              <figure className={styles.thumb}>
                <img
                  className={styles.img}
                  src={p.image || placeholder}
                  alt={p.name}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholder; }}
                />
              </figure>
              <div className={styles.caption}>{p.name}</div>
              <div className={styles.sub}>
                {(p.position || "–")} • {(p.nationality || "–")}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
