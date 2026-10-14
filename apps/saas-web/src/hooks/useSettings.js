import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { changePasswordSchema, profileSchema } from "../utils/validation";

export function useSettings() {
  const [user, setUser] = useState(() => api.auth.getCurrentUser());
  const [activeTab, setActiveTab] = useState("general");

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const email = user?.email || "";

  useEffect(() => {
    if (!user) {
      api.auth.init().then((u) => {
        if (u) {
          setUser(u);
          setFirstName(u.firstName || "");
          setLastName(u.lastName || "");
        }
      });
    }
    const handleAuth = () => {
      const u = api.auth.getCurrentUser();
      setUser(u);
      if (u) {
        setFirstName(u.firstName || "");
        setLastName(u.lastName || "");
      }
    };
    window.addEventListener("auth:login", handleAuth);
    return () => window.removeEventListener("auth:login", handleAuth);
  }, [user]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const isProfileDirty =
    firstName.trim() !== (user?.firstName || "").trim() ||
    lastName.trim() !== (user?.lastName || "").trim();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const validation = profileSchema.safeParse({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    if (!validation.success) {
      return setProfileError(validation.error.issues[0].message);
    }

    setProfileLoading(true);
    try {
      await api.auth.updateProfile(firstName.trim(), lastName.trim());
      setProfileSuccess("Profile details updated successfully!");
      setTimeout(() => setProfileSuccess(""), 2000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      return setError(validation.error.issues[0].message);
    }

    setLoading(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully! Logging you out...");

      setTimeout(async () => {
        await api.auth.logout();
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    user,
    activeTab,
    setActiveTab,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrent,
    setShowCurrent,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    error,
    success,
    loading,
    profileSuccess,
    profileError,
    profileLoading,
    isProfileDirty,
    handleProfileUpdate,
    handlePasswordChange,
  };
}
