"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import { signOut, useSession } from "next-auth/react";

const links = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Portfolio", url: "/" },
  { id: 3, title: "Blog", url: "/" },
  { id: 4, title: "About", url: "/" },
  { id: 5, title: "Contact", url: "/" },
  { id: 6, title: "Dashboard", url: "/" },
];

const Navbar = () => {
  const session = useSession();

  return (
    <nav className={styles.container}>
      <Link href="/" className={styles.logo}>
        WattWise
      </Link>

      <div className={styles.links}>
        {links.map((item) => (
          <Link key={item.id} href={item.url} className={styles.link}>
            {item.title}
          </Link>
        ))}

        {session.status === "authenticated" ? (
          <button className={styles.logout} onClick={signOut}>
            Logout
          </button>
        ) : (
          <Link href="/auth/login" className={styles.login}>
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
