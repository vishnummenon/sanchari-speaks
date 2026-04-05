"use client";

import { useState } from "react";
import OutputCard from "./OutputCard";
import styles from "./TranslatePanel.module.css";

export default function TranslatePanel() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClear() {
    setInput("");
    setOutput(null);
    setError(null);
  }

  async function handleTranslate() {
    const text = input.trim();
    if (!text) return;

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setOutput(data.translated_text);
    } catch {
      setError("Could not reach the translation service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleTranslate();
    }
  }

  return (
    <section id="translate" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Your Thought</h2>
          <p className={styles.hint}>
            Type in Malayalam, English, or Manglish — we&apos;ll detect and
            transform.
          </p>
        </div>

        <div className={styles.inputWrap}>
          <textarea
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ഇവിടെ ടൈപ്പ് ചെയ്യൂ… or type in English or Manglish"
            rows={5}
            disabled={loading}
            aria-label="Input text to translate"
          />
          {error && (
            <p className={styles.error} role="alert">
              <span className="material-symbols-outlined">error</span>
              {error}
            </p>
          )}
        </div>

        <div className={styles.buttonRow}>
          <button
            className={styles.translateBtn}
            onClick={handleTranslate}
            disabled={loading || !input.trim()}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Translating…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">auto_awesome</span>
                Translate to Sancharam
              </>
            )}
          </button>
          {input.trim() && !loading && (
            <button
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="Clear input"
            >
              <span className="material-symbols-outlined">close</span>
              Clear
            </button>
          )}
        </div>

        {loading && (
          <div className={styles.skeleton} aria-hidden="true">
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} style={{ width: "80%" }} />
            <div className={styles.skeletonLine} style={{ width: "90%" }} />
          </div>
        )}

        {output && !loading && <OutputCard text={output} />}
      </div>
    </section>
  );
}
