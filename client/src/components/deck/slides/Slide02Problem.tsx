import type { StartupBlueprint } from '../../../types';

export function Slide02Problem({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  return (
    <div className="slide-bg w-full h-full flex flex-col p-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-600" />
      <div className="absolute top-1/2 right-8 w-48 h-48 bg-red-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest text-red-400 uppercase">The Problem</span>
          <h2 className="text-5xl font-bold text-white mt-2">What's Broken?</h2>
        </div>
        <div className="flex-1 flex items-center">
          <div className="glass-card p-8 border-red-500/20">
            <p className="text-lg text-slate-300 leading-relaxed">
              {blueprint.problemStatement ?? 'Problem statement will appear here.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
