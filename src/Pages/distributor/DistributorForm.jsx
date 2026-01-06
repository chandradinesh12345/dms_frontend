import { useState } from "react";
import { Upload, User, Building2, MapPin, FileText } from "lucide-react";
import "../../assets/css/DistributorForm.css";
import { ArrowRight, Send } from "lucide-react";
import logo from "../../assets/images/AutozCrave.png";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function DistributorForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    distributorName: "",
    companyName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    businessType: "",
    experience: "",
    turnover: "",
    productsCategory: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    aadhaarNumber: "",
  });

  const [files, setFiles] = useState({
    gstCertificate: null,
    panCard: null,
    businessCertificate: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // already logged in → kick out
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "distributor")
        navigate("/distributor/dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({
        ...files,
        [fieldName]: file,
      });
      if (errors[fieldName]) {
        setErrors({
          ...errors,
          [fieldName]: "",
        });
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.distributorName.trim())
        newErrors.distributorName = "Distributor name is required";
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name is required";
      if (!formData.contactPerson.trim())
        newErrors.contactPerson = "Contact person name is required";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }

      const mobileRegex = /^[0-9]{10}$/;
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!mobileRegex.test(formData.mobile)) {
        newErrors.mobile = "Mobile number must be 10 digits";
      }

      if (
        formData.alternateMobile &&
        !mobileRegex.test(formData.alternateMobile)
      ) {
        newErrors.alternateMobile = "Alternate mobile must be 10 digits";
      }
    } else if (step === 2) {
      if (!formData.businessType)
        newErrors.businessType = "Business type is required";
      if (!formData.experience) {
        newErrors.experience = "Years of experience is required";
      } else if (formData.experience < 0) {
        newErrors.experience = "Experience cannot be negative";
      }
      if (!formData.turnover) {
        newErrors.turnover = "Annual turnover is required";
      } else if (
        isNaN(formData.turnover) ||
        parseFloat(formData.turnover) < 0
      ) {
        newErrors.turnover = "Please enter a valid positive number";
      }
      if (!formData.productsCategory.trim())
        newErrors.productsCategory = "Products category is required";
    } else if (step === 3) {
      if (!formData.address1.trim())
        newErrors.address1 = "Address line 1 is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";

      const pincodeRegex = /^[0-9]{6}$/;
      if (!formData.pincode.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (!pincodeRegex.test(formData.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
    } else if (step === 4) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!formData.gstNumber.trim()) {
        newErrors.gstNumber = "GST number is required";
      } else if (!gstRegex.test(formData.gstNumber)) {
        newErrors.gstNumber = "Invalid GST format (e.g., 22AAAAA0000A1Z5)";
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!formData.panNumber.trim()) {
        newErrors.panNumber = "PAN number is required";
      } else if (!panRegex.test(formData.panNumber)) {
        newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
      }

      if (formData.aadhaarNumber) {
        const aadhaarRegex = /^[0-9]{12}$/;
        if (!aadhaarRegex.test(formData.aadhaarNumber)) {
          newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
        }
      }

      if (!files.gstCertificate)
        newErrors.gstCertificate = "GST certificate is required";
      if (!files.panCard) newErrors.panCard = "PAN card is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const formPayload = new FormData();

      // append text fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          formPayload.append(key, formData[key]);
        }
      });

      // append files
      if (files.gstCertificate)
        formPayload.append("gstCertificate", files.gstCertificate);

      if (files.panCard) formPayload.append("panCard", files.panCard);

      if (files.businessCertificate)
        formPayload.append("businessCertificate", files.businessCertificate);

      const response = await api.post(
        "/temp-distributor/register",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        toast.success(
          response.data.message || "Registration submitted successfully"
        );

        setTimeout(() => {
          navigate("/verify-email-otp", {
            state: {
              email: formData.email,
            },
          });
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        const data = error.response.data;

        if (error.response.status === 422) {
          let messages = [];

          if (data.errors) {
            Object.values(data.errors).forEach((arr) => {
              messages.push(arr[0]);
            });
          } else if (data.message) {
            messages.push(data.message);
          }

          toast.error(messages.join(" • "));
        } else {
          toast.error(data.message || "Server error occurred");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-wrapper">
        <div className="form-card">
          <div className="form-header">
            <div className="header-logo">
              <img
                src={logo}
                alt="Company Logo"
                className="logo-image"
              />
            </div>
            <div className="header-text">
              <h1>Distributor Onboarding</h1>
              <p>Fill in your details to become our partner</p>
            </div>
          </div>

          <div className="form-body">
            <div className="step-indicator">
              <div
                className="progress-line"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
              {[1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  className={`step ${
                    s < currentStep
                      ? "completed"
                      : currentStep === s
                      ? "active"
                      : ""
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* 1. Basic Information */}
            {currentStep === 1 && (
              <section className="form-section">
                <div className="section-header">
                  <User className="section-icon" />
                  <h2 className="section-title">Basic Information</h2>
                </div>

                <div className="form-grid phone_view_grid">
                  <div className="form-field">
                    <label className="form-label">
                      Distributor Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="distributorName"
                      value={formData.distributorName}
                      onChange={handleInputChange}
                      placeholder="Enter distributor name"
                      required
                      className={`form-input ${
                        errors.distributorName ? "error" : ""
                      }`}
                    />
                    {errors.distributorName && (
                      <span className="error-message">
                        {errors.distributorName}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Company / Firm Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company / firm name"
                      className={`form-input ${
                        errors.companyName ? "error" : ""
                      }`}
                    />
                    {errors.companyName && (
                      <span className="error-message">
                        {errors.companyName}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Contact Person Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Enter contact person name"
                      className={`form-input ${
                        errors.contactPerson ? "error" : ""
                      }`}
                    />
                    {errors.contactPerson && (
                      <span className="error-message">
                        {errors.contactPerson}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className={`form-input ${errors.email ? "error" : ""}`}
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Mobile Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="10 digit number"
                      maxLength="10"
                      className={`form-input ${errors.mobile ? "error" : ""}`}
                    />
                    {errors.mobile && (
                      <span className="error-message">{errors.mobile}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Alternate Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={handleInputChange}
                      placeholder="10 digit number"
                      maxLength="10"
                      className={`form-input ${
                        errors.alternateMobile ? "error" : ""
                      }`}
                    />
                    {errors.alternateMobile && (
                      <span className="error-message">
                        {errors.alternateMobile}
                      </span>
                    )}
                  </div>
                </div>
                <div className="step-btn-wrapper current_btn">
                  <button type="button" className="btn next" onClick={nextStep}>
                    Next <ArrowRight className="btn-icon" />
                  </button>
                </div>
              </section>
            )}

            {/* 2. Business Details */}
            {currentStep === 2 && (
              <section className="form-section">
                <div className="section-header">
                  <Building2 className="section-icon" />
                  <h2 className="section-title">Business Details</h2>
                </div>

                <div className="form-grid phone_view_grid">
                  <div className="form-field">
                    <label className="form-label">
                      Business Type <span className="required">*</span>
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`form-select ${
                        errors.businessType ? "error" : ""
                      }`}
                    >
                      <option value="">Select Business Type</option>
                      <option value="individual">Individual</option>
                      <option value="proprietorship">Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="pvt-ltd">Pvt. Ltd. / LLP</option>
                    </select>
                    {errors.businessType && (
                      <span className="error-message">
                        {errors.businessType}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Years of Experience <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Years of experience"
                      min="0"
                      step="1"
                      className={`form-input ${
                        errors.experience ? "error" : ""
                      }`}
                    />
                    {errors.experience && (
                      <span className="error-message">{errors.experience}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Annual Turnover (in Lakhs){" "}
                      <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      name="turnover"
                      value={formData.turnover}
                      onChange={handleInputChange}
                      placeholder="e.g., 10"
                      min="0"
                      step="0.01"
                      className={`form-input ${errors.turnover ? "error" : ""}`}
                    />
                    {errors.turnover && (
                      <span className="error-message">{errors.turnover}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Products Category Interested In{" "}
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="productsCategory"
                      value={formData.productsCategory}
                      onChange={handleInputChange}
                      placeholder="Enter products category"
                      className={`form-input ${
                        errors.productsCategory ? "error" : ""
                      }`}
                    />
                    {errors.productsCategory && (
                      <span className="error-message">
                        {errors.productsCategory}
                      </span>
                    )}
                  </div>
                </div>
                <div className="step-btn-wrapper">
                  <button type="button" className="btn prev" onClick={prevStep}>
                    Previous
                  </button>
                  <button type="button" className="btn next" onClick={nextStep}>
                    Next <ArrowRight className="btn-icon" />
                  </button>
                </div>
              </section>
            )}

            {/* 3. Address Details */}
            {currentStep === 3 && (
              <section className="form-section">
                <div className="section-header">
                  <MapPin className="section-icon" />
                  <h2 className="section-title">Address Details</h2>
                </div>

                <div className="form-grid phone_view_grid">
                  <div className="form-field form-grid-full">
                    <label className="form-label">
                      Address Line 1 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address1"
                      value={formData.address1}
                      onChange={handleInputChange}
                      placeholder="Enter address line 1"
                      className={`form-input ${errors.address1 ? "error" : ""}`}
                    />
                    {errors.address1 && (
                      <span className="error-message">{errors.address1}</span>
                    )}
                  </div>

                  <div className="form-field form-grid-full">
                    <label className="form-label">Address Line 2</label>
                    <input
                      type="text"
                      name="address2"
                      value={formData.address2}
                      onChange={handleInputChange}
                      placeholder="Enter address line 2 (optional)"
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      City <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className={`form-input ${errors.city ? "error" : ""}`}
                    />
                    {errors.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      State <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      className={`form-input ${errors.state ? "error" : ""}`}
                    />
                    {errors.state && (
                      <span className="error-message">{errors.state}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Country <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                      className={`form-input ${errors.country ? "error" : ""}`}
                    />
                    {errors.country && (
                      <span className="error-message">{errors.country}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Pincode <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter 6 digit pincode"
                      maxLength="6"
                      className={`form-input ${errors.pincode ? "error" : ""}`}
                    />
                    {errors.pincode && (
                      <span className="error-message">{errors.pincode}</span>
                    )}
                  </div>
                </div>
                <div className="step-btn-wrapper">
                  <button type="button" className="btn prev" onClick={prevStep}>
                    Previous
                  </button>
                  <button type="button" className="btn next" onClick={nextStep}>
                    Next <ArrowRight className="btn-icon" />
                  </button>
                </div>
              </section>
            )}

            {/* 4. Legal & Verification Details */}
            {currentStep === 4 && (
              <section className="form-section">
                <div className="section-header">
                  <FileText className="section-icon" />
                  <h2 className="section-title">
                    Legal & Verification Details
                  </h2>
                </div>

                <div className="form-grid phone_view_grid">
                  <div className="form-field">
                    <label className="form-label">
                      GST Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 22AAAAA0000A1Z5"
                      maxLength="15"
                      className={`form-input ${
                        errors.gstNumber ? "error" : ""
                      }`}
                    />
                    {errors.gstNumber && (
                      <span className="error-message">{errors.gstNumber}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      PAN Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., ABCDE1234F"
                      maxLength="10"
                      className={`form-input ${
                        errors.panNumber ? "error" : ""
                      }`}
                    />
                    {errors.panNumber && (
                      <span className="error-message">{errors.panNumber}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Aadhaar Number</label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 12 digit aadhaar number"
                      maxLength="12"
                      className={`form-input ${
                        errors.aadhaarNumber ? "error" : ""
                      }`}
                    />
                    {errors.aadhaarNumber && (
                      <span className="error-message">
                        {errors.aadhaarNumber}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      GST Certificate Upload <span className="required">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "gstCertificate")}
                      className={`file-upload-input ${
                        errors.gstCertificate ? "error" : ""
                      }`}
                    />
                    {errors.gstCertificate && (
                      <span className="error-message">
                        {errors.gstCertificate}
                      </span>
                    )}
                    {files.gstCertificate && (
                      <span className="file-success">
                        ✓ {files.gstCertificate.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      PAN Card Upload <span className="required">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "panCard")}
                      className={`file-upload-input ${
                        errors.panCard ? "error" : ""
                      }`}
                    />
                    {errors.panCard && (
                      <span className="error-message">{errors.panCard}</span>
                    )}
                    {files.panCard && (
                      <span className="file-success">
                        ✓ {files.panCard.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-label">
                      Aadhaar Card Upload <span className="required">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(e, "businessCertificate")
                      }
                      className="file-upload-input"
                    />
                    {files.businessCertificate && (
                      <span className="file-success">
                        ✓ {files.businessCertificate.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="step-btn-wrapper">
                  <button type="button" className="btn prev" onClick={prevStep}>
                    Previous
                  </button>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Registration"}
                  </button>
                </div>
              </section>
            )}
            <p className="register-link">
              Have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
