import React from "react";
import "../../assets/css/ThankYou.css"


export const ThankYou = () => {
  return (
    <div className="thankyou-wrapper">
      <div className="thankyou-card">
        <div className="checkmark">
          ✓
        </div>

        <h1>Thank You!</h1>
        <p>
          Your request has been successfully submitted.  
          Our team will contact you shortly.
        </p>

        <div className="info-box">
          <span>📦</span>
          <p>
            We appreciate your trust in our services and look forward
            to serving you with excellence.
          </p>
        </div>

        <div className="action-btns">
          <a href="/" className="btn primary">Back to Home</a>
          <a href="/contact" className="btn outline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};
