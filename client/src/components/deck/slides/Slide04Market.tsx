import type { StartupBlueprint } from '../../../types';

export function Slide04Market({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  const market = blueprint.marketOpportunity;
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-600" />
      <div className="absolute bottom-8 right-8 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">Market Opportunity</span>
          <h2 className="text-5xl font-bold text-white mt-2">The Big Picture</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 flex-1">
          <div className="col-span-2 glass-card p-6 border-blue-500/20 flex flex-col">
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wide mb-3">Market Growth</p>
            <p className="text-base text-slate-300 leading-relaxed flex-1">
              {market?.growthNarrative ?? 'Market growth narrative will appear here.'}
            </p>
            {(market?.dataPoints?.length ?? 0) > 0 && (
              <div className="mt-4 space-y-2">
                {(market?.dataPoints ?? []).map((dp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">▸</span> {dp}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="glass-card p-6 border-cyan-500/20 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-cyan-400 font-medium uppercase tracking-wide mb-3">TAM</p>
            <p className="text-3xl font-bold text-white">{market?.tam ?? 'TBD'}</p>
            <p className="text-xs text-slate-500 mt-2">Total Addressable Market</p>
          </div>
        </div>
      </div>
    </div>
  );
}
