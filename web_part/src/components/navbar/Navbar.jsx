"use client"
import Link from 'next/link'
import React from 'react'
import styles from './navbar.module.css'
import { signOut, useSession } from 'next-auth/react'
const links=[
  {
    id:1,
    title:"Home",
    url:"/",
  },
  {
    id:2,
    title:"Portfolio",
    url:"/",
  },
  {
    id:3,
    title:"Blog",
    url:"/",
  },
  {
    id:4,
    title:"About",
    url:"/",
  },
  {
    id:5,
    title:"Contact",
    url:"/",
  },
  {
    id:6,
    title:"Dashboard",
    url:"/",
  },
]

const Navbar = () => {
  const session = useSession()
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}> WattWise</Link>
      <div className={styles.links}>
        {links.map(links=>(
          <Link key={links.id} href={links.url} className={styles.link}>{links.title}</Link>
        ))}
       {session.status==="authenticated"?(
         <button className={styles.logout} onClick={signOut}>Logout</button>
       ):(<button className={styles.logout}><Link href='/auth/login'>SignUp</Link></button>)}
      </div>
    </div>
  )
}

export default Navbar
