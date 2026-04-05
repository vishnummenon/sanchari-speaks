import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>The Narrative Traveler</p>
          <h1 className={styles.headline}>Draft Your Journey</h1>
          <p className={styles.subtitle}>
            Transform your everyday observations into the ornate, literary
            narration style of Sancharam — Kerala&apos;s iconic travel
            documentary. Type a thought; receive a travelogue.
          </p>
          <a href="#translate" className={styles.cta}>
            <span className="material-symbols-outlined">auto_awesome</span>
            Translate to Narrative
          </a>
        </div>

        <div className={styles.imageWrap}>
          <Image
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80"
            alt="Kerala backwaters at dusk — misty water, palm silhouettes"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className={styles.image}
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%23f7f4e9'/%3E%3C/svg%3E"
            priority
          />
          <div className={styles.scrim} />
        </div>
      </div>
    </section>
  );
}
