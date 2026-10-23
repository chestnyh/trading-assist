import { Plus } from "lucide-react";
import { FOCUS_RING } from "../../../shared/ui/styles";

interface AddRulesSettingsButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function AddRulesSettingsButton({ onClick, disabled }: AddRulesSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        rounded-xl
        py-4
        text-sm
        font-semibold
        flex items-center justify-center
        border border-dashed border-neutral-300 dark:border-neutral-700
        text-forest-200 dark:text-brand-300
        hover:bg-brand-0 hover:border-forest-100 dark:hover:bg-forest-300/40 dark:hover:border-brand-300/60
        transition-colors cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${FOCUS_RING}
      `}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add settings rules
    </button>
  );
}
