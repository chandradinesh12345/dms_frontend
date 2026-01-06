import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
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

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-header">
          <img src={logo} alt="logo" />
          <h1>Reset Password</h1>
          <p>Create a new password</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="form-field">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="auth-footer">
            <Link to="/">Back to Login</Link>
          </div>
        </form>

      </div>
    </div>
  );
};
