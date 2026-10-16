import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { loginSchema } from "../utils/validation";

export function useLogin({ modal = false } = {}) {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const sessionExpired = location.state?.sessionExpired;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    sessionExpired ? "Your session has expired. Please sign in again." : "",
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate(location.state?.backgroundLocation?.pathname || "/", {
      replace: true,
    });
  }, [navigate, location.state]);

  // Close modal on Escape key
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

    const validation = loginSchema.safeParse({ username, password });
    if (!validation.success) {
      const formattedErrors = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0]] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setLoading(true);
    try {
      await api.auth.login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasFieldErrors = Object.keys(fieldErrors).some(
    (key) => fieldErrors[key],
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    fieldErrors,
    setFieldErrors,
    loading,
    showPassword,
    setShowPassword,
    hasFieldErrors,
    sessionExpired,
    location,
    handleClose,
    handleSubmit,
  };
}
