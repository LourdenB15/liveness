import Navbar from "../components/Navbar";
import { LivenessChecker } from "../components/demo/LivenessChecker";

export default function Demo() {
  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-900 selection:bg-[#2f5bf5] selection:text-white">
      <Navbar />

      <main id="main-content" className="px-4 py-8 sm:px-6 md:px-12 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Biometric Liveness Verification
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs text-slate-600 sm:text-sm">
              Runs 468-point landmark tracking and ResNet-34 face descriptor extraction 100% inside your browser via WebAssembly and WebGL.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-6 md:p-8">
            <LivenessChecker />
          </div>
        </div>
      </main>
    </div>
  );
}
