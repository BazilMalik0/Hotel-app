// src/components/NavBar/NavBar.jsx

import React from "react";
import logo from "../../assets/logo.png";
import styles from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

// NavBar now accepts two props: onSelectCategory and activeCategory
function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isAdminLoggedIn") === "true"
  );
  const [restaurant, setRestaurant] = useState(() => {
    const r = localStorage.getItem("currentRestaurant");
    return r ? JSON.parse(r) : null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem("isAdminLoggedIn") === "true");
      const r = localStorage.getItem("currentRestaurant");
      setRestaurant(r ? JSON.parse(r) : null);
    };

    // Listen to authChange (same-tab) and storage (other tabs)
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("currentRestaurant");
    // notify other components/tabs
    window.dispatchEvent(
      new CustomEvent("authChange", { detail: { type: "logout" } })
    );
    navigate("/login");
  };

  return (
    <div className={styles.NavBarWrapper}>
      <div className={styles.NavBarCard}>
        {/* Brand Group (Logo & Title) - Stays on the LEFT */}
        <div className={styles.brandGroup}>
          <img
            src={logo}
            className={styles.logo}
            alt="Restaurant Operations Hub Logo"
          />
          <h3 className={styles.title}>Restaurant Operations Hub</h3>
        </div>

        {/* ⭐ NEW: Auth Group (Login & Registration) - Moves to the RIGHT */}
        <div className={styles.authGroup}>
          <>
            <nav>
              {isLoggedIn ? (
                <>
                  <span>{restaurant ? restaurant.name : "Admin"}</span>
                  <button
                    className={`${styles.authLink} ${styles.loginButton}`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className={styles.authGroup}>
                  <Link
                    to="/register"
                    className={`${styles.authLink} ${styles.loginButton}`}
                  >
                    Registration
                  </Link>
                  <Link
                    to="/login"
                    className={`${styles.authLink} ${styles.loginButton}`}
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
