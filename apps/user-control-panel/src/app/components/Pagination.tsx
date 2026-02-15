import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (
        (i === current - delta - 1) ||
        (i === current + delta + 1)
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-2 py-4 mt-4 select-none">
      {current > 1 && (
        <button
          onClick={() => onChange(current - 1)}
          className="h-9 w-9 flex items-center justify-center rounded-md border-2 border-border bg-bg-secondary/50 text-accent hover:bg-accent-hover/40 transition"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <div key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-text-secondary">
                <MoreHorizontal size={16} />
              </div>
            );
          }

          const isSelected = page === current;

          return (
            <button
              key={`page-${page}`}
              onClick={() => onChange(page as number)}
              className={`
                min-w-[36px] h-9 px-2
                flex items-center justify-center
                rounded-md border-2 transition font-medium text-sm
                ${isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-bg-secondary/50 text-text-secondary hover:border-primary/30 hover:text-primary"}
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      {current < totalPages && (
        <button
          onClick={() => onChange(current + 1)}
          className="h-9 w-9 flex items-center justify-center rounded-md border-2 border-border bg-bg-secondary/50 text-accent hover:bg-accent-hover/40 transition"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
