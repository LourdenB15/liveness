import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function MetricsGrid({ loading, cards }) {
  if (loading) {
    return (
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-xs"
            >
              <Skeleton height={14} width={100} />
              <div className="mt-3 space-y-1">
                <Skeleton height={28} width={70} />
                <Skeleton height={12} width="75%" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[10px] border border-slate-200/80 bg-white p-5 shadow-xs transition-colors hover:border-slate-300"
        >
          <p className="text-xs font-semibold text-slate-500">{card.label}</p>
          <p className="font-heading mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {card.value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
