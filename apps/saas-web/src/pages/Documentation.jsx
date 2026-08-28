import {
  ArrowRight,
  Bell,
  Book,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Code2,
  FileCode,
  Key,
  Layers,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

const SidebarItem = ({ id, label, activeId, onClick, icon: Icon }) => (
  <li>
    <button
      onClick={() => onClick(id)}
      className={`group flex w-full cursor-pointer items-center rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition-all duration-150 sm:text-sm ${
        activeId === id
          ? "bg-blue-50/80 font-extrabold text-blue-600"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
      }`}
    >
      {Icon && (
        <Icon
          className={`mr-3 h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
            activeId === id
              ? "text-blue-600"
              : "text-slate-400 group-hover:text-slate-600"
          }`}
        />
      )}
      <span>{label}</span>
    </button>
  </li>
);

const CodeBlock = ({ code, language, title }) => (
  <div className="relative my-6 overflow-hidden rounded-xl bg-slate-900 text-slate-300 shadow-2xl">
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/50 px-4 py-2">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
        </div>
        {title && (
          <span className="max-w-50 truncate text-xs font-medium text-slate-400 sm:max-w-none">
            {title}
          </span>
        )}
      </div>
      <span className="shrink-0 text-[10px] font-semibold tracking-wider text-slate-500 uppercase sm:text-xs">
        {language}
      </span>
    </div>
    <pre className="overflow-x-auto p-4 text-xs leading-relaxed sm:p-6 sm:text-sm">
      <code>{code}</code>
    </pre>
  </div>
);

const IntroContent = () => (
  <div>
    <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
      <Book className="mr-2 h-3.5 w-3.5" /> Documentation v1.0.0
    </div>
    <h1 className="mb-6 text-3xl font-black tracking-tight text-slate-900 sm:mb-8 sm:text-5xl md:text-6xl">
      Liveness SDK
    </h1>
    <p className="mb-8 text-lg leading-relaxed text-slate-600 sm:mb-12 sm:text-2xl">
      The industry-standard JavaScript SDK for browser-based Active Liveness
      Detection and Biometric Identity Verification.
    </p>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
        <h3 className="mb-4 flex items-center text-lg font-bold sm:text-xl">
          <Terminal className="mr-2 h-5 w-5 text-blue-600" /> For Developers
        </h3>
        <p className="mb-6 text-sm text-slate-500">
          Everything you need to integrate biometric security into your web
          application in minutes.
        </p>
        <ul className="mb-8 space-y-3">
          <li className="flex items-center text-sm text-slate-600">
            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />{" "}
            Simple Event-Driven API
          </li>
          <li className="flex items-center text-sm text-slate-600">
            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />{" "}
            GPU/WASM Accelerated
          </li>
          <li className="flex items-center text-sm text-slate-600">
            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />{" "}
            100% Client-Side Processing
          </li>
        </ul>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8">
        <h3 className="mb-4 flex items-center text-lg font-bold sm:text-xl">
          <Cloud className="mr-2 h-5 w-5 text-blue-600" /> For Enterprises
        </h3>
        <p className="mb-6 text-sm text-slate-500">
          Managed infrastructure for secure biometric storage, identity
          matching, and audit logs.
        </p>
        <ul className="mb-8 space-y-3">
          <li className="flex items-center text-sm text-slate-600">
            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />{" "}
            Centralized API Key Management
          </li>
          <li className="flex items-center text-sm text-slate-600">
            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />{" "}
            Webhook Integrations
          </li>
          <li className="flex items-center text-sm text-slate-600">
            <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />{" "}
            Secure Identity Vault
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const SDKUsageContent = () => (
  <div>
    <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 sm:mb-8 sm:text-4xl">
      Using the SDK
    </h2>
    <p className="mb-6 text-base text-slate-600 sm:mb-8 sm:text-lg">
      Integrate the Liveness SDK into your frontend to start capturing biometric
      data securely.
    </p>

    <div className="space-y-8 sm:space-y-12">
      <div>
        <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          1. Installation
        </h3>
        <CodeBlock language="bash" code={`npm install @liveness/sdk`} />
      </div>

      <div>
        <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          2. Initialization
        </h3>
        <p className="mb-3 text-sm text-slate-600 sm:mb-4 sm:text-base">
          You must provide a <code>basePath</code> that points to the MediaPipe
          and TensorFlow.js model assets.
        </p>
        <CodeBlock
          language="javascript"
          code={`import { LivenessSDK } from "@liveness/sdk";

const sdk = new LivenessSDK({
  basePath: "/assets/models", // Local or CDN path
  challengeTimeout: 8000,     // 8 seconds per challenge
  minBrightness: -0.8,
});`}
        />
      </div>

      <div>
        <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          3. Starting the Session
        </h3>
        <p className="mb-3 text-sm text-slate-600 sm:mb-4 sm:text-base">
          The SDK requires a <code>&lt;video&gt;</code> element for the camera
          feed and a <code>&lt;canvas&gt;</code> for the debug/face-mesh
          overlay.
        </p>
        <CodeBlock
          language="javascript"
          code={`// Load models
await sdk.load();

// Start camera and detection
const video = document.getElementById("liveness-video");
const canvas = document.getElementById("liveness-canvas");

await sdk.start(video, canvas);`}
        />
      </div>

      <div>
        <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          4. Handling Results
        </h3>
        <CodeBlock
          language="javascript"
          code={`sdk.on("success", (result) => {
  // result.descriptor is the 128-d ResNet-34 feature vector
  console.log("Success!", result);

  // Send to your backend for verification
  fetch("/api/verify", {
    method: "POST",
    body: JSON.stringify(result)
  });
});

sdk.on("failure", (error) => {
  alert(\`Verification failed: \${error.message}\`);
});`}
        />
      </div>
    </div>
  </div>
);

const CloudUsageContent = () => (
  <div>
    <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 sm:mb-8 sm:text-4xl">
      Liveness Cloud Guide
    </h2>
    <p className="mb-6 text-base text-slate-600 sm:mb-8 sm:text-lg">
      The Liveness Cloud provides a managed backend for handling biometric data,
      API keys, and webhooks.
    </p>

    <div className="space-y-8 sm:space-y-12">
      <div className="rounded-2xl border-2 border-blue-100 bg-blue-50/30 p-5 sm:p-8">
        <h3 className="mb-3 flex items-center text-lg font-bold sm:mb-4 sm:text-xl">
          <Key className="mr-2 h-5 w-5 text-blue-600" /> 1. Manage API Keys
        </h3>
        <p className="mb-4 text-sm text-slate-600 sm:mb-6">
          Every request to the Liveness Cloud API requires a valid API Key.
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-slate-700">
          <li>
            Navigate to the <strong>API Keys</strong> section in your dashboard.
          </li>
          <li>Create a new key and give it a descriptive name.</li>
          <li>
            Store your <strong>Secret Key</strong> securely; it will only be
            shown once.
          </li>
        </ol>
      </div>

      <div>
        <h3 className="mb-3 flex items-center text-xl font-bold sm:mb-4 sm:text-2xl">
          <Bell className="mr-2 h-5 w-5 text-blue-600 sm:h-6 sm:w-6" /> 2.
          Configuring Webhooks
        </h3>
        <p className="mb-3 text-sm text-slate-600 sm:mb-4 sm:text-base">
          Get real-time notifications on your server whenever a liveness check
          is completed.
        </p>
        <ul className="mb-6 space-y-4">
          <li className="flex gap-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
              1
            </div>
            <p className="text-sm text-slate-600">
              Enter your endpoint URL in the <strong>Webhooks</strong> tab.
            </p>
          </li>
          <li className="flex gap-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
              2
            </div>
            <p className="text-sm text-slate-600">
              Subscribe to <code>verification.success</code> or{" "}
              <code>verification.failed</code> events.
            </p>
          </li>
          <li className="flex gap-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
              3
            </div>
            <p className="text-sm text-slate-600">
              Save the <strong>Webhook Secret</strong> for signature
              verification.
            </p>
          </li>
        </ul>
        <p className="mb-4 text-sm text-slate-600 sm:text-base">
          To verify incoming webhook payloads and avoid formatting issues, use
          the raw request body buffer:
        </p>
        <CodeBlock
          language="javascript"
          title="Webhook Signature Verification (Node.js/Express)"
          code={`const crypto = require("crypto");

app.post("/webhooks/liveness", (req, res) => {
  const signature = req.headers["x-liveness-signature"];
  const secret = process.env.WEBHOOK_SECRET;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody) // Verify using the raw body buffer
    .digest("hex");

  if (signature !== expected) {
    return res.status(401).send("Invalid signature");
  }

  // Handle verified payload
  const { event, data } = req.body;
  res.status(200).send("Verified!");
});`}
        />
      </div>

      <div>
        <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          3. Cloud API Endpoints
        </h3>
        <p className="mb-6 text-sm text-slate-600 sm:text-base">
          The Liveness Cloud provides secure endpoints for biometric enrollment
          and identity matching. All requests require the <code>x-api-key</code>{" "}
          header.
        </p>
        <div className="space-y-6 sm:space-y-8">
          {/* Enroll Endpoint */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-2xl sm:p-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="w-fit rounded bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">
                POST
              </span>
              <code className="text-sm font-bold break-all text-slate-900 sm:text-lg">
                /api/liveness/enroll
              </code>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Registers a new user with their biometric descriptor. This creates
              a baseline for future identity verifications.
            </p>
            <h5 className="mb-3 text-xs font-black tracking-widest text-slate-400 uppercase">
              Request Body
            </h5>
            <CodeBlock
              language="json"
              code={`{
  "name": "John Doe",
  "descriptor": [...], // 128-d ResNet-34 vector
  "sessionToken": "unique-session-id",
  "timestamp": 1716336000000,
  "integrity": "hash_value"
}`}
            />
          </div>

          {/* Verify Endpoint */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-2xl sm:p-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="w-fit rounded bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-700">
                POST
              </span>
              <code className="text-sm font-bold break-all text-slate-900 sm:text-lg">
                /api/liveness/verify
              </code>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Compares a fresh liveness result against your enrolled user
              database. Returns a match if similarity exceeds{" "}
              <strong>0.98</strong> (Cosine) and distance is within{" "}
              <strong>0.20</strong> (Euclidean).
            </p>
            <h5 className="mb-3 text-xs font-black tracking-widest text-slate-400 uppercase">
              Response Schema
            </h5>
            <CodeBlock
              language="json"
              code={`{
  "verified": true,
  "status": "SUCCESS",
  "match": {
    "name": "John Doe",
    "similarity": 0.94,
    "distance": 0.346
  },
  "metric": "cosine"
}`}
            />
          </div>

          {/* 1:1 Verify-One Endpoint */}
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:rounded-2xl sm:p-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="w-fit rounded bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-700">
                POST
              </span>
              <code className="text-sm font-bold break-all text-slate-900 sm:text-lg">
                /api/liveness/verify-one
              </code>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Performs 1:1 verification comparing a fresh liveness result
              directly against a specific target identity UUID (
              <code>targetId</code>).
            </p>
            <h5 className="mb-3 text-xs font-black tracking-widest text-slate-400 uppercase">
              Request Body
            </h5>
            <CodeBlock
              language="json"
              code={`{
  "targetId": "550e8400-e29b-41d4-a716-446655440000",
  "descriptor": [...], // 128-d ResNet-34 vector
  "sessionToken": "unique-session-id",
  "timestamp": 1716336000000,
  "integrity": "hash_value"
}`}
            />
            <h5 className="mb-3 text-xs font-black tracking-widest text-slate-400 uppercase">
              Response Schema
            </h5>
            <CodeBlock
              language="json"
              code={`{
  "verified": true,
  "status": "SUCCESS",
  "match": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "similarity": 0.94,
    "distance": 0.346
  },
  "metric": "cosine"
}`}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
          4. Payload Integrity
        </h3>
        <p className="mb-3 text-sm text-slate-600 sm:mb-4 sm:text-base">
          To prevent man-in-the-middle attacks, the Cloud API validates the{" "}
          <code>integrity</code> field using a deterministic hash of the
          payload.
        </p>
        <CodeBlock
          language="javascript"
          title="Integrity Hash (JS Implementation)"
          code={`const generateHash = (descriptor, sessionToken, timestamp) => {
  const data = JSON.stringify(descriptor) + sessionToken + timestamp;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
};`}
        />
      </div>
    </div>
  </div>
);

const MethodologyContent = () => (
  <div>
    <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 sm:mb-8 sm:text-4xl">
      Detection Methodology
    </h2>

    <div className="space-y-8 sm:space-y-12">
      <div className="rounded-2xl border border-slate-100 p-5 sm:p-8">
        <h3 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-xl">
          Active Verification (State Machine)
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
          The SDK validates "aliveness" by requiring physiological responses to
          randomized challenges.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-5 sm:rounded-2xl sm:p-6">
            <h5 className="mb-2 text-sm font-bold sm:text-base">
              Blink Analysis (EAR)
            </h5>
            <p className="text-xs leading-relaxed text-slate-500">
              We calculate the Eye Aspect Ratio using 6 landmarks per eye. A
              blink is registered when the EAR drops below 0.25 after being
              above 0.3 (open).
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5 sm:rounded-2xl sm:p-6">
            <h5 className="mb-2 text-sm font-bold sm:text-base">
              Head Pose (3D)
            </h5>
            <p className="text-xs leading-relaxed text-slate-500">
              Yaw and Pitch are estimated by measuring the pixel-distance ratio
              between the nose bridge and the cheek boundaries in 3D space.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const APIRefContent = () => (
  <div>
    <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 sm:mb-8 sm:text-4xl">
      API & Events Reference
    </h2>

    <div className="space-y-8 sm:space-y-12">
      <div>
        <h3 className="mb-4 font-mono text-lg font-bold text-blue-600 sm:mb-6 sm:text-xl">
          LivenessSDK Configuration
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-100 sm:rounded-2xl">
          <table className="w-full min-w-125 text-left text-sm">
            <thead className="bg-slate-50 font-bold tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Option</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Default</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  name: "basePath",
                  def: '""',
                  desc: "Path to models directory.",
                },
                {
                  name: "challengeTimeout",
                  def: "5000",
                  desc: "Max ms per challenge.",
                },
                {
                  name: "minBrightness",
                  def: "-0.8",
                  desc: "Scale [-1.0, 1.0].",
                },
                {
                  name: "targetFPS",
                  def: "30",
                  desc: "Throttling for performance.",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 sm:px-6 sm:py-4">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500 sm:px-6 sm:py-4">
                    {row.def}
                  </td>
                  <td className="px-4 py-3 text-slate-500 sm:px-6 sm:py-4">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-bold text-slate-900 sm:mb-6">
          Event Registry
        </h3>
        <div className="space-y-4">
          {[
            { event: "ready", payload: "void", trigger: "Models loaded." },
            {
              event: "challenge",
              payload: "{ type, instruction }",
              trigger: "New action requested.",
            },
            {
              event: "success",
              payload: "LivenessResult",
              trigger: "Checks passed.",
            },
            {
              event: "failure",
              payload: "{ code, message }",
              trigger: "Security check failed.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <span className="font-mono text-sm font-bold text-blue-600">
                  "{item.event}"
                </span>
                <p className="mt-1 text-xs text-slate-500">{item.trigger}</p>
              </div>
              <span className="w-fit rounded bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-400">
                Payload: {item.payload}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Documentation = () => {
  const [activePage, setActivePage] = useState("introduction");
  const user = api.auth.getCurrentUser();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get("section") || hash;
    const validSections = [
      "introduction",
      "sdk-usage",
      "cloud-usage",
      "methodology",
      "api-ref",
    ];
    if (section && validSections.includes(section)) {
      setActivePage(section);
    }
  }, [location]);

  const scrollToTop = () => {
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTopicChange = (id) => {
    setActivePage(id);
    scrollToTop();
  };

  const menu = [
    {
      title: "Getting Started",
      items: [
        { id: "introduction", label: "Introduction", icon: Book },
        { id: "sdk-usage", label: "How to use SDK", icon: Code2 },
        { id: "cloud-usage", label: "How to use Cloud", icon: Cloud },
      ],
    },
    {
      title: "Deep Dive",
      items: [
        { id: "methodology", label: "Methodology", icon: Layers },
        { id: "api-ref", label: "API Reference", icon: FileCode },
      ],
    },
  ];

  const flatItems = menu.flatMap((g) => g.items);
  const currentIndex = flatItems.findIndex((i) => i.id === activePage);
  const prevItem = flatItems[currentIndex - 1];
  const nextItem = flatItems[currentIndex + 1];

  const renderContent = () => (
    <div key={activePage}>
      {(() => {
        switch (activePage) {
          case "introduction":
            return <IntroContent />;
          case "sdk-usage":
            return <SDKUsageContent />;
          case "cloud-usage":
            return <CloudUsageContent />;
          case "methodology":
            return <MethodologyContent />;
          case "api-ref":
            return <APIRefContent />;
          default:
            return <IntroContent />;
        }
      })()}
    </div>
  );

  const renderSidebarContent = () => (
    <>
      {menu.map((group, idx) => (
        <div key={idx} className="mb-6 last:mb-0">
          <h5 className="mb-2.5 px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            {group.title}
          </h5>
          <ul className="space-y-1">
            {group.items.map((item) => (
              <SidebarItem
                key={item.id}
                id={item.id}
                label={item.label}
                activeId={activePage}
                onClick={handleTopicChange}
                icon={item.icon}
              />
            ))}
          </ul>
        </div>
      ))}
    </>
  );

  const currentItem =
    flatItems.find((i) => i.id === activePage) || flatItems[0];
  const CurrentIcon = currentItem.icon;

  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);

  const pageContent = (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Custom Responsive Animated Mobile Topic Dropdown Selector */}
      <div className="relative mb-3 w-full lg:hidden">
        <button
          onClick={() => setTopicDropdownOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-3 px-4 shadow-sm transition-all hover:border-slate-300 active:scale-[0.99]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CurrentIcon className="h-4 w-4" />
            </div>
            <div className="flex min-w-0 flex-col text-left">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Topic
              </span>
              <span className="truncate text-sm font-bold text-slate-900">
                {currentItem.label}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              topicDropdownOpen ? "rotate-180 text-blue-600" : ""
            }`}
          />
        </button>

        {/* Custom Animated Topic Menu Panel */}
        {topicDropdownOpen && (
          <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 z-40 mt-2 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xl duration-150">
            {menu.map((group, idx) => (
              <div key={idx} className="mb-3 last:mb-0">
                <div className="mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activePage === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleTopicChange(item.id);
                          setTopicDropdownOpen(false);
                        }}
                        className={`group flex w-full cursor-pointer items-center rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition-all duration-150 sm:text-sm ${
                          isActive
                            ? "bg-blue-50/80 font-extrabold text-blue-600"
                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                        }`}
                      >
                        {ItemIcon && (
                          <ItemIcon
                            className={`mr-3 h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                              isActive
                                ? "text-blue-600"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                        )}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sub-navigation Sidebar for Docs Topics (Hidden on mobile, sticky on desktop) */}
      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs lg:block">
        {renderSidebarContent()}
      </aside>

      {/* Docs Main Content */}
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-8 md:p-10">
          {renderContent()}

          {/* Compact Inline Pagination Controls */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-100 pt-5 sm:mt-12">
            {prevItem ? (
              <button
                onClick={() => handleTopicChange(prevItem.id)}
                className="group inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600 transition-colors hover:text-blue-600 sm:text-sm"
              >
                <ArrowRight className="h-4 w-4 rotate-180 text-slate-400 transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
                <span>{prevItem.label}</span>
              </button>
            ) : (
              <div />
            )}

            {nextItem ? (
              <button
                onClick={() => handleTopicChange(nextItem.id)}
                className="group ml-auto inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700 sm:text-sm"
              >
                <span>{nextItem.label}</span>
                <ArrowRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1" />
              </button>
            ) : null}
          </div>
        </div>

        <footer className="mt-8 text-center text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} Liveness Cloud Platform. All rights
          reserved.
        </footer>
      </div>
    </div>
  );

  return user ? (
    <DashboardLayout>{pageContent}</DashboardLayout>
  ) : (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Shared Reusable Public Glassmorphism Header Navigation */}
      <Navbar />

      {/* Main Documentation Body with Original Light Slate Background */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12">
        {pageContent}
      </div>
    </div>
  );
};

export default Documentation;
