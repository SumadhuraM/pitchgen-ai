import { Sparkles } from 'lucide-react';
import type { StartupBlueprint } from '../../../types';

export function Slide01Cover({ blueprint }: { blueprint: Partial<StartupBlueprint> }) {
  return (
    <div className="slide-bg w-full h-full flex flex-col items-center justify-center p-16 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-sm text-sm text-violet-300 mb-8">
          <Sparkles className="w-4 h-4" />
          {blueprint.domain ?? 'Tech'}
        </div>
        <h1 className="text-6xl font-bold text-white mb-4 text-glow">
          {blueprint.startupName ?? 'Your Startup'}
        </h1>
        <p className="text-2xl text-slate-300 mb-8 italic">
          "{blueprint.tagline ?? 'Your tagline here'}"
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-purple-600 mx-auto rounded-full" />
      </div>
    </div>
  );
}
