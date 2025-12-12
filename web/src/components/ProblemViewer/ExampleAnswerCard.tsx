interface ExampleAnswerCardProps {
  answer: string | number;
}

export function ExampleAnswerCard({ answer }: ExampleAnswerCardProps) {
  return (
    <div className="bg-bg-highlight rounded-xl p-4 border border-grid-line">
      <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-1 h-3 bg-accent-gold rounded-full" />
        Example Answer
      </h4>
      <p className="font-mono text-2xl text-accent-gold font-bold">{answer}</p>
    </div>
  );
}

