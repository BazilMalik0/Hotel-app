// src/components/Hero/Hero.jsx

import React from "react";
import styles from "./Hero.module.css";
import hero from "../../assets/hero.webp";
import NavBar from "../Header/NavBar";
// Destructure the new prop: onHeroButtonClick
function Hero({ onHeroButtonClick }) {
  return (
    <>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Operations Dashboard Overview</h1>
          <p className={styles.heroSubtitle}>
            Monitor key performance indicators and manage daily venue
            activities.
          </p>
        </div>
        <div className={styles.heroImageContainer}>
          <img
            src={hero}
            alt="A vibrant spread of diverse Indian and Kashmiri dishes"
            className={styles.heroImage}
          />
        </div>
      </div>
    </>
  );
}

export default Hero;
