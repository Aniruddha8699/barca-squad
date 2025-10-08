import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSquad } from "../context/SquadContext";
import styles from "../styles/detail.module.css";
import { groupOf } from "../utils/positions";

function ageFrom(dob?: string) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

const placeholder = `${process.env.PUBLIC_URL}/player.jpg`;

export default function DetailView() {
  const { id } = useParams();
  const pid = Number(id);
  const { players } = useSquad();
  const navigate = useNavigate();

  const idx = players.findIndex((p) => p.id === pid);
  const p = players[idx];

  function prev() {
    if (idx > 0) navigate(`/player/${players[idx - 1].id}`);
  }
  function next() {
    if (idx >= 0 && idx < players.length - 1) navigate(`/player/${players[idx + 1].id}`);
  }

  if (!p) return <p>Player not found. <Link to="/">Back</Link></p>;

  const imgSrc = p.image || placeholder;

  return (
    <section className={styles.detail}>
      <h1 className={styles.title}>{p.name}</h1>

      <div className={styles.imageWrap}>
        <img
          className={styles.photo}
          src={imgSrc}
          alt={p.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholder;
          }}
        />
      </div>

      <div className={styles.infoCard}>
        <dl className={styles.infoList}>
          <div className={styles.row}>
            <dt>Position</dt>
            <dd>{p.position || "–"}</dd>
          </div>
          <div className={styles.row}>
            <dt>Country</dt>
            <dd>{p.nationality || "–"}</dd>
          </div>
          {p.dateOfBirth && (
            <div className={styles.row}>
              <dt>DOB</dt>
              <dd>{new Date(p.dateOfBirth).toLocaleDateString()}</dd>
            </div>
          )}
          <div className={styles.row}>
            <dt>Age</dt>
            <dd>{ageFrom(p.dateOfBirth) ?? "–"}</dd>
          </div>
          <div className={styles.row}>
            <dt>Role</dt>
            <dd>{groupOf(p.position)}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.navBtns}>
        <button className={styles.btn} onClick={prev} disabled={idx <= 0}>
          ← Previous
        </button>
        <button className={styles.btn} onClick={next} disabled={idx >= players.length - 1}>
          Next →
        </button>
      </div>

      <div className={styles.back}>
        <Link to="/">← Back to List</Link>
      </div>
    </section>
  );
}
