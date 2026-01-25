// src/components/Footer/Footer.js
import React from "react";
import styles from "./Footer.module.css"; // Import the CSS module
import { MapPinHouse, Phone, Mail, Code } from "lucide-react";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* --- SECTION 1: Al Javid Hotel & Restaurant --- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Restaurant Operations Hub</h3>

        <p className={styles.contactInfo}>
          <span role="img" aria-label="location">
            <MapPinHouse />
          </span>{" "}
          Pulwama, Kashmir - 192301
        </p>
        <p className={styles.contactInfo}>
          <span role="img" aria-label="phone">
            <Phone />
          </span>{" "}
          Call us: +91 6005766348
        </p>
      </div>

      {/* --- SECTION 2: Designed & Developed --- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Designed & Developed by <br />
          Engineers' Computer Hub
        </h3>
        <p className={styles.contactInfo}>
          <span role="img" aria-label="settings">
            <Code />
          </span>
          Lead Developer: Bazil Malik
        </p>
        <p className={styles.contactInfo}>
          <span role="img" aria-label="phone">
            <Phone />
          </span>{" "}
          Call us: +91 6005766348
        </p>
      </div>

      {/* --- SECTION 3: Debugged by Er.Nadeem --- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Debugged by Er.Nadeem</h3>

        <p className={styles.contactInfo}>
          <span role="img" aria-label="phone">
            <Mail />
          </span>
          Email: echpulwama@gmail.com
        </p>
      </div>
    </footer>
  );
};

export default Footer;
