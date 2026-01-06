import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import "../../assets/css/login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/images/AutozCrave.png";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // 🔒 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      if (role === "distributor")
        navigate("/distributor/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // 🛑 hard guard

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await api.post("/login", formData);

      if (res.data.status) {
        const { token, role, user } = res.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successful");

        if (role === "admin") navigate("/admin/dashboard", { replace: true });
        else if (role === "distributor")
          navigate("/distributor/dashboard", { replace: true });
        else toast.error("Invalid role");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (

    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="header-logo">
              <img
                src={logo}
                alt="Company Logo"
                className="logo-image"
              />
            </div>
            <div className="header-text">
              <h1>Welcome to</h1>
              <p>Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-section">
              <div className="section-header">
                <User className="section-icon" />
                <h2 className="section-title">Distributor Login</h2>
              </div>

              <div className="form-grid_login">
                <div className="form-field">
                  <label className="form-label">
                    User Id <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your User Id"
                    className={`form-input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`form-input ${errors.password ? "error" : ""}`}
                  />
                  {/* EYE ICON */}
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>

                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>
              </div>

              <div className="login-actions">
                <button
                  type="submit"
                  className="btn login-btn"
                  disabled={isLoading}
                >
                  <Lock className="btn-icon" />
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>

              <div className="login-links">
                <Link to="/forgotpassword" className="forgot-password">
                  Forgot Password?
                </Link>
                <p className="register-link">
                  Don't have an account?{" "}
                  <Link to="/distributorform">Register here</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
