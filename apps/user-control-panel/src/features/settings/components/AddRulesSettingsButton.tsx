import { Plus } from "lucide-react";

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
      className="
        w-full
        text-primary
        rounded-lg
        py-6
        text-xl
        font-medium
        flex items-center justify-center
        border-2 border-border
        transition
      "
      style={{
        backgroundColor: disabled ? "var(--background)" : "color-mix(in oklab, var(--accent-hover), transparent 50%)",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Plus className="w-6 h-6 mr-2" />
      Add settings rules
    </button>
  );
}
