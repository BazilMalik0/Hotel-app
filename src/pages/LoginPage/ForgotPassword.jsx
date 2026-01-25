import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    // Success message
    setSuccess("Password reset link has been sent to your email.");
    setEmail("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email and we will send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* EMAIL INPUT */}
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
          </div>

          {/* SUBMIT */}
          <button className={styles.submitBtn} type="submit">
            Send Reset Link
          </button>

          {/* BACK TO LOGIN */}
          <p className={styles.loginLink}>
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
