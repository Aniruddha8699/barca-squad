import React from "react";
import { Link } from "react-router-dom";
import type { Player } from "../types";
import styles from "../styles/list.module.css";

// const placeholder = "https://via.placeholder.com/300x300?text=Player";
const placeholder = "player.jpg";

export default function PlayerCard({ p }: { p: Player }) {
  return (
    <Link to={`/player/${p.id}`} className={styles.card}>
      {/* <img className={styles.avatar} src={p.image || placeholder} alt={p.name} /> */}
      {/* <img className={styles.avatar} src={p.image || placeholder} alt={p.name} /> */}
      <img
        className={styles.avatar /* or styles.img */}
        src={p.image || placeholder}
        alt={p.name}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = placeholder;
        }}
      />
      <div className={styles.name}>{p.name}</div>
      <div className={styles.meta}>
        <span>{p.position || "–"}</span>
        <span>•</span>
        <span>{p.nationality || "–"}</span>
      </div>
    </Link>
  );
}