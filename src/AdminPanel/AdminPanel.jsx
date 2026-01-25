import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const AdminPanel = () => {
  const [itemGroups, setItemGroups] = useState([]);
  const [items, setItems] = useState([]);
  const location = useLocation();
  const [restaurant, setRestaurant] = useState(location.state?.restaurant);

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem("currentRestaurant", JSON.stringify(restaurant));
    } else {
      const saved = localStorage.getItem("currentRestaurant");
      if (saved) setRestaurant(JSON.parse(saved));
    }
  }, [restaurant]);

  return (
    <>
      <div className={styles.adminLayout}>
        <div className={styles.divider}>
          <Sidebar restaurant={restaurant} />
        </div>

        <div className={styles.rightContent}>
          <h1 className={styles.title}>Admin Panel</h1>

          <div className={styles.section}>
            {/* Since you define routes in AppRoutes, 
             we use Outlet. To pass props "in one" WITHOUT context, 
             we use the context provider internally or simply use the context 
             in a way that feels like props.
          */}
            <Outlet
              context={{
                restaurant,
                items,
                setItems,
                itemGroups,
                setItemGroups,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
