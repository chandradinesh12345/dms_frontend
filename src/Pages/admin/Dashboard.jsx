import React, { useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

     useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => {
        console.log("Authorized:", res.data);
      });
  }, []);

   const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <p>
        Welcome, <strong>{user?.name}</strong> 👋
      </p>
      <p>Email: {user?.email}</p>

      <div style={{ marginTop: "20px" }}>
        <ul>
          <li>✔ Manage Distributors</li>
          <li>✔ Approve / Reject Distributor Registrations</li>
          <li>✔ Manage Products & Pricing</li>
          <li>✔ View Orders & Payments</li>
          <li>✔ Reports & Analytics</li>
        </ul>

         <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
