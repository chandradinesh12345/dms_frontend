import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import logo from "../../assets/images/AutozCrave.png";
import "../../assets/css/AuthPassword.css";

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!token || !email) {
  //     toast.error("Invalid reset link");
  //     navigate("/");
  //   }
  // }, [token, email, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirm)
      return toast.error("Passwords do not match");
    if (loading) return;

    setLoading(true);
    try {
      const res = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: confirm,
      });
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };


  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
              <h1>Reset Password</h1>
              <p>Create a new password</p>
            </div>
          </div>


        <form className="login-form" onSubmit={submit}>
          <div className="form-section">
          <div className="form-field">
            <label className="form-label">New Password</label>
            <input
              type={showNew ? "text" : "password"}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
            className="eye-icon"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          </div>

          <div className="form-field">
            <label className="form-label">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              className="form-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {/* EYE ICON */}
               <span
            className="eye-icon"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
          </div>

          <button className="btn login-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="auth-footer">
            <Link to="/">Back to Login</Link>
          </div>
          </div>
        </form>

      </div>
    </div>
    </div>
  );
};
