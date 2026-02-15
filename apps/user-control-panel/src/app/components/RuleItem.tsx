import { Pencil, Trash2 } from "lucide-react";
import { Rule } from "../contexts/RulesContext";

export function RuleItem({ rule }: { rule: Rule }) {
    return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50 transition-all hover:border-primary/30">
      <div className="flex items-center gap-4 px-4 py-3">

        <div className="flex items-center gap-2 min-w-0">
          <div className="text-primary font-medium text-sm md:text-base whitespace-nowrap flex-shrink-0">
            {rule.name}
          </div>
          <div className="text-text-secondary text-xs md:text-sm truncate italic">
            {rule.description}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border hover:bg-accent-hover/40 text-accent transition"
            title="Edit rule"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border hover:bg-error/10 text-error transition"
            title="Delete rule"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}