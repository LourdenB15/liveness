import {
  Activity,
  ArrowRight,
  Check,
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

  const scrollToSection = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-900 selection:bg-[#2f5bf5] selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="border-b border-slate-200/80 bg-[#fafbfc] px-4 py-16 sm:px-6 md:px-12 md:pt-20 md:pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl">
              <div>
                <h1 className="font-display mb-5 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                  Biometric face verification{" "}
                  <span className="text-[#2f5bf5]">built for developers</span>
                </h1>
                <p className="mb-8 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Verify real users and block spoofing attempts with client-side
                  liveness checks and biometric verification.
                </p>

                {/* npm install — primary developer CTA */}
                <div className="mb-6 flex max-w-md items-center gap-3 rounded-[8px] border border-slate-200/80 bg-slate-900 p-2 shadow-xs">
                  <div className="flex min-w-0 flex-1 items-center gap-2 pl-2 font-mono text-xs">
                    <span className="shrink-0 font-bold text-[#2f5bf5]">$</span>
                    <span className="truncate font-medium text-slate-200 select-all">
                      npm install @liveness/sdk
                    </span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[4px] border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-400 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                    title="Copy package installation command"
                    aria-label="Copy package installation command"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row">
                  <button
                    onClick={() => openModal("/signup")}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#2f5bf5] px-5 py-2.5 text-center text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#204be8] sm:w-auto"
                  >
                    <span>Create account</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openModal("/login")}
                    className="w-full cursor-pointer rounded-[6px] border border-slate-200/80 bg-white px-5 py-2.5 text-center text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="content-visibility-auto bg-white px-4 py-16 sm:px-6 md:px-12 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 md:mb-16">
              <h2 className="font-display mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                What the SDK does
              </h2>
              <p className="max-w-2xl text-xs text-slate-600 sm:text-sm">
                Biometric verification running directly in the browser with
                server-side descriptor matching.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {/* Card 1: full width */}
              <div className="rounded-[10px] border border-slate-200/80 bg-[#fafbfc] p-6 transition-colors hover:border-slate-300 sm:p-7 md:col-span-3">
                <div className="mb-3 flex items-center gap-2.5">
                  <Activity className="h-5 w-5 text-[#2f5bf5]" />
                  <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">
                    Client-side landmark tracking
                  </h3>
                </div>
                <p className="mb-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Tracks 468 facial landmarks at 60 FPS in WebAssembly and WebGL
                  to detect subtle head movements and micro-actions without
                  sending video streams to a server.
                </p>
                <div className="grid gap-2.5 border-t border-slate-200/80 pt-4 sm:grid-cols-3">
                  <div className="rounded-[6px] border border-slate-200/80 bg-white p-3">
                    <div className="font-mono text-xs font-semibold text-slate-900">
                      468 3D points
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Sub-200ms latency
                    </div>
                  </div>
                  <div className="rounded-[6px] border border-slate-200/80 bg-white p-3">
                    <div className="font-mono text-xs font-semibold text-slate-900">
                      Active challenges
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Turn left, turn right, blink
                    </div>
                  </div>
                  <div className="rounded-[6px] border border-slate-200/80 bg-white p-3">
                    <div className="font-mono text-xs font-semibold text-slate-900">
                      Zero frame egress
                    </div>
                    <div className="text-[10px] text-slate-500">
                      100% on-device execution
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Full width 3 cols */}
              <div className="rounded-[10px] border border-slate-200/80 bg-[#fafbfc] p-6 transition-colors hover:border-slate-300 sm:p-7 md:col-span-3">
                <div className="grid gap-6 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-7">
                    <div className="mb-2 flex items-center gap-2.5">
                      <LineChart className="h-5 w-5 text-[#2f5bf5]" />
                      <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">
                        Vector matching &amp; audit telemetry
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Raw webcam frames are never transmitted. The client
                      extracts a 128-dimensional numerical vector and sends it
                      alongside session tokens and cryptographic integrity
                      hashes for server-side template comparison.
                    </p>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2 md:col-span-5">
                    <div className="rounded-[6px] border border-slate-200/80 bg-white p-3">
                      <div className="text-[10px] font-medium text-slate-500">
                        Embedding schema
                      </div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-slate-900">
                        128-d Float32 vector
                      </div>
                    </div>
                    <div className="rounded-[6px] border border-slate-200/80 bg-white p-3">
                      <div className="text-[10px] font-medium text-slate-500">
                        Verification threshold
                      </div>
                      <div className="mt-0.5 font-mono text-xs font-bold text-slate-900">
                        Cosine similarity &ge; 0.95
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section: Cobalt Dark Graphite Band */}
        <section
          id="how-it-works"
          className="content-visibility-auto border-y border-slate-800 bg-[#181a20] px-4 py-20 text-slate-100 sm:px-6 md:px-12 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="font-display mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                How it works
              </h2>
              <p className="mx-auto max-w-xl text-xs text-slate-400 sm:text-sm">
                Integrate liveness verification in three steps.
              </p>
            </div>

            {/* Interactive Steps + Code Viewer Grid */}
            <HowItWorksInteractive />
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <footer className="content-visibility-footer border-t border-slate-200/80 bg-[#f4f6f8] px-4 py-12 sm:py-14 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid gap-10 md:grid-cols-[1fr_auto]">
            {/* Left: Brand & blurb */}
            <div className="max-w-sm space-y-3.5">
              <Link
                to="/"
                onClick={scrollToTop}
                className="group flex cursor-pointer items-center gap-2"
              >
                <ShieldCheck className="h-6 w-6 shrink-0 text-[#2f5bf5]" />
                <span className="font-display text-lg font-semibold tracking-tight text-slate-900">
                  Liveness
                  <span className="ml-0.5 text-[#2f5bf5]">Cloud</span>
                </span>
              </Link>
              <p className="text-xs leading-relaxed text-slate-500">
                Facial liveness detection API and SDK for client-side identity
                verification. Camera feeds stay on the device.
              </p>
              <a
                href="mailto:support@liveness.cloud"
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 transition-colors hover:text-[#2f5bf5]"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#2f5bf5]" />
                <span>support@liveness.cloud</span>
              </a>
            </div>

            {/* Right: Links as horizontal rows */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-medium text-slate-600 md:pt-1">
              <a
                href="#features"
                onClick={scrollToSection("features")}
                className="cursor-pointer transition-colors hover:text-[#2f5bf5]"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={scrollToSection("how-it-works")}
                className="cursor-pointer transition-colors hover:text-[#2f5bf5]"
              >
                How it works
              </a>
              <a
                href="#faq"
                onClick={scrollToSection("faq")}
                className="cursor-pointer transition-colors hover:text-[#2f5bf5]"
              >
                FAQ
              </a>
              <Link
                to="/docs?section=introduction"
                className="transition-colors hover:text-[#2f5bf5]"
              >
                Docs
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-200/80 pt-8 text-xs font-medium text-slate-500 sm:flex-row sm:items-center">
            <p>
              &copy; {new Date().getFullYear()} Liveness Cloud, Inc. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                to="/privacy"
                className="transition-colors hover:text-slate-900"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="transition-colors hover:text-slate-900"
              >
                Terms
              </Link>
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
      "The SDK tracks 468 facial landmarks to verify natural movement and head orientation, blocking static photos and screen replays.",
  },
  {
    question: "What browsers and devices are supported?",
    answer:
      "The SDK runs in Chrome, Safari, Firefox, and Edge on iOS, Android, macOS, and Windows.",
  },
  {
    question: "Is user biometric data stored on your servers?",
    answer:
      "Servers never receive camera images. The client extracts a 128-dimensional numerical vector, and matching runs without storing raw photos.",
  },
  {
    question: "How long does SDK integration take?",
    answer:
      "Basic integration requires calling load() and start() on the video element, then posting the resulting descriptor to your verification endpoint.",
  },
  {
    question: "Is there a limit on API usage?",
    answer:
      "API keys and verification requests have no usage caps or rate tiers.",
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
      className="content-visibility-auto border-t border-slate-200/80 bg-white px-4 py-12 sm:px-6 md:px-12 md:py-16"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 md:mb-12">
          <h2 className="font-display mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Common questions
          </h2>
          <p className="max-w-xl text-xs text-slate-600 sm:text-sm">
            Integrating and deploying Liveness Cloud.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-[8px] border border-slate-200/80 bg-[#fafbfc] transition-all hover:border-slate-300"
              >
                <button
                  id={`faq-question-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => toggleFaq(index)}
                  className="flex w-full cursor-pointer items-center justify-between p-4 text-left font-semibold text-slate-900 transition-colors hover:text-[#2f5bf5] sm:p-5"
                >
                  <span className="font-display pr-4 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#2f5bf5]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className="border-t border-slate-200/60 px-4 pt-3 pb-5 text-xs leading-relaxed text-slate-600 sm:px-5 sm:pb-5 sm:text-sm"
                  >
                    <p>{faq.answer}</p>
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
    description: "Add @liveness/sdk to your project using npm or yarn.",
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
      "Attach the SDK to your video element and listen for challenge events.",
    fileName: "LivenessCamera.jsx",
    code: `import { LivenessSDK } from '@liveness/sdk';

const sdk = new LivenessSDK({ basePath: '/assets/models' });
await sdk.load();

sdk.on('challenge', ({ instruction }) => updateUI(instruction));
sdk.on('success', (result) => verifyWithServer(result));

await sdk.start(videoElement, canvasElement);`,
    statusMessage: "Active tracking: 60 FPS face mesh ok",
    tag: "Client Runtime",
  },
  {
    id: 3,
    step: "Step 3",
    title: "Verify via Cloud API",
    description:
      "Send the descriptor payload to your backend to compare against enrolled users.",
    fileName: "api/verify.js",
    code: `// Express / Node.js Backend Handler
app.post('/api/verify', async (req, res) => {
  const response = await fetch('https://api.liveness.cloud/api/liveness/verify', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.LIVENESS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const result = await response.json();
  res.json(result);
});`,
    statusMessage: "HTTP 200 OK: Match confirmed (similarity: 0.98)",
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
      <div className="mb-6 flex items-center justify-between gap-1.5 rounded-[6px] border border-slate-800 bg-[#101216] p-1.5 lg:hidden">
        {STEPS_DATA.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => {
              setActiveStepIndex(idx);
              setStepCopied(false);
            }}
            className={`flex-1 cursor-pointer rounded-[4px] px-3 py-2 text-center font-mono text-xs font-semibold transition-colors ${
              idx === activeStepIndex
                ? "bg-[#2f5bf5] text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Step {step.id}
          </button>
        ))}
      </div>

      <div className="grid items-stretch gap-6 text-left lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Interactive Step Cards (Desktop / Tablet) */}
        <div className="flex min-w-0 flex-col justify-between space-y-3 lg:col-span-5">
          {STEPS_DATA.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setStepCopied(false);
                }}
                className={`w-full cursor-pointer rounded-[8px] border p-5 text-left transition-[border-color,background-color,box-shadow] duration-150 sm:p-6 ${
                  isActive
                    ? "border-[#2f5bf5]/60 bg-[#21242d] shadow-sm"
                    : "border-slate-800/90 bg-[#14161c] hover:border-slate-700 hover:bg-[#191b22]"
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
                  <span
                    className={`rounded-[4px] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase sm:text-xs ${
                      isActive
                        ? "bg-[#2f5bf5] text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step.step}
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-slate-400 sm:text-xs">
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-display mb-1 flex items-center justify-between text-sm font-bold text-white sm:text-base">
                  <span>{step.title}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isActive
                        ? "translate-x-1 text-[#6b8af9]"
                        : "text-slate-600"
                    }`}
                  />
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Code Window Mockup */}
        <div className="flex min-w-0 flex-col lg:col-span-7">
          <div className="flex h-full max-w-full flex-col overflow-hidden rounded-[10px] border border-slate-800 bg-[#101216] text-slate-100 shadow-xl">
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#14161c] px-3.5 py-2.5 sm:px-4">
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-xs font-medium text-slate-300">
                  {activeStepData.fileName}
                </span>
              </div>

              {/* Quick Step Switcher Tabs */}
              <div
                role="tablist"
                aria-label="Integration steps"
                className="flex items-center space-x-1 rounded-[6px] border border-slate-800 bg-[#101216] p-1"
              >
                {STEPS_DATA.map((step, idx) => (
                  <button
                    key={step.id}
                    role="tab"
                    aria-selected={idx === activeStepIndex}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setStepCopied(false);
                    }}
                    className={`cursor-pointer rounded-[4px] px-2 py-0.5 font-mono text-[10px] font-medium transition-colors sm:px-2.5 sm:py-1 sm:text-[11px] ${
                      idx === activeStepIndex
                        ? "bg-[#2f5bf5] text-white"
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
                className="flex w-20 shrink-0 cursor-pointer items-center justify-center space-x-1.5 rounded-[6px] border border-slate-700/80 bg-slate-800/90 py-1 text-xs font-medium text-slate-300 transition-[border-color,background-color,color] hover:border-slate-600 hover:bg-slate-700 hover:text-white"
                title="Copy code snippet"
                aria-label="Copy code snippet"
              >
                {stepCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
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
            <div className="max-w-full min-w-0 flex-1 overflow-x-auto bg-[#101216] p-4 font-mono text-xs leading-relaxed text-slate-200 sm:p-5">
              <pre className="wrap-break-word whitespace-pre-wrap sm:whitespace-pre">
                <code>{activeStepData.code}</code>
              </pre>
            </div>

            {/* Output State */}
            <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#14161c] px-4 py-2.5 text-xs font-medium text-slate-400">
              <span className="font-mono text-[11px] text-emerald-400">
                {activeStepData.statusMessage}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
