import {
  BarChart3,
  CreditCard,
  Key,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
  Webhook,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = api.auth.getCurrentUser();

  const handleLogout = async () => {
    await api.auth.logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { path: "/users", icon: Users, label: "Users" },
    { path: "/logs", icon: BarChart3, label: "Logs" },
    { path: "/api-keys", icon: Key, label: "API Keys" },
    { path: "/webhooks", icon: Webhook, label: "Webhooks" },
    { path: "/billing", icon: CreditCard, label: "Billing" },
  ];

  // Calculate initials
  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() ||
      "AD"
    : "AD";

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "Administrator";

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <ShieldCheck className="mr-2 h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Liveness Cloud
          </span>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${location.pathname === item.path ? "text-white" : "text-slate-400"}`}
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-slate-100 p-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-900">
            {navItems.find((n) => n.path === location.pathname)?.label ||
              "Dashboard"}
          </h2>
          <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {initials}
            </div>
            <span className="text-sm font-bold text-slate-700">{fullName}</span>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </div>
  );
}
