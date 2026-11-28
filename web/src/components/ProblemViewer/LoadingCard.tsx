export function LoadingCard({ message = 'Loading the code…' }: { message?: string }) {
  return <p className="mt-4 text-sm text-text-secondary">{message}</p>;
}
