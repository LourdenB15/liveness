import { useEffect, useState } from "react";
import { api } from "../services/api";

const Billing = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = api.auth.getCurrentUser();
    if (currentUser) {
      fetchTier(currentUser.id);
    }
  }, []);

  const fetchTier = async (adminId) => {
    try {
      const { subscriptionTier } = await api.billing.getTier(adminId);
      const currentUser = api.auth.getCurrentUser();
      const updatedUser = { ...currentUser, subscriptionTier };
      localStorage.setItem("liveness_admin", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to fetch tier:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setUpgrading(true);
    setMessage("");
    try {
      const { subscriptionTier } = await api.billing.upgrade(user.id);
      const updatedUser = { ...user, subscriptionTier };
      localStorage.setItem("liveness_admin", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("Successfully upgraded to PRO!");
    } catch {
      setMessage("Failed to upgrade. Please try again.");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) return <div className="p-8">Loading billing info...</div>;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Billing & Subscription</h1>

      {message && (
        <div
          className={`mb-6 rounded p-4 ${message.includes("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
        </div>
      )}

      <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Free Plan */}
        <div
          className={`rounded-lg border p-6 shadow-sm ${user?.subscriptionTier === "free" ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-200"}`}
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Free Plan</h2>
              <p className="text-gray-500">For starters and experimentation</p>
            </div>
            {user?.subscriptionTier === "free" && (
              <span className="rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                Current Plan
              </span>
            )}
          </div>
          <p className="mb-6 text-3xl font-bold">
            $0<span className="text-lg font-normal text-gray-500">/mo</span>
          </p>
          <ul className="mb-8 space-y-3 text-gray-600">
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Up to 1,000 checks / mo
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Basic Analytics
            </li>
            <li className="flex items-center text-gray-400">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Priority Support
            </li>
          </ul>
          <button
            disabled
            className="w-full cursor-not-allowed rounded-md bg-gray-100 px-4 py-2 text-gray-400"
          >
            {user?.subscriptionTier === "free" ? "Current Plan" : "Free Plan"}
          </button>
        </div>

        {/* Pro Plan */}
        <div
          className={`rounded-lg border p-6 shadow-sm ${user?.subscriptionTier === "pro" ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-200"}`}
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pro Plan</h2>
              <p className="text-gray-500">For production applications</p>
            </div>
            {user?.subscriptionTier === "pro" && (
              <span className="rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                Current Plan
              </span>
            )}
          </div>
          <p className="mb-6 text-3xl font-bold">
            $49<span className="text-lg font-normal text-gray-500">/mo</span>
          </p>
          <ul className="mb-8 space-y-3 text-gray-600">
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Unlimited checks
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Advanced Analytics
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Priority Support
            </li>
          </ul>
          {user?.subscriptionTier === "free" ? (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {upgrading ? "Upgrading..." : "Upgrade to Pro"}
            </button>
          ) : (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-md bg-indigo-100 px-4 py-2 text-indigo-700"
            >
              Current Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
