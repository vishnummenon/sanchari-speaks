import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Sanchari Speaks</span>
          <span className={styles.tagline}>
            നിങ്ങളുടെ വാക്കുകൾ, സഞ്ചാരത്തിന്റെ ശൈലിയിൽ
          </span>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#" className={styles.navLink}>
            Our Heritage
          </a>
          <a href="#" className={styles.navLink}>
            Travelogue Archives
          </a>
          <a href="#" className={styles.navLink}>
            The Craft
          </a>
        </nav>

        <button className={styles.exploreBtn} aria-label="Explore">
          <span className="material-symbols-outlined">explore</span>
        </button>
      </div>
    </header>
  );
}
