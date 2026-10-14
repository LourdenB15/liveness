import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

export default function EmailOtpVerificationModal({
  user,
  onVerified,
  onLogout,
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendStatus, setResendStatus] = useState("");

  const inputRefs = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    // Support pasting multiple digits
    if (cleanVal.length > 1) {
      const pastedChars = cleanVal.slice(0, 6).split("");
      const newDigits = [...digits];
      pastedChars.forEach((char, i) => {
        if (index + i < 6) {
          newDigits[index + i] = char;
        }
      });
      setDigits(newDigits);
      const nextIndex = Math.min(5, index + pastedChars.length);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);
    setError("");

    if (index < 5 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;

    const chars = pastedData.slice(0, 6).split("");
    const newDigits = ["", "", "", "", "", ""];
    chars.forEach((c, idx) => {
      newDigits[idx] = c;
    });
    setDigits(newDigits);
    const nextIdx = Math.min(5, chars.length);
    inputRefs.current[nextIdx]?.focus();
  };

  const otpValue = digits.join("");
  const isComplete = otpValue.length === 6;

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!isComplete) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");
    setResendStatus("");

    try {
      const updatedUser = await api.auth.verifyOtp(otpValue);
      setSuccess(true);
      setTimeout(() => {
        if (onVerified) onVerified(updatedUser);
      }, 700);
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || resendCooldown > 0) return;
    setResending(true);
    setError("");
    setResendStatus("");

    try {
      await api.auth.resendOtp();
      setResendStatus("A new verification code has been dispatched to your email.");
      setResendCooldown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend verification code. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center p-4 duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-modal-title"
        className="animate-in zoom-in-95 relative w-full max-w-md duration-200"
      >
        <div className="rounded-[12px] border border-slate-200/90 bg-white p-6 shadow-2xl sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2f5bf5] shadow-xs">
              <Mail className="h-6 w-6" />
            </div>
            <h2
              id="otp-modal-title"
              className="font-heading text-xl font-bold tracking-tight text-slate-900"
            >
              Verify Your Email
            </h2>
            <p className="mt-1.5 text-xs font-medium text-slate-500">
              We've sent a 6-digit confirmation code to:
            </p>
            <p className="mt-0.5 font-mono text-xs font-semibold text-slate-800">
              {user?.email || "your email address"}
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50/80 p-3 text-xs text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span className="leading-normal font-medium">{error}</span>
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div
                role="status"
                className="flex items-center gap-2.5 rounded-md border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="font-semibold">
                  Email verified! Redirecting to dashboard...
                </span>
              </div>
            )}

            {/* Resend status notice */}
            {resendStatus && !error && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50/70 p-2.5 text-xs font-medium text-blue-700"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                <span>{resendStatus}</span>
              </div>
            )}

            {/* 6 Digit Input Group */}
            <div
              className="flex items-center justify-center gap-2 sm:gap-2.5"
              onPaste={handlePaste}
            >
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={loading || success}
                  aria-label={`Digit ${idx + 1}`}
                  className={`h-12 w-11 rounded-lg border text-center font-mono text-xl font-bold transition-all focus:outline-none sm:h-13 sm:w-12 ${
                    digit
                      ? "border-[#2f5bf5] bg-blue-50/30 text-slate-900 ring-2 ring-[#2f5bf5]/10"
                      : "border-slate-300 bg-white text-slate-900 focus:border-[#2f5bf5] focus:ring-2 focus:ring-[#2f5bf5]/20"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !isComplete || success}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#2f5bf5] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#204be8] focus:ring-2 focus:ring-[#2f5bf5]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : success ? (
                <span>Verified!</span>
              ) : (
                <>
                  <span>Verify Email</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend actions & Logout */}
          <div className="mt-6 space-y-3 text-center">
            <div className="text-xs font-medium text-slate-500">
              Didn't receive the email?{" "}
              {resendCooldown > 0 ? (
                <span className="text-slate-400">
                  Resend code in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || loading}
                  className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#2f5bf5] transition-colors hover:text-[#204be8] disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${resending ? "animate-spin" : ""}`}
                  />
                  <span>Resend code</span>
                </button>
              )}
            </div>

            {onLogout && (
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={onLogout}
                  className="cursor-pointer text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
                >
                  Sign in with a different account &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
