interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-300">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-400 hover:text-red-300 transition-colors flex-shrink-0 font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
}
