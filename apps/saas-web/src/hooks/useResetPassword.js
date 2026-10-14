import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { resetPasswordSchema } from "../utils/validation";

export function useResetPassword({ modal = false } = {}) {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = useCallback(() => {
    navigate(location.state?.backgroundLocation?.pathname || "/", {
      replace: true,
    });
  }, [navigate, location.state]);

  useEffect(() => {
    if (!tokenFromUrl) {
      // No token in URL: redirect back to forgot-password
      navigate("/forgot-password", { replace: true });
    }
  }, [tokenFromUrl, navigate]);

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

    const validation = resetPasswordSchema.safeParse({
      token: tokenFromUrl,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      return setError(validation.error.issues[0].message);
    }

    setLoading(true);
    try {
      await api.auth.resetPassword(tokenFromUrl, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    tokenFromUrl,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    loading,
    handleClose,
    handleSubmit,
    location,
  };
}
