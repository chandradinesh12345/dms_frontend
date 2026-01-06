import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { toast } from "react-toastify";

export default function DistributorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api.get("/distributor/dashboard").then((res) => {
      console.log("Authorized:", res.data);
    });
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    localStorage.clear();

    navigate("/", { replace: true });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Distributor Dashboard</h1>

      <p>
        Welcome, <strong>{user?.name}</strong> 👋
      </p>
      <p>Email: {user?.email}</p>

      <div style={{ marginTop: "20px" }}>
        <ul>
          <li>✔ View Product Catalog</li>
          <li>✔ Create Orders</li>
          <li>✔ Track Order Status</li>
          <li>✔ View Payments & Credit Limit</li>
          <li>✔ Profile & KYC Status</li>
        </ul>

        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
