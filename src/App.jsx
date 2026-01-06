import React from "react";
import { ForgotPassword } from "./Pages/auth/ForgotPassword";
import { Login } from "./Pages/auth/Login";
import { ThankYou } from "./Pages/distributor/Thankyou";
import { Routes, Route } from "react-router-dom";
import DistributorForm from "./Pages/distributor/DistributorForm";
import DistributorDashboard from "./Pages/distributor/Dashboard";
import AdminDashboard from "./Pages/admin/Dashboard";
import VerifyEmailOtp from "./Pages/distributor/VerifyEmailOtp";
import ProtectedRoute from "./route/ProtectedRoute";
import { ResetPassword } from "./Pages/auth/ResetPassword";
function App() {
  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
         <Route path="/distributorform" element={<DistributorForm />} />
        <Route path="/thankyou" element={<ThankYou />} />
         <Route
          path="/verify-email-otp"
          element={<VerifyEmailOtp />}
        />

         {/* Distributor */}
      <Route
        path="/distributor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["distributor"]}>
            <DistributorDashboard />
          </ProtectedRoute>
        }
      />
        

       {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      
      </Routes>
    </>
  );
}

export default App;
