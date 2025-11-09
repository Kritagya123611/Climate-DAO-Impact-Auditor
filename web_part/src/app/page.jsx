"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.hero}>
      <div className={styles.heroInner}>
        {/* Hero heading */}
        <h1 className={styles.title}>
          Welcome to{" "}
          <span className={styles.brand}>
            WattWise
          </span>
        </h1>

        {/* Subtitle / tagline */}
        <p className={styles.subtitle}>
          Your gateway to sustainable energy solutions.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaRow}>
          <Link
            href="/wallet"
            className={styles.btnPrimary}
            aria-label="Enter WattWise — open wallet dashboard"
          >
            Enter WattWise
          </Link>

          <Link
            href="/learn"
            className={styles.btnGhost}
            aria-label="Learn more about WattWise"
          >
            Learn More
          </Link>
        </div>

        {/* Small secondary hint / note */}
        <p className={styles.microlink} aria-hidden="true">
          Explore features →
        </p>
      </div>
    </main>
  );
}
