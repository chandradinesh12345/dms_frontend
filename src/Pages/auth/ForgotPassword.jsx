import { useState } from 'react';
import { Mail } from 'lucide-react';
import "../../assets/css/ForgotPassword.css";
import { Link } from 'react-router-dom';
import logo from "../../assets/images/AutozCrave.png";
import api from "../../services/api";
import { toast } from "react-toastify";


export const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  
const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm() || isLoading) return;

  setIsLoading(true);

  try {
    const res = await api.post("/forgot-password", formData);
    toast.success(res.data.message);
    setFormData({ email: "" });
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="header-logo">
              <img src={logo} alt="Company Logo" className="logo-image" />
              
            </div>
            <div className="header-text">
            <h1>Forgot Password</h1>
            <p>Enter your email to reset your password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-section">
              <div className="section-header">
                <Mail className="section-icon" />
                <h2 className="section-title">Reset Password</h2>
              </div>

              <div className="form-grid_login">
                <div className="form-field">
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="login-actions">
             <button
              type="submit"
              className="btn login-btn"
              disabled={isLoading}
            >
              <Mail className="btn-icon" />
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

              </div>

              <div className="login-links">
                <p className="register-link">
                  Remember your password? <Link to="/">Back to Login</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
