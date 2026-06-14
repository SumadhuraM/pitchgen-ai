import type { StartupBlueprint } from '../../../types';

export function Slide03Solution({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />
      <div className="absolute top-1/3 right-8 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Our Solution</span>
          <h2 className="text-5xl font-bold text-white mt-2">How We Fix It</h2>
        </div>
        <div className="flex gap-8 flex-1 items-center">
          <div className="flex-1 glass-card p-8 border-emerald-500/20">
            <p className="text-lg text-slate-300 leading-relaxed">
              {blueprint.solution ?? 'Solution description will appear here.'}
            </p>
          </div>
          <div className="flex-shrink-0 glass-card p-6 text-center w-56 border-violet-500/20">
            <p className="text-xs text-violet-400 font-medium uppercase tracking-wide mb-3">USP</p>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              {blueprint.usp ?? 'Unique value proposition'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
