import { BarChart3, CheckCircle2, Lock, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-slate-100 px-6 py-4 md:px-12">
        <div className="flex items-center">
          <ShieldCheck className="mr-2 h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">
            Liveness Cloud
          </span>
        </div>
        <div className="hidden items-center space-x-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Pricing
          </a>
          <Link
            to="/docs"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Docs
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-linear-to-b from-slate-50 to-white px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
            Secure Face Liveness{" "}
            <span className="text-blue-600">Verification</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600">
            Protect your platform from spoofing attacks with our
            enterprise-grade liveness detection API. Fast, accurate, and easy to
            integrate.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="w-full transform rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl sm:w-auto"
            >
              Start Building Now
            </Link>
            <Link
              to="/login"
              className="w-full rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition-all hover:bg-slate-50 sm:w-auto"
            >
              View Demo
            </Link>
          </div>
          <div className="mt-16 flex justify-center space-x-8 text-slate-400">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" /> No Credit
              Card Required
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" /> Free Tier
              Available
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Liveness Cloud?</h2>
            <p className="text-slate-500">
              Industry-leading biometric security for modern applications.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-colors hover:bg-blue-50">
              <Zap className="mb-6 h-10 w-10 text-blue-600" />
              <h3 className="mb-3 text-xl font-bold">Real-time Detection</h3>
              <p className="leading-relaxed text-slate-600">
                Process liveness checks in milliseconds using our optimized
                neural networks.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-colors hover:bg-blue-50">
              <BarChart3 className="mb-6 h-10 w-10 text-blue-600" />
              <h3 className="mb-3 text-xl font-bold">Advanced Analytics</h3>
              <p className="leading-relaxed text-slate-600">
                Gain insights into verification patterns and security metrics
                with our dashboard.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-colors hover:bg-blue-50">
              <Lock className="mb-6 h-10 w-10 text-blue-600" />
              <h3 className="mb-3 text-xl font-bold">Spoof Protection</h3>
              <p className="leading-relaxed text-slate-600">
                Robust detection against photos, videos, masks, and deepfake
                attempts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-50 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-3xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <div className="grid gap-8 text-left md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Free</h3>
              <p className="mb-6 text-4xl font-black">
                $0
                <span className="text-base font-normal text-slate-400">
                  /mo
                </span>
              </p>
              <ul className="mb-8 space-y-4 text-slate-600">
                <li className="flex items-center">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" /> 1,000
                  checks/month
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" />{" "}
                  Community Support
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-green-500" /> Basic
                  Analytics
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full rounded-xl bg-slate-100 py-3 text-center font-bold text-slate-900 transition-colors hover:bg-slate-200"
              >
                Start for free
              </Link>
            </div>
            <div className="scale-105 transform rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
              <div className="flex items-start justify-between">
                <h3 className="mb-2 text-xl font-bold text-blue-100">Pro</h3>
                <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-black">
                  POPULAR
                </span>
              </div>
              <p className="mb-6 text-4xl font-black">
                $49
                <span className="text-base font-normal text-blue-300">/mo</span>
              </p>
              <ul className="mb-8 space-y-4 text-blue-50">
                <li className="flex items-center">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-blue-300" />{" "}
                  Unlimited checks
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-blue-300" />{" "}
                  Priority 24/7 Support
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-blue-300" />{" "}
                  Advanced Analytics
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full rounded-xl bg-white py-3 text-center font-bold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Get Pro Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-12 text-center text-sm text-slate-500 md:px-12">
        <p>
          &copy; {new Date().getFullYear()} Liveness Cloud. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
