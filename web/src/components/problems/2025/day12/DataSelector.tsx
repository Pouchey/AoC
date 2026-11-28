interface DataSelectorProps {
  dataSource: 'example' | 'input';
  onSelect: (source: 'example' | 'input') => void;
  inputAvailable: boolean;
}

export function DataSelector({ dataSource, onSelect, inputAvailable }: DataSelectorProps) {
  return (
    <div className="inline-flex rounded-lg bg-bg-dark p-1">
      <button
        onClick={() => onSelect('example')}
        className={`px-3 py-1 rounded-md text-sm transition-colors ${
          dataSource === 'example'
            ? 'bg-bg-highlight text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        Example
      </button>
      {inputAvailable && (
        <button
          onClick={() => onSelect('input')}
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            dataSource === 'input'
              ? 'bg-bg-highlight text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Input
        </button>
      )}
    </div>
  );
}
