import React from "react";
import styles from "../styles/controls.module.css";

type Props = { value: string; onChange: (v: string) => void; placeholder?: string };
export default function SearchBar({ value, onChange, placeholder }: Props) {
    return (
        <input
            aria-label="Search"
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Search players…"}
        />
    );
}