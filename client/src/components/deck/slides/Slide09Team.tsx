import type { StartupBlueprint } from '../../../types';

export function Slide09Team({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600" />
      <div className="absolute bottom-8 right-8 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Team & Vision</span>
          <h2 className="text-5xl font-bold text-white mt-2">Who We Are</h2>
        </div>
        <div className="flex flex-col gap-6 flex-1 justify-center">
          <div className="glass-card p-6 border-indigo-500/20">
            <p className="text-sm font-semibold text-white mb-4">Target Audience</p>
            <div className="grid grid-cols-2 gap-4">
              {(blueprint.targetAudience ?? []).map((seg, i) => (
                <div key={i} className="glass-card-sm p-4">
                  <p className="text-sm font-semibold text-violet-300 mb-1">{seg.segment}</p>
                  <p className="text-xs text-slate-400 mb-1">{seg.demographics}</p>
                  <p className="text-xs text-slate-500">{seg.behaviours}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 border-violet-500/20">
            <p className="text-xs text-violet-400 font-medium uppercase tracking-wide mb-3">Our Vision</p>
            <p className="text-base text-slate-300 italic">
              Building {blueprint.startupName ?? 'this startup'} to become the leading solution in {blueprint.domain ?? 'our space'},
              transforming how people interact with technology to solve real-world problems at scale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
