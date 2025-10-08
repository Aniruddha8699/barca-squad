import React from "react";
import styles from "../styles/controls.module.css";

const POS = ["Goalkeeper", "Defence", "Midfield", "Offence"];

type Props = { active: string[]; onToggle: (p: string) => void };
export default function PositionFilter({ active, onToggle }: Props) {
    return (
        <div className={styles.chips}>
            {POS.map(p => (
                <button
                    key={p}
                    className={`${styles.chip} ${active.includes(p) ? styles.chipOn : ""}`}
                    aria-pressed={active.includes(p)}
                    onClick={() => onToggle(p)}
                >{p}</button>
            ))}
        </div>
    );
}