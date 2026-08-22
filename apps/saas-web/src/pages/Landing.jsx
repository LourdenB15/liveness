import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  LineChart,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Landing() {
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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-b from-slate-50 to-white px-4 py-20 sm:px-6 md:px-12 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Secure Face Liveness{" "}
            <span className="text-blue-600">Verification</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
            Protect your platform from spoofing attacks with an enterprise-grade
            liveness detection API. Fast, accurate, and easy to integrate.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => openModal("/signup")}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-center text-base font-bold text-white shadow-xl transition-all hover:bg-blue-700 hover:shadow-2xl active:scale-95 sm:w-auto sm:text-lg"
            >
              <span>Start Building Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => openModal("/login")}
              className="w-full cursor-pointer rounded-full border border-slate-200 bg-white px-8 py-4 text-center text-base font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 sm:w-auto sm:text-lg"
            >
              View Demo
            </button>
          </div>

          <div className="mx-auto mt-10 max-w-xs rounded-xl border border-slate-200 bg-slate-950 p-2.5 shadow-md transition-all hover:border-slate-300 sm:max-w-sm md:max-w-md">
            <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
              <div className="flex items-center space-x-2 overflow-hidden pl-2 text-slate-400">
                <span className="font-bold text-blue-500">$</span>
                <span className="truncate font-medium text-slate-200 select-all">
                  npm install @liveness/sdk
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex w-21 shrink-0 cursor-pointer items-center justify-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                title="Copy package installation command"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-slate-400 sm:mt-16 sm:gap-8 sm:text-sm">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
              No Credit Card Required
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
              Free Tier Available
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-white px-4 py-20 sm:px-6 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why Liveness Cloud?
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base">
              Industry-leading biometric security built for high-throughput
              modern applications.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5 sm:p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100/80 bg-blue-50 text-blue-600">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
                Real-time Detection
              </h3>
              <p className="mb-6 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Process liveness checks in milliseconds using optimized facial
                mesh neural networks.
              </p>
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>Sub-200ms verification latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>60 FPS client-side tracking</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5 sm:p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100/80 bg-blue-50 text-blue-600">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
                Advanced Analytics
              </h3>
              <p className="mb-6 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Gain insights into verification patterns and security metrics
                with our dashboard.
              </p>
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>Live verification event logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>FAR accuracy &lt; 0.001%</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5 sm:p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100/80 bg-blue-50 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
                Spoof Protection
              </h3>
              <p className="mb-6 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Robust detection against photos, videos, masks, and deepfake
                attempts.
              </p>
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>Anti-photo &amp; screen replay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>3D mask &amp; deepfake defense</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="border-y border-slate-200/60 bg-slate-50/80 px-4 py-20 sm:px-6 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base">
              Integrate liveness verification in 3 straightforward steps.
            </p>
          </div>

          {/* Interactive Steps + Code Viewer Grid */}
          <HowItWorksInteractive />
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="bg-white px-4 py-20 sm:px-6 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-12 md:mb-16">
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base">
              Flexible plans designed to scale from side projects to enterprise
              applications.
            </p>
          </div>
          <div className="grid gap-8 text-left md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 sm:p-8">
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Free</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Ideal for prototyping & testing
                  </p>
                </div>
                <p className="mb-6 text-4xl font-black text-slate-900">
                  $0
                  <span className="text-base font-normal text-slate-400">
                    /mo
                  </span>
                </p>
                <ul className="mb-8 space-y-3.5 text-xs text-slate-600 sm:text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    1,000 checks / month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    Standard API rate limits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    Community Support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    Basic Analytics Dashboard
                  </li>
                </ul>
              </div>
              <button
                onClick={() => openModal("/signup")}
                className="w-full cursor-pointer rounded-xl bg-slate-100 py-3 text-center text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200"
              >
                Start for free
              </button>
            </div>
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-xl shadow-blue-600/5 sm:p-8">
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Pro</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      For production & growing teams
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                    POPULAR
                  </span>
                </div>
                <p className="mb-6 text-4xl font-black text-slate-900">
                  $49
                  <span className="text-base font-normal text-slate-400">
                    /mo
                  </span>
                </p>
                <ul className="mb-8 space-y-3.5 text-xs text-slate-600 sm:text-sm">
                  <li className="flex items-center font-medium text-slate-900">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    Unlimited checks
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    High-throughput API access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    Priority 24/7 Support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-green-500 sm:h-5 sm:w-5" />{" "}
                    Advanced Analytics & Real-Time Logs
                  </li>
                </ul>
              </div>
              <button
                onClick={() => openModal("/signup")}
                className="w-full cursor-pointer rounded-xl bg-blue-600 py-3 text-center text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-98"
              >
                Get Pro Access
              </button>
            </div>
          </div>

          <p className="mt-10 text-xs font-medium text-slate-400">
            Billed monthly • Cancel anytime • 99.99% Uptime SLA Included
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-50/70 px-4 py-14 sm:py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
            {/* Column 1: Brand & Status */}
            <div className="space-y-4 md:col-span-1">
              <Link
                to="/"
                onClick={scrollToTop}
                className="group flex cursor-pointer items-center gap-2"
              >
                <ShieldCheck className="h-6 w-6 shrink-0 text-blue-600 transition-transform group-hover:scale-110" />
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  Liveness
                  <span className="ml-0.5 font-light text-blue-600">Cloud</span>
                </span>
              </Link>
              <p className="text-xs leading-relaxed text-slate-500">
                Enterprise-grade facial liveness detection API & SDK designed to
                stop spoofing attacks in real time.
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="mailto:support@liveness.cloud"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span>support@liveness.cloud</span>
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-slate-900 uppercase">
                Product
              </h4>
              <ul className="space-y-2.5 text-xs font-medium text-slate-600">
                <li>
                  <a
                    href="#features"
                    className="transition-colors hover:text-blue-600"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-blue-600"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="transition-colors hover:text-blue-600"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => openModal("/login")}
                    className="cursor-pointer text-left transition-colors hover:text-blue-600"
                  >
                    Interactive Demo
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Developer & Resources */}
            <div>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-slate-900 uppercase">
                Developers
              </h4>
              <ul className="space-y-2.5 text-xs font-medium text-slate-600">
                <li>
                  <Link
                    to="/docs#introduction"
                    className="transition-colors hover:text-blue-600"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs#sdk-usage"
                    className="transition-colors hover:text-blue-600"
                  >
                    Quickstart Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs#api-ref"
                    className="transition-colors hover:text-blue-600"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="transition-colors hover:text-blue-600"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Security & Compliance */}
            <div>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-slate-900 uppercase">
                Trust & Security
              </h4>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                Zero raw biometric image retention. Full in-memory encryption
                during active liveness challenges.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-500">
                <li className="flex items-center gap-1.5 text-slate-600">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />{" "}
                  SOC2 Compliant Pipeline
                </li>
                <li className="flex items-center gap-1.5 text-slate-600">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />{" "}
                  GDPR & Privacy Ready
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 text-xs font-medium text-slate-400 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} Liveness Cloud, Inc. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="transition-colors hover:text-slate-600">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-slate-600">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-slate-600">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FAQ_DATA = [
  {
    question: "How accurate is the liveness detection?",
    answer:
      "Our facial mesh neural network achieves 99.8%+ accuracy against photos, screen replays, 3D masks, and deepfake attempts in real time.",
  },
  {
    question: "What browsers and devices are supported?",
    answer:
      "Our SDK supports all modern web browsers (Chrome, Safari, Firefox, Edge) across iOS, Android, macOS, and Windows.",
  },
  {
    question: "Is user biometric data stored on your servers?",
    answer:
      "No raw biometric images are saved. Verification processes encrypted facial descriptors in-memory and discards them immediately after scoring.",
  },
  {
    question: "How long does SDK integration take?",
    answer:
      "Fewer than 10 lines of code. Most developers complete frontend and backend integration in under 15 minutes.",
  },
  {
    question: "Can I test it before choosing a paid plan?",
    answer:
      "Yes! The Free tier includes 1,000 verifications per month with full SDK and API access — no credit card required.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      id="faq"
      className="border-t border-slate-200/60 bg-slate-50/80 px-4 py-20 sm:px-6 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base">
            Everything you need to know about integrating and using Liveness
            Cloud.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full cursor-pointer items-center justify-between p-5 text-left font-bold text-slate-900 transition-colors hover:text-blue-600 sm:p-6"
                >
                  <span className="pr-4 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pt-0 pb-6 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:text-base">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const STEPS_DATA = [
  {
    id: 1,
    step: "Step 1",
    title: "Install Package",
    description:
      "Add @liveness/sdk to your web application or mobile project using your favorite package manager.",
    fileName: "Terminal",
    code: `npm install @liveness/sdk`,
    statusMessage: "Package ready for initialization",
    tag: "Frontend SDK",
  },
  {
    id: 2,
    step: "Step 2",
    title: "Run Active Session",
    description:
      "Bind to your HTML camera video element and handle real-time biometric liveness verification events.",
    fileName: "LivenessCamera.jsx",
    code: `import { LivenessSDK } from '@liveness/sdk';

const sdk = new LivenessSDK({ apiKey: 'pk_live_...' });

// Bind to HTML video element
await sdk.start(videoElement, {
  onChallenge: (prompt) => updateUI(prompt),
  onSuccess: (payload) => verifyWithServer(payload)
});`,
    statusMessage: "Active tracking: 60 FPS face mesh ok",
    tag: "Client Runtime",
  },
  {
    id: 3,
    step: "Step 3",
    title: "Verify via Cloud API",
    description:
      "Post payload to your backend endpoint to verify biometric descriptor against our secure AI cloud.",
    fileName: "api/verify.js",
    code: `// Express / Node.js Backend Handler
app.post('/api/liveness/verify', async (req, res) => {
  const { payload } = req.body;
  
  const response = await fetch('https://api.liveness.cloud/v1/verify', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${process.env.LIVENESS_SECRET_KEY}\` },
    body: JSON.stringify({ payload })
  });

  const result = await response.json();
  res.json({ isRealPerson: result.isRealPerson, score: result.score });
});`,
    statusMessage: "HTTP 200 OK — Real Person Confirmed (99.8%)",
    tag: "Backend Verification",
  },
];

const HowItWorksInteractive = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepCopied, setStepCopied] = useState(false);

  const activeStepData = STEPS_DATA[activeStepIndex];

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setStepCopied(true);
    setTimeout(() => setStepCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Mobile Step Selector Tabs (Visible on small screens < 1024px) */}
      <div className="mb-6 flex items-center justify-between gap-2 rounded-xl bg-slate-200/60 p-1.5 lg:hidden">
        {STEPS_DATA.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => {
              setActiveStepIndex(idx);
              setStepCopied(false);
            }}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2.5 text-center text-xs font-bold transition-all ${
              idx === activeStepIndex
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Step {step.id}
          </button>
        ))}
      </div>

      <div className="grid items-stretch gap-6 text-left lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Interactive Step Cards (Desktop / Tablet) */}
        <div className="flex min-w-0 flex-col justify-between space-y-3 sm:space-y-4 lg:col-span-5">
          {STEPS_DATA.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setStepCopied(false);
                }}
                className={`w-full cursor-pointer rounded-2xl border p-6 text-left transition-all duration-200 sm:p-8 ${
                  isActive
                    ? "border-slate-300 bg-white shadow-lg ring-1 shadow-slate-900/5 ring-slate-200"
                    : "border-slate-200/80 bg-white/60 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase sm:text-xs ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {step.step}
                  </span>
                  <span className="font-mono text-[10px] font-medium text-slate-400 sm:text-xs">
                    {step.tag}
                  </span>
                </div>
                <h3 className="mb-1 flex items-center justify-between text-base font-bold text-slate-900 sm:text-lg">
                  <span>{step.title}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isActive
                        ? "translate-x-1 text-slate-900"
                        : "text-slate-300"
                    }`}
                  />
                </h3>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {step.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Code Window Mockup */}
        <div className="flex min-w-0 flex-col lg:col-span-7">
          <div className="flex h-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/90 px-3 py-3 sm:px-4">
              <div className="flex shrink-0 items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-1.5 max-w-30 truncate font-mono text-[11px] font-medium text-slate-400 sm:max-w-none sm:text-xs">
                  {activeStepData.fileName}
                </span>
              </div>

              {/* Quick Step Switcher Tabs */}
              <div className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
                {STEPS_DATA.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setStepCopied(false);
                    }}
                    className={`cursor-pointer rounded-md px-2 py-0.5 font-mono text-[10px] font-medium transition-colors sm:px-2.5 sm:py-1 sm:text-[11px] ${
                      idx === activeStepIndex
                        ? "bg-slate-700 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Step {step.id}
                  </button>
                ))}
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopyCode(activeStepData.code)}
                className="flex w-21 shrink-0 cursor-pointer items-center justify-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                title="Copy code snippet"
              >
                {stepCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Viewport */}
            <div className="max-w-full min-w-0 flex-1 overflow-x-auto bg-slate-950 p-3.5 font-mono text-[11px] leading-relaxed text-slate-200 sm:p-6 sm:text-sm">
              <pre className="wrap-break-word whitespace-pre-wrap sm:whitespace-pre">
                <code>{activeStepData.code}</code>
              </pre>
            </div>

            {/* Footer Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-900/60 px-3 py-2.5 font-mono text-[10px] text-slate-400 sm:px-4 sm:text-[11px]">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
                <span className="truncate font-semibold text-emerald-400">
                  {activeStepData.statusMessage}
                </span>
              </div>
              <span className="hidden text-slate-500 sm:inline">UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
