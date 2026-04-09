interface SelectedFilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface SelectedFilterChipsProps {
  chips: SelectedFilterChip[];
  onClearAll: () => void;
}

export function SelectedFilterChips({ chips, onClearAll }: SelectedFilterChipsProps) {
  if (!chips.length) {
    return null;
  }

  return (
    <div className="jp-chip-row">
      {chips.map((chip) => (
        <button key={chip.id} type="button" className="jp-chip" onClick={chip.onRemove}>
          <span>{chip.label}</span>
          <span aria-hidden="true">×</span>
        </button>
      ))}
      <button type="button" className="jp-chip jp-chip-clear" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
}
