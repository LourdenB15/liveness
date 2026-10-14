import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { forgotPasswordSchema } from "../utils/validation";

export function useForgotPassword({ modal = false } = {}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = useCallback(() => {
    navigate(location.state?.backgroundLocation?.pathname || "/", {
      replace: true,
    });
  }, [navigate, location.state]);

  useEffect(() => {
    if (!modal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modal, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccessMessage("");

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setFieldErrors({ email: validation.error.issues[0].message });
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.forgotPassword(email);
      setSuccessMessage(
        response?.message || "Password reset link sent to your email address.",
      );
    } catch (err) {
      setError(err.message || "Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasFieldErrors = Object.keys(fieldErrors).some(
    (key) => fieldErrors[key],
  );

  return {
    email,
    setEmail,
    error,
    fieldErrors,
    setFieldErrors,
    successMessage,
    loading,
    handleClose,
    handleSubmit,
    hasFieldErrors,
    location,
  };
}
