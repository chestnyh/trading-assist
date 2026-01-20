import { Plus } from "lucide-react";

interface AddRulesSettingsButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function AddRulesSettingsButton({ onClick, disabled }: AddRulesSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        w-full
        rounded-lg
        py-6
        text-xl
        font-medium
        flex items-center justify-center
        border-2 border-border
        transition
        ${
          disabled
            ? "bg-background text-muted cursor-not-allowed opacity-60"
            : "bg-accent-hover/50 text-primary hover:bg-accent-hover cursor-pointer"
        }
      `}
    >
      <Plus className="w-6 h-6 mr-2" />
      Add settings rules
    </button>
  );
}
