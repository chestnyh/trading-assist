import { useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";

type DetailItem = {
  label: string;
  value: string;
};

interface RuleSettingProps {
  name: string;
  code: string;
  tags?: string[];
  details?: DetailItem[];
  initiallyExpanded?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RuleSetting({
  name,
  code,
  tags = [],
  details = [],
  initiallyExpanded,
  onEdit,
  onDelete,
}: RuleSettingProps) {
  const [expanded, setExpanded] = useState(Boolean(initiallyExpanded));

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="
            h-8 w-8
            flex items-center justify-center
            rounded-md
            hover:bg-accent-hover/40
            text-accent
            transition
            border border-border
          "
          aria-label={expanded ? "Collapse rule setting" : "Expand rule setting"}
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="text-primary text-sm md:text-base font-medium truncate">
              {name}
            </div>
            <span
              className="
                px-2 py-0.5
                rounded-md
                text-xs
                border border-border
                bg-accent-hover/40
                text-accent
              "
            >
              {code}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="
                    px-2 py-0.5
                    rounded-md
                    text-xs
                    border border-border
                    bg-accent-hover/30
                    text-primary
                  "
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="
              h-8 w-8
              flex items-center justify-center
              rounded-md
              hover:bg-accent-hover/40
              text-accent
              transition
              border border-border
            "
            aria-label="Edit rule setting"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="
              h-8 w-8
              flex items-center justify-center
              rounded-md
              bg-red-500/20
              text-red-500
              transition
              border border-red-500
              hover:bg-red-500/40
            "
            aria-label="Delete rule setting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && details.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-col gap-2 text-primary text-sm">
            {details.map((d, idx) => (
              <div key={`${d.label}-${idx}`} className="leading-relaxed">
                <span className="font-medium">{d.label}:</span>{" "}
                <span className="break-all">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
