import React from "react";
import type { SortKey, SortDir } from "../types";
import styles from "../styles/controls.module.css";

type Props = {
    sortKey: SortKey; sortDir: SortDir;
    onChangeKey: (k: SortKey) => void; onChangeDir: (d: SortDir) => void;
};
export default function SortControls({ sortKey, sortDir, onChangeKey, onChangeDir }: Props) {
    return (
        <div className={styles.sortWrap}>
            <label className={styles.label}>
                Sort by
                <select value={sortKey} onChange={(e) => onChangeKey(e.target.value as SortKey)} className={styles.select}>
                    <option value="name">Name</option>
                    <option value="position">Position</option>
                    <option value="nationality">Country</option>
                </select>
            </label>
            <label className={styles.label}>
                Order
                <select value={sortDir} onChange={(e) => onChangeDir(e.target.value as SortDir)} className={styles.select}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </label>
        </div>
    );
}