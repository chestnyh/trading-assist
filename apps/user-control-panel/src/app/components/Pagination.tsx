interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4 mt-4">
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="
          px-4 py-2
          flex items-center justify-center
          rounded-md border-2 border-border
          bg-bg-secondary/50 text-accent
          hover:bg-accent-hover/40 transition
          disabled:opacity-30 disabled:hover:bg-bg-secondary/50
          text-sm font-medium
        "
      >
        Previous
      </button>

      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-background border border-border shadow-sm">
        <span className="text-xs text-text-secondary uppercase tracking-wider">Page</span>
        <span className="text-sm font-bold text-primary">{current}</span>
        <span className="text-xs text-text-secondary">of</span>
        <span className="text-sm font-bold text-primary">{totalPages}</span>
      </div>

      <button
        disabled={current === totalPages}
        onClick={() => onChange(current + 1)}
        className="
          px-4 py-2
          flex items-center justify-center
          rounded-md border-2 border-border
          bg-bg-secondary/50 text-accent
          hover:bg-accent-hover/40 transition
          disabled:opacity-30 disabled:hover:bg-bg-secondary/50
          text-sm font-medium
        "
      >
        Next
      </button>
    </div>
  );
}