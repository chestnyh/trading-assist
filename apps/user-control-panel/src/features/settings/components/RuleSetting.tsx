import { useMemo, useState, useEffect } from "react";
import RuleSettingForm from "./RuleSettingForm";
import RuleSettingView from "./RuleSettingView";

type DetailItem = {
  label: string;
  value: string;
};

export type DetailField = {
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  pattern?: string;
  type?: "string" | "array";
};

interface RuleSettingProps {
  name: string;
  code: string;
  tags?: string[];
  description?: string;
  details?: DetailItem[];
  initiallyExpanded?: boolean;
  mode?: "view" | "edit";
  detailsSchema?: DetailField[];
  topSlot?: JSX.Element | null;
  extraSlot?: JSX.Element | null;
  onSave?: (data: {
    name: string;
    code: string;
    tags: string[];
    description?: string;
    details: { label: string; value: string }[];
  }) => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RuleSetting({
  name,
  code,
  tags = [],
  description,
  details = [],
  initiallyExpanded,
  mode: controlledMode,
  detailsSchema = [],
  topSlot,
  extraSlot,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: RuleSettingProps) {
  const [internalMode, setInternalMode] = useState<"view" | "edit">("view");
  const mode = controlledMode ?? internalMode;

  useEffect(() => {
    // keep local mode in sync when parent changes mode prop
    if (controlledMode) {
      setInternalMode(controlledMode);
    }
  }, [name]);

  if (mode === "edit") {
    const initialDetails: Record<string, string> = {};
    detailsSchema.forEach((f) => {
      const found = details.find((d) => d.label === f.label);
      initialDetails[f.key] = found?.value ?? "";
    });
    return (
      <RuleSettingForm
        initialName={name}
        initialCode={code}
        initialTags={tags}
        initialDescription={description}
        detailsSchema={detailsSchema}
        initialDetails={initialDetails}
        onCancel={() => {
          if (onCancel) {
            onCancel();
          } else if (!controlledMode) {
            setInternalMode("view");
          }
        }}
        onSave={(data) => {
          onSave?.(data);
          if (!controlledMode) {
            setInternalMode("view");
          }
        }}
      />
    );
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else if (!controlledMode) {
      setInternalMode("edit");
    }
  };

  return (
    <RuleSettingView
      name={name}
      code={code}
      tags={tags}
      description={description}
      details={details}
      initiallyExpanded={initiallyExpanded}
      topSlot={topSlot}
      extraSlot={extraSlot}
      onEdit={handleEdit}
      onDelete={onDelete}
    />
  );
}
