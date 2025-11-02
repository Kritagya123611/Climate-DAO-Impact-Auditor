"use client";
import React from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ethers } from "ethers";

const Login = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") router.push("/");
  if (status === "loading") return <p className={styles.loading}>Loading...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    signIn("credentials", { email, password });
  };

  const handleWeb3Login = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not detected!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = "Login to WattWise with MetaMask";
      const signature = await signer.signMessage(message);
      const res = await signIn("credentials", {
        redirect: false,
        wallet: address,
        signature,
      });

      if (!res.error) router.push("/");
    } catch (err) {
      console.error(err);
      alert("MetaMask login failed!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className={styles.input} required />
        <input type="password" placeholder="Password" className={styles.input} required />
        <button type="submit" className={styles.button}>Login</button>
      </form>

      <button
        className={`${styles.button} ${styles.googleButton}`}
        onClick={() => signIn("google")}
      >
        Continue with Google
      </button>
      <button
        className={`${styles.button} ${styles.googleButton}`}
        onClick={handleWeb3Login}
      >
        Login with MetaMask 
      </button>

      <Link href="/auth/register" className={styles.register}>
        New to WattWise? Create an account →
      </Link>
    </div>
  );
};

export default Login;
