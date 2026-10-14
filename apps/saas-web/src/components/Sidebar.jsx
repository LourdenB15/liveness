import {
  BarChart3,
  Book,
  Key,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  setSearchModalOpen,
  fullName,
  initials,
  user,
  handleLogout,
}) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { path: "/users", icon: Users, label: "Users" },
    { path: "/logs", icon: BarChart3, label: "Logs" },
    { path: "/api-keys", icon: Key, label: "API Keys" },
    { path: "/docs", icon: Book, label: "Documentation" },
  ];

  const renderNavContent = (isCollapsed = false) => (
    <div className="flex h-full flex-col justify-between overflow-hidden">
      {/* Scrollable Nav Area */}
      <div
        className={`flex-1 overflow-y-auto py-5 ${isCollapsed ? "px-2" : "px-4"}`}
      >
        {/* Mobile Header Brand & Close Button (Mobile Drawer Only) */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-200/80 pb-4 md:hidden">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2"
          >
            <ShieldCheck className="h-6 w-6 shrink-0 text-blue-600" />
            <span className="font-display text-base font-semibold tracking-tight text-slate-900">
              Liveness
              <span className="ml-0.5 text-blue-600">Cloud</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-slate-200/80 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile User Profile Card (Mobile Drawer Only) */}
        <div className="mb-6 rounded-lg border border-slate-200/80 bg-[#fafbfc] p-3.5 shadow-2xs md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 font-mono text-xs font-bold text-white shadow-xs">
              {initials}
            </div>
            <div className="flex min-w-0 flex-col overflow-hidden text-left">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-bold text-slate-900">
                  {fullName}
                </span>
              </div>
              <span className="truncate font-mono text-[10px] font-medium text-slate-500">
                {user?.email || "admin@liveness.cloud"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Group */}
        <div className="mb-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    title={isCollapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex cursor-pointer items-center rounded-md py-2 text-xs font-medium transition-colors duration-150 sm:text-xs ${
                      isCollapsed ? "justify-center px-0" : "px-3"
                    } ${
                      isActive
                        ? "border border-blue-200/60 bg-blue-50/70 font-semibold text-blue-700"
                        : "border border-transparent text-slate-600 hover:border-slate-200/60 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 shrink-0 ${
                        isCollapsed ? "" : "mr-2.5"
                      } ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap transition-all duration-200 ${isCollapsed ? "hidden w-0 opacity-0" : "inline-block opacity-100"}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Account Management (Mobile Drawer Only) */}
        <div className="md:hidden">
          <div className="mb-2 px-2 font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Account Management
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={location.pathname === "/settings" ? "page" : undefined}
                className={`flex items-center rounded-md px-3 py-2 text-xs font-medium transition-colors duration-150 ${
                  location.pathname === "/settings"
                    ? "border border-blue-200/60 bg-blue-50/70 font-semibold text-blue-700"
                    : "border border-transparent text-slate-600 hover:border-slate-200/60 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <SettingsIcon className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
                Account Settings
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="mr-2.5 h-4 w-4 shrink-0 text-rose-500" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-40 cursor-pointer bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel (Smooth Slide-In) */}
      <aside
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col justify-between border-l border-slate-200/80 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Desktop Sidebar (Smooth Hardware-Accelerated Collapse) */}
      <aside
        aria-label="Sidebar navigation"
        className={`relative z-10 hidden h-screen shrink-0 flex-col justify-between overflow-hidden border-r border-slate-200/80 bg-[#fafbfc] transition-[width] duration-300 ease-in-out md:flex ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Desktop Sidebar Header */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-slate-200/80 md:h-18 ${sidebarCollapsed ? "justify-center px-2" : "justify-between px-5"}`}
        >
          {!sidebarCollapsed && (
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 truncate"
            >
              <ShieldCheck className="h-6 w-6 shrink-0 text-blue-600" />
              <span className="font-display truncate text-sm font-semibold tracking-tight text-slate-900">
                Liveness
                <span className="ml-0.5 text-blue-600">Cloud</span>
              </span>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {!sidebarCollapsed && (
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-slate-200/80 text-slate-500 transition-colors hover:border-slate-300 hover:bg-white hover:text-blue-600"
                title="Search Platform (Ctrl+K)"
                aria-label="Search Platform (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-slate-200/80 text-slate-500 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-900"
              title={
                sidebarCollapsed
                  ? "Expand Sidebar (Ctrl+B)"
                  : "Collapse Sidebar (Ctrl+B)"
              }
              aria-label={
                sidebarCollapsed
                  ? "Expand Sidebar (Ctrl+B)"
                  : "Collapse Sidebar (Ctrl+B)"
              }
              aria-expanded={!sidebarCollapsed}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 text-blue-600" />
              ) : (
                <PanelLeftClose className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Nav Content */}
        {renderNavContent(sidebarCollapsed)}
      </aside>
    </>
  );
}
