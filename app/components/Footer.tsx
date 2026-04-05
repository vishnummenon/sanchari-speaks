import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.blurb}>
          <h3 className={styles.blurbHeading}>Why Sanchari Speaks?</h3>
          <p className={styles.blurbText}>
            Sancharam redefined how Malayalis see their world — through
            language that elevates the everyday into the sublime. Sanchari
            Speaks lets anyone channel that voice: a tool for those who feel
            the poetic weight of a journey but reach for plainer words. Your
            thoughts deserve the literary treatment.
          </p>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2024 The Narrative Traveler — A Digital Heirloom project.
            Inspired by Sancharam.
          </p>
          <nav className={styles.links} aria-label="Footer navigation">
            <a href="#">Journal</a>
            <a href="#">Archives</a>
            <a href="#">About</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
