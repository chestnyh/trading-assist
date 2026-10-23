import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { DetailField } from "./RuleSetting";
import { CHIP, CHIP_NEUTRAL, ICON_BUTTON, ICON_BUTTON_DANGER, SUBTLE_SURFACE } from "../../../shared/ui/styles";

type DetailItem = {
  label: string;
  value: string;
};

interface RuleSettingViewProps {
  name: string;
  code: string;
  tags: string[];
  description?: string;
  details: DetailItem[];
  initiallyExpanded?: boolean;
  topSlot?: JSX.Element | null;
  extraSlot?: JSX.Element | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RuleSettingView({
  name,
  code,
  tags,
  description,
  details,
  initiallyExpanded,
  topSlot,
  extraSlot,
  onEdit,
  onDelete,
}: RuleSettingViewProps) {
  const [expanded, setExpanded] = useState(Boolean(initiallyExpanded));

  useEffect(() => {
    if (initiallyExpanded) {
      setExpanded(true);
    }
  }, [initiallyExpanded]);

  return (
    <div className={SUBTLE_SURFACE}>
      {topSlot && <div className="px-4 pt-4">{topSlot}</div>}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`${ICON_BUTTON} !h-8 !w-8`}
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
            <div className="text-sm md:text-base font-semibold text-neutral-950 dark:text-white truncate">
              {name}
            </div>
            <span className={`${CHIP_NEUTRAL} font-mono`}>
              {code}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((t, i) => (
                <span key={`${t}-${i}`} className={CHIP}>
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
            className={`${ICON_BUTTON} !h-8 !w-8`}
            aria-label="Edit rule setting"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={`${ICON_BUTTON_DANGER} !h-8 !w-8`}
            aria-label="Delete rule setting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (details.length > 0 || Boolean(extraSlot) || Boolean(description?.trim())) && (
        <div className="px-4 pb-4">
          {description?.trim() && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed mb-3">
              {description.trim()}
            </div>
          )}
          {details.length > 0 && (
            <div className="flex flex-col gap-2 text-sm text-neutral-900 dark:text-neutral-100">
              {details.map((d, idx) => (
                <div key={`${d.label}-${idx}`} className="leading-relaxed">
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">{d.label}:</span>{" "}
                  <span className="break-all font-mono text-xs">{d.value}</span>
                </div>
              ))}
            </div>
          )}
          {extraSlot && <div className={details.length > 0 ? "mt-3" : undefined}>{extraSlot}</div>}
        </div>
      )}
    </div>
  );
}
