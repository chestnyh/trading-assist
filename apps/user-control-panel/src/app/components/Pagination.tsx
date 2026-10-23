import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { ICON_BUTTON, FOCUS_RING } from "../../shared/ui/styles";

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

    const left = current - delta;
    const right = current + delta;

    for (let i = 1; i <= totalPages; i++) {

      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      }

      else if(i === left - 1 || i === right + 1){
        pages.push("...");
      }

      if (i > right && i < totalPages - 1) {
        i = totalPages - 1;
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-2 select-none">
      {current > 1 && (
        <button
          onClick={() => onChange(current - 1)}
          aria-label="Previous page"
          className={ICON_BUTTON}
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <div key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-neutral-400">
                <MoreHorizontal size={16} />
              </div>
            );
          }

          const isSelected = page === current;

          return (
            <button
              key={`page-${page}`}
              onClick={() => onChange(page as number)}
              aria-current={isSelected ? "page" : undefined}
              className={`
                min-w-[36px] h-9 px-2
                flex items-center justify-center
                rounded-full transition-colors font-semibold text-sm cursor-pointer
                ${FOCUS_RING}
                ${isSelected
                  ? "bg-forest-300 text-white dark:bg-brand-300 dark:text-forest-300"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"}
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
          aria-label="Next page"
          className={ICON_BUTTON}
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
