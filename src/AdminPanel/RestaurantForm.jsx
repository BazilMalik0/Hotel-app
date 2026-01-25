// src/components/RestaurantForm/RestaurantForm.jsx
import React from "react";
import styles from "./RestaurantForm.module.css";

import { MapPinHouse, Phone, Mail } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const RestaurantForm = ({ restaurant: propRestaurant }) => {
  const { restaurant: contextRestaurant } = useOutletContext() || {};
  const restaurant = propRestaurant || contextRestaurant;

  if (!restaurant) return null; // Prevents the 'logoPath' undefined error
  return (
    <div className={styles.wrapper}>
      {/* Top Heading Area */}
      <div className={styles.headerSection}>
        <img
          src={restaurant.logoPath}
          alt="Restaurant Logo"
          className={styles.logo}
        />

        <h1 className={styles.title}>Welcome to {restaurant.hotelName}</h1>
      </div>

      {/* Space where you will put all info later */}
      <div className={styles.contentBox}>
        <h2 className={styles.subHeading}>Your Details</h2>
        <p className={styles.contactInfo}>
          <span role="img" aria-label="mail">
            <Mail />
          </span>
          Email: {restaurant.email}
        </p>
        <p className={styles.contactInfo}>
          <span role="img" aria-label="location">
            <MapPinHouse />
          </span>
          {restaurant.address}
        </p>
        <p className={styles.contactInfo}>
          <span role="img" aria-label="phone">
            <Phone />
          </span>
          Call us: +91 {restaurant.contact}
        </p>
      </div>
    </div>
  );
};

export default RestaurantForm;
