import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useLanding() {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = (path) => {
    navigate(path, { state: { backgroundLocation: location } });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npm install @liveness/sdk");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    copied,
    openModal,
    copyToClipboard,
    scrollToTop,
    scrollToSection,
  };
}
