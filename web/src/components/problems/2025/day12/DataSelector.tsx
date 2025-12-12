interface DataSelectorProps {
  dataSource: 'example' | 'input';
  onSelect: (source: 'example' | 'input') => void;
}

export function DataSelector({ dataSource, onSelect }: DataSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onSelect('example')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          dataSource === 'example'
            ? 'bg-accent-blue text-white'
            : 'bg-bg-panel text-text-secondary hover:text-text-primary border border-grid-line'
        }`}
      >
        Example
      </button>
      <button
        onClick={() => onSelect('input')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          dataSource === 'input'
            ? 'bg-accent-blue text-white'
            : 'bg-bg-panel text-text-secondary hover:text-text-primary border border-grid-line'
        }`}
      >
        Input
      </button>
    </div>
  );
}
