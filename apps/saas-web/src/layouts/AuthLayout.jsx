import { ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AuthLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = (path) => {
    navigate(path, { state: { backgroundLocation: location } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfc] font-sans text-slate-900">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-[#fafbfc]/85 px-4 backdrop-blur-md sm:px-6 md:h-18 md:px-12">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 shrink-0 text-blue-600" />
          <span className="font-display text-lg font-semibold tracking-tight text-slate-900">
            Liveness<span className="ml-0.5 text-blue-600">Cloud</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal("/login")}
            className="cursor-pointer rounded-md border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Log in
          </button>
          <button
            onClick={() => openModal("/signup")}
            className="cursor-pointer rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
          >
            Sign up
          </button>
        </div>
      </header>

      <main
        id="main-content"
        className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8"
      >
        {children}
      </main>

      <footer className="border-t border-slate-200/80 bg-[#f4f6f8] py-6 text-center text-xs font-medium text-slate-500">
        &copy; {new Date().getFullYear()} Liveness Cloud. All rights reserved.
      </footer>
    </div>
  );
}
