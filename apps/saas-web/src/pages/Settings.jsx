import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { api } from "../services/api";

const BANNED_WORDS = [
  "fuck",
  "shit",
  "ass",
  "bitch",
  "bastard",
  "damn",
  "cunt",
  "dick",
  "cock",
  "piss",
  "slut",
  "whore",
  "nigger",
  "faggot",
];
const containsBannedWord = (val) =>
  BANNED_WORDS.some((w) => val.toLowerCase().includes(w));
const nameRule = z
  .string()
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be 50 characters or fewer")
  .regex(
    /^[a-zA-Z\s\-']+$/,
    "Only letters, spaces, hyphens, and apostrophes allowed",
  )
  .refine((val) => !containsBannedWord(val), {
    message: "Name contains inappropriate language",
  });

const profileSchema = z.object({
  firstName: nameRule,
  lastName: nameRule,
});

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .max(72, "Password must not exceed 72 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(72, "Password must not exceed 72 characters")
      .regex(/[A-Z]/, "Password must have at least 1 upper case letter.")
      .regex(/[a-z]/, "Password must have at least 1 lower case letter.")
      .regex(/[0-9]/, "Password must have at least 1 number."),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export default function Settings() {
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

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Account & Security Settings
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Manage your administrator profile, access credentials, and
            authentication security.
          </p>
        </div>
      </div>

      {/* Sub-navigation Tabs: Segmented Control */}
      <div
        role="tablist"
        aria-label="Settings categories"
        className="inline-flex items-center gap-0.5 rounded-md border border-slate-200/80 bg-slate-100/80 p-0.5"
      >
        <button
          role="tab"
          aria-selected={activeTab === "general"}
          onClick={() => setActiveTab("general")}
          className={`flex cursor-pointer items-center gap-2 rounded-[4px] border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
            activeTab === "general"
              ? "border-slate-200/80 bg-white font-bold text-slate-900 shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <User
            className={`h-4 w-4 shrink-0 ${activeTab === "general" ? "text-[#2f5bf5]" : "text-slate-400"}`}
          />
          <span>General Profile</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "security"}
          onClick={() => setActiveTab("security")}
          className={`flex cursor-pointer items-center gap-2 rounded-[4px] border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
            activeTab === "security"
              ? "border-slate-200/80 bg-white font-bold text-slate-900 shadow-2xs"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Lock
            className={`h-4 w-4 shrink-0 ${activeTab === "security" ? "text-[#2f5bf5]" : "text-slate-400"}`}
          />
          <span>Security & Credentials</span>
        </button>
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === "general" && (
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* User Profile Card */}
          <div className="lg:col-span-4">
            <div className="rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2f5bf5] text-base font-bold text-white shadow-xs">
                  {`${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() ||
                    "AD"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading truncate text-base font-bold text-slate-900">
                    {user
                      ? `${user.firstName} ${user.lastName}`
                      : "Administrator"}
                  </p>
                  <p className="truncate font-mono text-xs font-medium text-slate-500">
                    @{user?.username || "admin"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3.5 border-t border-slate-100 pt-6 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2 font-medium text-slate-500">
                    <User className="h-4 w-4 text-slate-400" />
                    Email Address
                  </span>
                  <span className="max-w-37.5 truncate font-mono text-xs font-semibold text-slate-900">
                    {user?.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-8">
            <div className="rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#2f5bf5] shadow-2xs">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900">
                    Personal Profile Details
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Update your display name and contact email address.
                  </p>
                </div>
              </div>

              {profileSuccess && (
                <div
                  role="status"
                  className="animate-in fade-in mb-4 flex items-center gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 duration-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form
                onSubmit={handleProfileUpdate}
                className="max-w-lg space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:bg-white focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
                      placeholder="Admin"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:bg-white focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
                      placeholder="User"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold tracking-wider text-slate-700 uppercase"
                    >
                      Email Address (Primary Identity)
                    </label>
                    <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-slate-400 uppercase">
                      <Lock className="h-3 w-3" /> Managed by Auth Provider
                    </span>
                  </div>
                  <input
                    id="email"
                    type="email"
                    disabled
                    value={email}
                    className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-100/70 px-3.5 py-2 font-mono text-xs font-medium text-slate-500 shadow-2xs select-none"
                  />
                  <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                    Your email address is your primary account identifier.
                  </p>
                </div>

                {profileError && (
                  <p
                    role="alert"
                    className="text-xs font-semibold text-rose-600"
                  >
                    {profileError}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading || !isProfileDirty}
                    className="cursor-pointer rounded-md bg-[#2f5bf5] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#204be8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {profileLoading
                      ? "Saving Profile..."
                      : "Save Profile Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Credentials */}
      {activeTab === "security" && (
        <div className="max-w-3xl">
          {/* Change Password Form */}
          <div>
            <div className="rounded-[10px] border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-[#2f5bf5] shadow-2xs">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-slate-900">
                    Authentication Credentials
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Update your administrative password to maintain platform
                    security.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePasswordChange}
                className="max-w-lg space-y-4"
              >
                {error && (
                  <div
                    role="alert"
                    className="animate-in fade-in flex items-center gap-2.5 rounded-md border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 duration-200"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="animate-in fade-in flex items-center gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700 duration-200"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
                  >
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 pr-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:bg-white focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showCurrent ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
                  >
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 pr-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:bg-white focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {newPassword && (
                    <div className="mt-2 text-[11px] font-semibold">
                      {newPassword.length < 6 ? (
                        <span className="text-rose-700">
                          Too short (min 6 chars)
                        </span>
                      ) : (
                        <span className="text-emerald-600">Good length</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-700 uppercase"
                  >
                    Confirm New Password{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3.5 py-2 pr-10 text-xs font-medium text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-[#2f5bf5] focus:bg-white focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="cursor-pointer rounded-md bg-[#2f5bf5] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#204be8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Updating Credentials..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
