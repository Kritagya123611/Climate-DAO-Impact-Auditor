// src/app/page.jsx
import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container} role="main">
      {/* Optional decorative background elements (purely visual) */}
      <div className={styles.bgBlob} aria-hidden="true" />
      <div className={styles.bgRing} aria-hidden="true" />

      <header>
        <h1 className={styles.title}>
          Welcome to <span className={styles.brand}>WattWise</span>
        </h1>
        <p className={styles.subtitle}>
          Your gateway to sustainable energy solutions.
        </p>
      </header>

      <nav className={styles.ctaGroup} aria-label="Primary actions">
        <Link href="/wallet" className={styles.optionButton}>
          <div className={styles.card}>
            <h3>Open Wallet</h3>
            <p>Manage payments & projects securely</p>
          </div>
        </Link>

        <Link href="/learn" className={styles.optionButton}>
          <div className={styles.card}>
            <h3>Learn</h3>
            <p>How WattWise helps you save energy</p>
          </div>
        </Link>

        <Link href="/dashboard" className={styles.optionButton}>
          <div className={styles.card}>
            <h3>Dashboard</h3>
            <p>View analytics and performance</p>
          </div>
        </Link>
      </nav>

      <div className={styles.actionsRow}>
        <Link href="/signup" className={styles.addButton}>
          Get Started
        </Link>

        <Link href="/contact" className={styles.ghostButton}>
          Contact Sales
        </Link>
      </div>

      <div className={styles.heroHint} aria-hidden="true">
        <span className={styles.hintDot} />
        <span className={styles.hintText}>Scroll to explore features</span>
      </div>

      <span className={styles["sr-only"]}>
        WattWise homepage — main actions: Open Wallet, Learn, Dashboard.
      </span>
    </main>
  );
}
