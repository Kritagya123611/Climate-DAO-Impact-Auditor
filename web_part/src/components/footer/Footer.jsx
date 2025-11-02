import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.container}>
      <p className={styles.text}>© 2025 WattWise. All rights reserved.</p>

      <div className={styles.imageContainer}>
        <Image src="/1.png" width={24} height={24} className={styles.icon} alt="Social Icon" />
        <Image src="/2.png" width={24} height={24} className={styles.icon} alt="Social Icon" />
        <Image src="/3.png" width={24} height={24} className={styles.icon} alt="Social Icon" />
        <Image src="/4.png" width={24} height={24} className={styles.icon} alt="Social Icon" />
      </div>
    </footer>
  );
};

export default Footer;
