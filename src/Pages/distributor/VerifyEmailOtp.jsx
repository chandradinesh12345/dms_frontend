import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import OtpInput from "../../components/OtpInput";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/login.css";

export default function VerifyEmailOtp() {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const navigate = useNavigate();
  const location = useLocation();

  const [canResend, setCanResend] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 min
  const [resendLoading, setResendLoading] = useState(false);

  const email = location.state?.email;
  const [loading, setLoading] = useState(false);

  if (!email) {
    toast.error("Email missing. Please register again.");
    navigate("/");
    return null;
  }

  const handleOtpComplete = async (otp) => {
    setLoading(true);

    try {
      const res = await api.post("/temp-distributor/verify-email-otp", {
        email,
        otp,
      });

      if (res.data.status) {
        toast.success(res.data.message);
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);

    try {
      const res = await api.post("/temp-distributor/resend-email-otp", {
        email,
      });

      toast.success(res.data.message);

      // reset timer
      setSecondsLeft(600);
      setCanResend(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="header-logo">
              <img
                src="/Image/AutozCrave.png"
                alt="AutozCrave"
                className="logo-image"
              />
            </div>
            <div className="header-text">
              <h1>Email Verification</h1>
              <p>Enter the 6-digit OTP sent to</p>
              <strong>{email}</strong>
            </div>
          </div>

          <div className="login-form">
            <OtpInput
              length={6}
              onComplete={handleOtpComplete}
              disabled={loading}
            />

            {loading && (
              <p style={{ marginTop: 16, textAlign: "center" }}>
                Verifying OTP...
              </p>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            {!canResend ? (
              <p style={{ fontSize: 14 }}>
                Resend OTP in <strong>{formatTime(secondsLeft)}</strong>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="btn login-btn"
                disabled={resendLoading}
              >
                {resendLoading ? "Sending OTP..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
