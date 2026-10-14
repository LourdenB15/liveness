import { BarChart3, Clock } from "lucide-react";

export function VerificationActivityChart({
  loading,
  stats,
  timeRange,
  hoveredDay,
  setHoveredDay,
  maxDaily,
  totalInTimeline,
  passedInTimeline,
  failedInTimeline,
  enrolledInTimeline,
}) {
  return (
    <div className="rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading flex items-center gap-2 text-sm font-bold text-slate-900">
            <BarChart3 className="h-4 w-4 text-[#2f5bf5]" />
            Verification Activity
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Daily challenge runs across the last {timeRange} days (
            {totalInTimeline} total: {passedInTimeline} passed,{" "}
            {failedInTimeline} failed, {enrolledInTimeline} enrolled)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 font-mono text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Failed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Enrolled</span>
          </div>
        </div>
      </div>

      {/* Interactive Inspection Bar (Strict fixed height to prevent layout shift) */}
      <div className="flex h-9 items-center justify-between border-b border-slate-100 px-1 text-xs">
        {hoveredDay ? (
          <div className="flex items-center gap-3 overflow-hidden font-mono whitespace-nowrap">
            <span className="font-bold text-slate-900">{hoveredDay.label}</span>
            <span className="text-slate-500">
              Total:{" "}
              <strong className="text-slate-800">{hoveredDay.total}</strong>
            </span>
            <span className="text-emerald-700">
              Passed: <strong>{hoveredDay.passed}</strong>
            </span>
            {hoveredDay.failed > 0 && (
              <span className="text-rose-700">
                Failed: <strong>{hoveredDay.failed}</strong>
              </span>
            )}
            {hoveredDay.enrolled > 0 && (
              <span className="text-purple-700">
                Enrolled: <strong>{hoveredDay.enrolled}</strong>
              </span>
            )}
          </div>
        ) : (
          <span className="flex items-center gap-1.5 text-xs whitespace-nowrap text-slate-400">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>Hover over a bar to inspect specific day counts</span>
          </span>
        )}
      </div>

      {/* Chart Histogram */}
      {loading ? (
        <div className="flex h-44 items-end gap-1.5 pt-4">
          {Array.from({ length: timeRange }).map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 animate-pulse rounded-t bg-slate-100"
            />
          ))}
        </div>
      ) : stats.timeline.length === 0 ? (
        <div className="flex h-44 flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold text-slate-700">
            No activity recorded in this period
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Verification checks submitted by your applications will graph here.
          </p>
        </div>
      ) : (
        <div className="pt-4" onMouseLeave={() => setHoveredDay(null)}>
          <div className="flex h-44 items-end">
            {stats.timeline.map((day, idx) => {
              const isHovered = hoveredDay?.date === day.date;
              const totalHeightPct =
                day.total > 0 ? Math.max((day.total / maxDaily) * 100, 8) : 0;

              return (
                <div
                  key={day.date || idx}
                  onMouseEnter={() => setHoveredDay(day)}
                  className={`flex h-full flex-1 cursor-pointer flex-col justify-end rounded-t px-0.5 transition-colors sm:px-1 ${
                    isHovered ? "bg-slate-100/80" : "hover:bg-slate-50"
                  }`}
                >
                  {day.total > 0 ? (
                    <div
                      style={{ height: `${totalHeightPct}%` }}
                      className="flex w-full flex-col justify-end overflow-hidden rounded-t"
                    >
                      {/* Stacked segments: Enrolled on top, Failed in middle, Passed on bottom */}
                      {day.enrolled > 0 && (
                        <div
                          style={{
                            height: `${(day.enrolled / day.total) * 100}%`,
                          }}
                          className="w-full bg-purple-500"
                        />
                      )}
                      {day.failed > 0 && (
                        <div
                          style={{
                            height: `${(day.failed / day.total) * 100}%`,
                          }}
                          className="w-full bg-rose-500"
                        />
                      )}
                      {day.passed > 0 && (
                        <div
                          style={{
                            height: `${(day.passed / day.total) * 100}%`,
                          }}
                          className="w-full bg-emerald-500"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="h-1 w-full rounded-xs bg-slate-200/70" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Day Labels Underneath */}
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 font-mono text-[10px] font-medium text-slate-400">
            {stats.timeline.map((day, idx) => {
              const shouldShow =
                timeRange === 7 ||
                (timeRange === 14 && idx % 2 === 0) ||
                (timeRange === 30 && idx % 5 === 0) ||
                idx === stats.timeline.length - 1;

              return (
                <span
                  key={day.date || idx}
                  className={`text-center ${
                    shouldShow ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ width: `${100 / stats.timeline.length}%` }}
                >
                  {day.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
