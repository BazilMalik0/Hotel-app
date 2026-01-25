// src/pages/LoginPage/LoginPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import Confetti from "react-confetti";
import Snackbar from "../../util/Snackbar";
import { useCallback } from "react";
import NavBar from "../../Components/Header/NavBar";

const LoginPage = () => {
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [runConfetti, setRunConfetti] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const location = useLocation();
  const registrationMessage = location.state?.message;

  const handleSnackbarClose = useCallback(() => {
    setIsSnackbarOpen(false);
    setSnackbarMessage("");
  }, []);

  useEffect(() => {
    if (registrationMessage) {
      setToastMessage(registrationMessage);
      setRunConfetti(true);
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.muted = false;
        })
        .catch((error) => {
          console.log("Audio play failed (browser policy):", error);
        });

      const toastTimer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);

      const confettiTimer = setTimeout(() => {
        setRunConfetti(false);
      }, 5000);

      return () => {
        clearTimeout(toastTimer);
        clearTimeout(confettiTimer);
      };
    }
    if (location.state?.message) {
      location.state.message = null;
    }
  }, [registrationMessage, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      general: "",
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.userName.trim()) {
      newErrors.userName = "User name is required.";
      isValid = false;
    } else if (formData.userName.trim().length < 3) {
      newErrors.userName = "User name must be at least 3 characters.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.password.trim())) {
      newErrors.password = "Enter a valid 10-digit password.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSnackbarClose();

    const payload = {
      userName: formData.userName,
      userPassword: formData.password,
    };

    if (validate()) {
      fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            setSnackbarMessage("Invalid Credentials Entered");
            setIsSnackbarOpen(true);
            throw new Error("Login failed"); // Stop the chain
          }
        })
        .then((data) => {
          // ⭐ UPDATED LOGIC HERE:
          // 1. Save to localStorage first
          localStorage.setItem(
            "currentRestaurant",
            JSON.stringify(data.selectedRestaurant)
          );
          // 1b. mark admin as logged in so NavBar can read it
          localStorage.setItem("isAdminLoggedIn", "true");

          // 2. Dispatch a custom event so NavBar (and other components) can see the change immediately in the same tab.
          window.dispatchEvent(
            new CustomEvent("authChange", {
              detail: { type: "login", restaurant: data.selectedRestaurant },
            })
          );
          // 2. Dispatch a storage event so NavBar (and other components) can see the change immediately
          window.dispatchEvent(new Event("storage"));

          // 3. Navigate to Admin Panel
          navigate("./../AdminPanel/restaurant", {
            state: {
              restaurant: data.selectedRestaurant,
            },
          });
        })
        .catch((err) => {
          console.log("Error is:", err);
        });
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <audio
          ref={audioRef}
          src="/src/assets/clapping.mp3"
          volume="1.0"
          muted={true}
        />

        {toastMessage && (
          <div className={styles.toastContainer}>
            <div className={styles.toastContent}>
              <span role="img" aria-label="success">
                ✅
              </span>
              <span style={{ whiteSpace: "pre-wrap" }}>{toastMessage}</span>
            </div>
          </div>
        )}

        {runConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        )}

        <div className={styles.loginBox}>
          <h2 className={styles.title}>Login</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>User Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your user name"
              />
              {errors.userName && (
                <p className={styles.error}>{errors.userName}</p>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>

            <button type="submit" className={styles.loginBtn}>
              Login
            </button>

            <p className={styles.forgotPassword}>
              <Link to="/forgotpassword" className={styles.forgotPasswordLink}>
                Forgot Password?
              </Link>
            </p>

            {errors.general && (
              <p className={styles.error} style={{ textAlign: "center" }}>
                {errors.general}
              </p>
            )}
          </form>

          <p className={styles.signupText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.signupLink}>
              Register
            </Link>
          </p>
        </div>
        <Snackbar
          message={snackbarMessage}
          isOpen={isSnackbarOpen}
          onClose={handleSnackbarClose}
        />
      </div>
    </>
  );
};

export default LoginPage;
