"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
 
  return (
    <div className={styles.container}>
      <h1>Welcome to <span>WattWise</span></h1>
      <p>Your gateway to sustainable energy solutions.</p>
      <button className={styles.button}>
        <Link href="/wallet">WattWise</Link>
      </button>
    </div>
  );
}
