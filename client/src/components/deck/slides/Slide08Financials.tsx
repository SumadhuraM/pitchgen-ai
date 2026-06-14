import type { StartupBlueprint } from '../../../types';

export function Slide08Financials({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  const funding = blueprint.fundingRequirement;
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-cyan-600" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">Financials</span>
          <h2 className="text-5xl font-bold text-white mt-2">Revenue & Projections</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 flex-1">
          <div className="glass-card p-6 border-teal-500/20">
            <p className="text-xs text-teal-400 font-medium uppercase tracking-wide mb-4">Revenue Streams</p>
            <div className="space-y-3">
              {(blueprint.revenueStreams ?? []).map((rs, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{rs.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{rs.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 border-cyan-500/20 flex flex-col">
            <p className="text-xs text-cyan-400 font-medium uppercase tracking-wide mb-4">Funding Required</p>
            <div className="text-4xl font-bold text-white mb-4">{funding?.amountRange ?? 'TBD'}</div>
            <p className="text-xs text-slate-400 mb-3">Use of Funds:</p>
            <div className="space-y-2 flex-1">
              {(funding?.usesOfFunds ?? []).map((use, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  {use}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
