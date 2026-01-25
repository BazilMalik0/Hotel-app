import React, { useCallback, useState } from "react";
import styles from "./RegistrationPage.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import Snackbar from "./../../util/Snackbar.jsx";
import NavBar from "../../Components/Header/NavBar.jsx";

function RegistrationPage({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const [submitButtonState, setSubmitButtonState] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  // 💡 State Updated: Added 'address'
  const [formData, setFormData] = useState({
    hotelName: "",
    contact: "",
    email: "",
    address: "", // <-- NEW: Added address field
    logoFile: null,
  });
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);

  // Function to close the Snackbar
  const handleSnackbarClose = useCallback(() => {
    setIsSnackbarOpen(false);
    setSnackbarMessage(""); // Clear the message when closing
  }, []);

  // ... (validate, handleChange, handleFileChange remain the same) ...
  const validate = () => {
    // ... (Validation logic remains the same) ...
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[\d\s\-\+()]+$/;

    if (!formData.hotelName || formData.hotelName.length < 3) {
      newErrors.hotelName = "Venue name must be at least 3 characters.";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid administrator email address.";
    }

    if (
      !formData.contact ||
      !contactRegex.test(formData.contact) ||
      formData.contact.length < 10
    ) {
      newErrors.contact =
        "Please enter a valid contact number (min 10 digits/characters).";
    }

    // <-- NEW: Added validation for address field
    if (!formData.address || formData.address.length < 10) {
      newErrors.address =
        "Please enter the full venue address (min 10 characters).";
    }
    // NEW: End of address validation

    if (!formData.logoFile) {
      newErrors.logoFile = "Venue logo is required for registration.";
    }

    if (formData.logoFile) {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(formData.logoFile.type)) {
        newErrors.logoFile = "Logo must be a PNG, JPEG, or WebP file.";
      } else if (formData.logoFile.size > maxSize) {
        newErrors.logoFile = "Logo size must not exceed 2MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setErrors((prev) => ({ ...prev, logoFile: null }));
      setFormData((prev) => ({ ...prev, logoFile: file }));
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, logoFile: null }));
      setLogoPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitButtonState(false);
    // 1. Close any existing snackbar before submitting
    handleSnackbarClose();

    if (validate()) {
      const formDataToSend = new FormData();
      formDataToSend.append("hotelName", formData.hotelName);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("logoFile", formData.logoFile);

      fetch("http://localhost:5000/register", {
        method: "POST",
        body: formDataToSend,
      })
        .then(async (res) => {
          const data = res.json;
          if (res.ok) {
            return data;
          } else if (res.status == 409) {
            const errMessage = "Sorry the user is already existing";
            // 2. Set the snackbar message and open the snackbar
            setSnackbarMessage(errMessage);
            setIsSnackbarOpen(true);
            throw new Error(errMessage);
          } else {
            // Handle other server errors (e.g., 500)
            const errMessage =
              data.error || `Server error (${res.status}). Please try again.`;
            setSnackbarMessage(errMessage);
            setIsSnackbarOpen(true);
            throw new Error(errMessage);
          }
        })
        .then((data) => {
          console.log(data);
          setFormData({
            hotelName: "",
            contact: "",
            email: "",
            address: "", // <-- NEW: Added address field
            logoFile: null,
          });
          setSubmitButtonState(true);
          //Redirect to login
          navigate("../login", {
            state: {
              message:
                "Registration successful!\nYou will be contacted soon...",
            },
          });
        })
        .catch((err) => {
          console.log(err);
          setSubmitButtonState(true);
        });
    } else {
      setSubmitButtonState(true);
      console.log("Validation Failed.");
    }
  };

  return (
    // ... (JSX remains the same) ...
    <>
      <div className={styles.registrationPage}>
        <div className={styles.registrationCard}>
          <h1 className={styles.formTitle}>Register Your Restaurant Hub</h1>
          <p className={styles.formSubtitle}>
            Create your administrator account to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className={styles.registrationForm}>
            {/* 1. Hotel Name */}
            <div className={styles.inputGroup}>
              <label htmlFor="hotelName" className={styles.label}>
                Hotel/Restaurant Name *
              </label>
              <input
                type="text"
                id="hotelName"
                name="hotelName"
                className={`${styles.inputField} ${
                  errors.hotelName ? styles.inputError : ""
                }`}
                placeholder="Enter venue name"
                value={formData.hotelName}
                onChange={handleChange}
                required
              />
              {errors.hotelName && (
                <p className={styles.errorMessage}>{errors.hotelName}</p>
              )}
            </div>

            {/* 2. Contact Number */}
            <div className={styles.inputGroup}>
              <label htmlFor="contact" className={styles.label}>
                Contact Number *
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                className={`${styles.inputField} ${
                  errors.contact ? styles.inputError : ""
                }`}
                placeholder="e.g., +91 3XX XXXXXXX"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              {errors.contact && (
                <p className={styles.errorMessage}>{errors.contact}</p>
              )}
            </div>

            {/* 3. Email Address */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address (Admin) *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`${styles.inputField} ${
                  errors.email ? styles.inputError : ""
                }`}
                placeholder="Enter administrator email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className={styles.errorMessage}>{errors.email}</p>
              )}
            </div>

            {/* 4. Venue Address (NEW FIELD) */}
            <div className={styles.inputGroup}>
              <label htmlFor="address" className={styles.label}>
                Venue Address *
              </label>
              <textarea // Use textarea for multi-line address input
                id="address"
                name="address"
                rows="3"
                className={`${styles.inputField} ${
                  errors.address ? styles.inputError : ""
                }`}
                placeholder="Enter full street address, city, and zip code"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
              {errors.address && (
                <p className={styles.errorMessage}>{errors.address}</p>
              )}
            </div>
            {/* --------------------------- */}

            {/* 5. Logo Upload with Preview (Index shifted) */}
            <div className={styles.inputGroup}>
              <label htmlFor="logo" className={styles.label}>
                Upload Venue Logo *
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                className={styles.fileInput}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
              />
              {errors.logoFile && (
                <p className={styles.errorMessage}>{errors.logoFile}</p>
              )}

              {/* Logo Preview Section */}
              {logoPreview && (
                <div className={styles.logoPreviewContainer}>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className={styles.logoPreview}
                  />
                  <p className={styles.logoFileName}>
                    {formData.logoFile?.name}
                  </p>
                </div>
              )}
              {/* Show file name if no preview possible but file exists */}
              {!logoPreview && formData.logoFile && (
                <p className={styles.logoFileName}>{formData.logoFile.name}</p>
              )}
            </div>

            <button
              type="submit"
              className={classNames(styles.submitButton, {
                [styles.disabledButton]: !submitButtonState,
              })}
              disabled={!submitButtonState}
            >
              {submitButtonState ? "Register Hub" : "Registering Hub ..."}
            </button>
            {/* Login text under button */}
            <p className={styles.loginText}>
              I already have an account?{" "}
              <Link to="/login" className={styles.loginLink}>
                Login
              </Link>
            </p>

            {/* Already exists error */}
            {errors.accountExists && (
              <p className={styles.accountExistsMessage}>
                {errors.accountExists}
              </p>
            )}
          </form>
        </div>
        <Snackbar
          message={snackbarMessage}
          isOpen={isSnackbarOpen}
          onClose={handleSnackbarClose}
        />
      </div>
    </>
  );
}

export default RegistrationPage;
