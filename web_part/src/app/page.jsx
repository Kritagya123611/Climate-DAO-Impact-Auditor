"use client";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>
        Welcome to <span>WattWise</span>
      </h1>
      <p>Your gateway to sustainable energy solutions.</p>

      <Link href="/wallet" className={styles.button}>
        Enter WattWise 
      </Link>
    </div>
  );
}
