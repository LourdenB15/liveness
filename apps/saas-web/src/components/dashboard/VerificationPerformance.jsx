import { ShieldCheck } from "lucide-react";

export function VerificationPerformance({
  verificationPassRate,
  verificationFailRate,
  totalVerifications,
  passedCount,
  failedCount,
  totalUsers,
}) {
  return (
    <div className="flex flex-col justify-between rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-xs">
      <div>
        <div className="mb-4 border-b border-slate-100 pb-3.5">
          <h2 className="font-heading flex items-center gap-2 text-sm font-bold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-[#2f5bf5]" />
            Verification Performance
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Pass vs. reject accuracy on active challenges
          </p>
        </div>

        {/* Verification Pass / Reject Ratio Meter */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between font-mono text-xs">
            <span className="font-bold text-emerald-700">
              {verificationPassRate}% Passed
            </span>
            <span className="font-semibold text-rose-700">
              {verificationFailRate}% Rejected
            </span>
          </div>

          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            {totalVerifications > 0 ? (
              <>
                <div
                  style={{ width: `${verificationPassRate}%` }}
                  className="bg-emerald-500 transition-all duration-300"
                />
                <div
                  style={{ width: `${verificationFailRate}%` }}
                  className="bg-rose-500 transition-all duration-300"
                />
              </>
            ) : (
              <div className="w-full bg-slate-200/70" />
            )}
          </div>

          <p className="font-mono text-[11px] text-slate-400">
            {totalVerifications.toLocaleString()} total verification{" "}
            {totalVerifications === 1 ? "attempt" : "attempts"} evaluated
          </p>
        </div>

        {/* Detailed Row Items */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Passed Checks
                </p>
                <p className="text-[10px] text-slate-500">
                  Matched identity & satisfied gesture
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-bold text-slate-900">
                {passedCount.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] font-semibold text-emerald-700">
                {verificationPassRate}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Rejected Checks
                </p>
                <p className="text-[10px] text-slate-500">
                  Failed gesture or similarity mismatch
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-bold text-slate-900">
                {failedCount.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] font-semibold text-rose-700">
                {verificationFailRate}%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Enrolled Identities
                </p>
                <p className="text-[10px] text-slate-500">
                  Stored 128D facial descriptors
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-bold text-slate-900">
                {(totalUsers || 0).toLocaleString()}
              </p>
              <p className="font-mono text-[10px] font-semibold text-purple-700">
                Registered
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
