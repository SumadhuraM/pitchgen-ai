import type { StartupBlueprint } from '../../../types';

export function Slide06Competitors({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-600" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Competitive Landscape</span>
          <h2 className="text-5xl font-bold text-white mt-2">Know Your Competition</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 flex-1">
          {(blueprint.competitors ?? []).slice(0, 3).map((c, i) => (
            <div key={i} className="glass-card p-5 border-orange-500/20 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-300">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-white text-sm">{c.name}</h4>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-xs text-emerald-400 font-medium mb-1">Strengths</p>
                  {(c.strengths ?? []).slice(0, 2).map((s, j) => (
                    <p key={j} className="text-xs text-slate-400">+ {s}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-red-400 font-medium mb-1">Weaknesses</p>
                  {(c.weaknesses ?? []).slice(0, 2).map((w, j) => (
                    <p key={j} className="text-xs text-slate-400">− {w}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
