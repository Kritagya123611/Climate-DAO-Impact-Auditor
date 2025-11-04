"use client";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function Persona() {
  const params = useSearchParams();

  const name = params.get("name") ?? "Unknown Project";
  const category = params.get("category") ?? "N/A";
  const description = params.get("description") ?? "N/A";
  const website = params.get("website");

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>{name}</h1>
      <p><strong>Category:</strong> {category}</p>
      <p><strong>Description:</strong> {description}</p>

      {website && (
        <p>
          <strong>Website:</strong>{" "}
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        </p>
      )}
    </div>
  );
}
