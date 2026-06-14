import type { SwotAnalysis } from '../../types';

interface SwotGridProps {
  swot: SwotAnalysis;
}

const SWOT_CONFIG = [
  { key: 'strengths' as const, label: 'Strengths', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { key: 'weaknesses' as const, label: 'Weaknesses', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { key: 'opportunities' as const, label: 'Opportunities', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { key: 'threats' as const, label: 'Threats', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
];

export function SwotGrid({ swot }: SwotGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {SWOT_CONFIG.map(({ key, label, color, bg }) => (
        <div key={key} className={`rounded-xl p-4 border ${bg}`}>
          <h4 className={`font-semibold text-sm mb-3 ${color}`}>{label}</h4>
          <ul className="space-y-1.5">
            {(swot[key] ?? []).map((item, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className={`${color} mt-0.5 flex-shrink-0`}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
