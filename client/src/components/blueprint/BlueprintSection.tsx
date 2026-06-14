import type { ReactNode } from 'react';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { ErrorBanner } from '../ui/ErrorBanner';
import type { SectionStatus } from '../../types';

interface BlueprintSectionProps {
  title: string;
  status: SectionStatus;
  error?: string;
  onRetry?: () => void;
  children: ReactNode;
  skeletonLines?: number;
}

export function BlueprintSection({
  title,
  status,
  error,
  onRetry,
  children,
  skeletonLines = 4,
}: BlueprintSectionProps) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm uppercase tracking-wide">{title}</h3>
        <div className="flex items-center gap-2">
          {status === 'loading' && (
            <div className="w-4 h-4 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" />
          )}
          {status === 'success' && (
            <span className="text-xs text-emerald-400 font-medium">Generated</span>
          )}
        </div>
      </div>

      {status === 'loading' && <LoadingSkeleton lines={skeletonLines} />}
      {status === 'error' && (
        <ErrorBanner message={error ?? 'Generation failed.'} onRetry={onRetry} />
      )}
      {(status === 'success' || status === 'idle') && children}
    </div>
  );
}
