import type { Competitor } from '../../types';

interface CompetitorTableProps {
  competitors: Competitor[];
}

export function CompetitorTable({ competitors }: CompetitorTableProps) {
  return (
    <div className="space-y-4">
      {competitors.map((c, i) => (
        <div key={i} className="glass-card-sm p-4">
          <h4 className="font-semibold text-sm text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center font-bold">
              {i + 1}
            </span>
            {c.name}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-emerald-400 mb-1.5">Strengths</p>
              <ul className="space-y-1">
                {(c.strengths ?? []).map((s, j) => (
                  <li key={j} className="text-xs text-slate-300 flex items-start gap-1">
                    <span className="text-emerald-400 flex-shrink-0">+</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-red-400 mb-1.5">Weaknesses</p>
              <ul className="space-y-1">
                {(c.weaknesses ?? []).map((w, j) => (
                  <li key={j} className="text-xs text-slate-300 flex items-start gap-1">
                    <span className="text-red-400 flex-shrink-0">−</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
