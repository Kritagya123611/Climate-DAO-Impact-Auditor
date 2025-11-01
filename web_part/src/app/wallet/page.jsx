"use client"
import React from 'react'
import styles from "./page.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
const wallet = () => {
    const session=useSession()
        const router=useRouter()
        if(session.status==='loading'){
        return <p>Loading...</p>
       }
       if(session.status==='unauthenticated'){
        router?.push("/auth/login")
       }
  return (
    <div className={styles.container}>
      <h1> Your Wallte Dashboard is here </h1>
      <p>Safe and Secuer for your transactions </p>
    </div>
  )
}

export default wallet
