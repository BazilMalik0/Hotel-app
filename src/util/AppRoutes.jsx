import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Hero from "../Components/Hero/Hero ";
import RegistrationPage from "../pages/RegistrationPage/RegistrationPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import AdminPanel from "../AdminPanel/AdminPanel";
import ForgotPassword from "../pages/LoginPage/ForgotPassword";
import RestaurantForm from "../AdminPanel/RestaurantForm";
import ItemGroupCRUD from "../AdminPanel/ItemGroupCRUD";
import ItemCRUD from "../AdminPanel/ItemCRUD";

// AppRoutes.jsx updates

const AppRoutes = () => {
  const navigate = useNavigate();

  const [itemGroups, setItemGroups] = useState([]);
  const [items, setItems] = useState([]);

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  const [restaurant, setRestaurant] = useState(() => {
    const saved = localStorage.getItem("currentRestaurant");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (
      localStorage.getItem("currentRestaurant") &&
      window.location.pathname === "/AdminPanel"
    ) {
      navigate("/AdminPanel/restaurant");
    }
  }, [navigate]);

  return (
    <Routes>
      {/* 1. UPDATE: Redirect from Hero to AdminPanel if already logged in */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/AdminPanel/restaurant" replace />
          ) : (
            <Hero />
          )
        }
      />

      <Route path="/register" element={<RegistrationPage />} />

      {/* 2. UPDATE: Prevent logged-in users from going back to Login page */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/AdminPanel/restaurant" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* ⭐ UPDATED: AdminPanel now checks if user is logged in ⭐ */}
      <Route
        path="/AdminPanel"
        element={
          isLoggedIn ? (
            <AdminPanel restaurant={restaurant} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="restaurant" replace />} />

        <Route
          path="restaurant"
          element={<RestaurantForm restaurant={restaurant} />}
        />

        <Route
          path="item-groups"
          element={
            <ItemGroupCRUD
              itemGroups={itemGroups}
              setItemGroups={setItemGroups}
            />
          }
        />

        <Route
          path="items"
          element={
            <ItemCRUD
              items={items}
              setItems={setItems}
              itemGroups={itemGroups}
            />
          }
        />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
