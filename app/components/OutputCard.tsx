"use client";

import { useState } from "react";
import styles from "./OutputCard.module.css";

interface OutputCardProps {
  text: string;
}

export default function OutputCard({ text }: OutputCardProps) {
  const [copyLabel, setCopyLabel] = useState("Copy Text");
  const [toast, setToast] = useState<string | null>(null);

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

  function handleShare() {
    setToast("Coming soon");
    setTimeout(() => setToast(null), 2000);
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
        <button className={styles.actionBtn} onClick={handleShare}>
          <span className="material-symbols-outlined">image</span>
          Share as Image
        </button>
      </div>
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
