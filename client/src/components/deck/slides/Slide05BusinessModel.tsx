import type { StartupBlueprint } from '../../../types';

export function Slide05BusinessModel({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-700" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Business Model</span>
          <h2 className="text-5xl font-bold text-white mt-2">How We Operate</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 flex-1">
          <div className="glass-card p-6 border-violet-500/20">
            <p className="text-xs text-violet-400 font-medium uppercase tracking-wide mb-4">Model Overview</p>
            <p className="text-base text-slate-300 leading-relaxed">
              {blueprint.businessModel ?? 'Business model description will appear here.'}
            </p>
          </div>
          <div className="glass-card p-6 border-purple-500/20">
            <p className="text-xs text-purple-400 font-medium uppercase tracking-wide mb-4">Revenue Streams</p>
            <div className="space-y-3">
              {(blueprint.revenueStreams ?? []).map((rs, i) => (
                <div key={i} className="border-l-2 border-purple-500/40 pl-3">
                  <p className="text-sm font-medium text-white">{rs.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{rs.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
