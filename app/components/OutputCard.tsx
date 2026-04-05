"use client";

import { useState } from "react";
import styles from "./OutputCard.module.css";

interface OutputCardProps {
  text: string;
}

export default function OutputCard({ text }: OutputCardProps) {
  const [copyLabel, setCopyLabel] = useState("Copy Text");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Text"), 2000);
    } catch {
      setCopyLabel("Copy failed");
      setTimeout(() => setCopyLabel("Copy Text"), 2000);
    }
  }

  return (
    <div className={styles.card}>
      <span className={`material-symbols-outlined ${styles.quoteIcon}`}>
        format_quote
      </span>
      <blockquote className={styles.blockquote}>{text}</blockquote>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleCopy}>
          <span className="material-symbols-outlined">content_copy</span>
          {copyLabel}
        </button>
      </div>
    </div>
  );
}
