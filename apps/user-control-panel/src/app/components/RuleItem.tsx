import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { Rule } from "../contexts/RulesContext";
import { useNavigate } from "react-router-dom";
import { CARD, ICON_BUTTON, ICON_BUTTON_DANGER } from "../../shared/ui/styles";

interface RuleItemProps {
  rule: Rule;
  onDelete: (id: string) => void;
}

export function RuleItem({ rule, onDelete }: RuleItemProps) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/rules/${rule.id}`);
  };

    return (
    <div
      onClick={handleRowClick}
      className={`${CARD} group transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer select-none`}
    >
      <div className="flex items-center gap-4 px-5 py-4">

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-base text-neutral-950 dark:text-white truncate">
            {rule.name}
          </div>
          {rule.description && (
            <div className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {rule.description}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={ICON_BUTTON}
            title="Edit rule"
            aria-label="Edit rule"
            onClick={() => {
              navigate(`/rules/${rule.id}/update`);
            }}
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            className={ICON_BUTTON_DANGER}
            title="Delete rule"
            aria-label="Delete rule"
            onClick={() => {
              onDelete(rule.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <ChevronRight className="w-5 h-5 text-neutral-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </div>
  );
}
