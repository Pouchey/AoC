interface LoadingCardProps {
  accentColor: 'accent-blue' | 'accent-purple';
  message?: string;
}

export function LoadingCard({ accentColor, message = 'Loading code...' }: LoadingCardProps) {
  return (
    <div className="mt-4 bg-bg-panel rounded-lg p-6 border border-grid-line">
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 border-2 ${accentColor} border-t-transparent rounded-full animate-spin`}
        />
        <span className="text-text-secondary">{message}</span>
      </div>
    </div>
  );
}

