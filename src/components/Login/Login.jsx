import React from "react";

import { getImageUrl } from "../../utils";
import styles from "./Login.module.css";

export const Login = () => {
  return (
    <section className={styles.container}>
      <header>Login or Sign Up</header>
      <img src={getImageUrl("logo.png")} alt="Logo" className={styles.logo}/>
      <div className={styles.content}>
        <input
          type="text"
          placeholder="Username"
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Password"
          className={styles.input}
        />
        <button className={styles.button}>
          Login
        </button>
        <button className={styles.button}>
          Forgot Password
        </button>
        <button className={styles.button}>
          Register
        </button>
      </div>
      <footer>Copyright stuff</footer>
      <div>
        <p>Modal for Info</p>
      </div>
      <div>
        <p>Modal for Forgot Password</p>
      </div>
      <div>
        <p>Modal for Register</p>
      </div>
    </section>
    
  )
}