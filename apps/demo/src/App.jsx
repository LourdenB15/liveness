import { LivenessChecker } from "./components/LivenessChecker";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white shadow-sm">
                L
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Liveness <span className="text-blue-600">SDK</span>
              </span>
            </div>
            <div className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
              <a
                href="https://github.com/johnpaulpatigas/liveness/blob/main/README.md"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-blue-600"
              >
                Documentation
              </a>
              <a
                href="https://github.com/johnpaulpatigas/liveness"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-blue-600"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex grow flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-block rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            Information Technology Capstone 2026
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Liveness SDK
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
            A framework-agnostic SDK for active liveness detection and face
            matching using{" "}
            <span className="font-semibold text-slate-800">MediaPipe</span> and{" "}
            <span className="font-semibold text-slate-800">TensorFlow.js</span>.
          </p>
        </div>

        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="p-6 sm:p-10">
            <LivenessChecker />
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
          <p className="text-sm text-slate-500">
            &copy; 2026 John Paul Patigas. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <span>v1.0.0 (Beta)</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">Powered by WebGL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
