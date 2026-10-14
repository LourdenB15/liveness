import { ChevronRight, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = (path) => {
    navigate(path, { state: { backgroundLocation: location } });
  };

  const isDocsPage = location.pathname === "/docs";

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMobileNav = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-[padding] duration-300 ${
        isScrolled ? "px-4 pt-3 sm:px-6 md:px-12" : "px-0 pt-0"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between transition-[max-width,border-radius,box-shadow,background-color,padding] duration-300 ${
          isScrolled
            ? "h-16 max-w-6xl rounded-lg border border-slate-200/90 bg-[#fafbfc]/90 px-6 shadow-sm backdrop-blur-md"
            : `h-16 max-w-7xl border-b border-slate-200/80 px-4 backdrop-blur-md sm:px-6 md:h-18 md:px-12 ${
                isDocsPage ? "bg-slate-50/90" : "bg-[#fafbfc]/85"
              }`
        }`}
      >
        <Link to="/" className="group flex cursor-pointer items-center gap-2">
          <ShieldCheck className="h-6 w-6 shrink-0 text-[#2f5bf5]" />
          <span className="font-display text-lg font-semibold tracking-tight text-slate-900">
            Liveness
            <span className="ml-0.5 text-[#2f5bf5]">Cloud</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          <a
            href="#features"
            onClick={scrollTo("features")}
            className="cursor-pointer text-xs font-medium text-slate-600 transition-colors hover:text-[#2f5bf5]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={scrollTo("how-it-works")}
            className="cursor-pointer text-xs font-medium text-slate-600 transition-colors hover:text-[#2f5bf5]"
          >
            How it works
          </a>
          <a
            href="#faq"
            onClick={scrollTo("faq")}
            className="cursor-pointer text-xs font-medium text-slate-600 transition-colors hover:text-[#2f5bf5]"
          >
            FAQ
          </a>
          <Link
            to="/docs"
            className={`text-xs font-medium transition-colors ${
              isDocsPage
                ? "font-semibold text-[#2f5bf5]"
                : "text-slate-600 hover:text-[#2f5bf5]"
            }`}
          >
            Docs
          </Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center space-x-3 md:flex">
          <button
            onClick={() => openModal("/login")}
            className="cursor-pointer rounded-md border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Log in
          </button>
          <button
            onClick={() => openModal("/signup")}
            className="cursor-pointer rounded-md bg-[#2f5bf5] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#204be8]"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="cursor-pointer rounded-md border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`flex flex-col space-y-4 bg-white p-6 shadow-xl transition-[opacity,transform] duration-300 md:hidden ${
              isScrolled
                ? "absolute top-full right-0 left-0 mt-2 rounded-lg border border-slate-200/90"
                : "absolute top-full right-0 left-0 border-b border-slate-200/80"
            }`}
          >
            <a
              href="#features"
              onClick={handleMobileNav("features")}
              className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-700 hover:text-[#2f5bf5]"
            >
              <span>Features</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </a>

            <a
              href="#how-it-works"
              onClick={handleMobileNav("how-it-works")}
              className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-700 hover:text-[#2f5bf5]"
            >
              <span>How it works</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </a>

            <a
              href="#faq"
              onClick={handleMobileNav("faq")}
              className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-700 hover:text-[#2f5bf5]"
            >
              <span>FAQ</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </a>

            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-medium text-slate-700 hover:text-[#2f5bf5]"
            >
              <span>Docs</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>

            <div className="border-t border-slate-100 pt-2" />

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal("/login");
              }}
              className="cursor-pointer text-center text-sm font-medium text-slate-700 hover:text-[#2f5bf5]"
            >
              Log in
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal("/signup");
              }}
              className="cursor-pointer rounded-md bg-[#2f5bf5] py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-[#204be8]"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
