import { Plus } from "lucide-react";

interface AddRulesSettingsButtonProps {
  onClick?: () => void;
}

export default function AddRulesSettingsButton({ onClick }: AddRulesSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        bg-accent-hover/50
        text-primary
        rounded-lg
        py-6
        text-xl
        font-medium
        flex items-center justify-center
        border-2 border-border
        hover:bg-accent-hover
        transition
      "
    >
      <Plus className="w-6 h-6 mr-2" />
      Add settings rules
    </button>
  );
}

