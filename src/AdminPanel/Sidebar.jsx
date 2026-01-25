// src/components/Sidebar/Sidebar.jsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  FiMenu,
  FiArrowLeft,
  FiArrowRight,
  FiCoffee,
  FiLayers,
  FiPackage,
} from "react-icons/fi";

const Sidebar = ({ restaurant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Safety check: If restaurant is not loaded yet, show a loading state or nothing
  if (!restaurant) {
    return <aside className={styles.adminSidebar}>Loading...</aside>;
  }

  // Helper function to safely get initials
  const getInitials = (name) => {
    if (!name) return "RE"; // Fallback initials
    const parts = name.split(" ");
    const first = parts[0]?.charAt(0) || "";
    const second = parts[1]?.charAt(0) || "";
    return (first + second).toUpperCase();
  };

  const menuItems = [
    {
      name: "Hotel / Restaurant",
      icon: FiCoffee,
      section: "restaurant",
      link: "/AdminPanel/restaurant",
    },
    {
      name: "Item Groups",
      icon: FiLayers,
      section: "itemGroup",
      link: "/AdminPanel/item-groups",
    },
    {
      name: "Items",
      icon: FiPackage,
      section: "item",
      link: "/AdminPanel/items",
    },
  ];

  return (
    <>
      <button
        className={styles.sidebarToggleBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu />
      </button>

      <aside
        className={`${styles.adminSidebar} ${isOpen ? styles.open : ""} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        <div
          className={styles.sidebarCollapseBtn}
          onClick={() => setIsCollapsed((prev) => !prev)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FiArrowRight /> : <FiArrowLeft />}
        </div>

        <div className={styles.sidebarProfile}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatarPlaceholder}>
              {/* Safely get initials */}
              {getInitials(restaurant?.hotelName)}
            </div>
          </div>
          {!isCollapsed && (
            <>
              <span className={styles.profileName}>
                {restaurant?.hotelName || "Restaurant Operations"}
              </span>
              <span className={styles.profileId}>
                Hub ID: {restaurant?._id || "N/A"}
              </span>
            </>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  className={`${styles.navItem} ${
                    location.pathname === item.link ? styles.active : ""
                  }`}
                >
                  <item.icon className={styles.navIcon} />
                  {!isCollapsed && item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
