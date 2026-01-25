// src/components/Snackbar/Snackbar.js
import React, { useEffect } from "react";
import styles from "./Snackbar.module.css";
import classNames from "classnames";

/**
 * Custom Snackbar Component
 * @param {string} message - The message to display.
 * @param {boolean} isOpen - Controls visibility.
 * @param {function} onClose - Function to call to close the snackbar.
 * @param {number} duration - How long (in ms) the snackbar should auto-close (0 for manual close).
 */
const Snackbar = ({ message, isOpen, onClose, duration = 4000 }) => {
  // Auto-hide effect
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Cleanup function to clear the timer if the component unmounts or isOpen changes
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  const snackbarClasses = classNames(styles.snackbar, styles.show);

  return (
    <div className={snackbarClasses}>
      <span className={styles.snackbarMessage}>{message}</span>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Snackbar;
