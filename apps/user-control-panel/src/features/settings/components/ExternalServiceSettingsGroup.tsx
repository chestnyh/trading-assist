import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "./AddRulesSettingsButton";
import RuleSetting from "./RuleSetting";

export type DetailField = {
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  pattern?: RegExp;
  type?: "string" | "array";
};

interface ExternalServiceSettingsGroupProps {
  name: string;
  logoUrl?: string;
  logoTag?: string;
  logoKey?: string;
  fieldsSchema?: DetailField[];
}

export default function ExternalServiceSettingsGroup({
  name,
  logoUrl,
  logoTag,
  logoKey,
  fieldsSchema,
}: ExternalServiceSettingsGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [settings, setSettings] = useState<
    {
      name: string;
      code: string;
      tags: string[];
      details: { label: string; value: string }[];
      isNew?: boolean;
    }[]
  >([]);

  const hasSchema = Boolean(fieldsSchema && fieldsSchema.length > 0);

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background border border-border overflow-hidden">
          {!showPlaceholder ? (
            <img
              src={logoUrl || ""}
              alt={`${name} logo`}
              className="w-full h-full object-contain"
              onError={() => {
                setShowPlaceholder(true);
              }}
            />
          ) : (
            <span className="text-xs text-primary" data-logo-tag={logoTag || `logo-${name.toLowerCase()}`}>Logo</span>
          )}
        </div>

        <div className="flex-1 text-primary text-sm md:text-base">
          {name}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="
            ml-auto
            h-8 w-8
            flex items-center justify-center
            rounded-md
            hover:bg-accent-hover/40
            text-accent
            transition
            border border-border
          "
          aria-label={expanded ? "Collapse service group" : "Expand service group"}
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          {!hasSchema ? (
            <div className="mt-2 text-secondary text-sm">
              No fields schema configured for this service. Settings cannot be created or saved.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {settings.map((s, i) => (
                  <RuleSetting
                    key={`${s.code}-${i}`}
                    name={s.name}
                    code={s.code}
                    tags={s.tags}
                    details={s.details}
                    detailsSchema={fieldsSchema!}
                    mode={s.isNew ? "edit" : "view"}
                    onSave={(data) => {
                      setSettings((prev) => {
                        const next = [...prev];
                        next[i] = { ...data, isNew: false };
                        return next;
                      });
                    }}
                    onCancel={
                      s.isNew
                        ? () => {
                            setSettings((prev) => prev.filter((_, idx) => idx !== i));
                          }
                        : undefined
                    }
                    onDelete={() => {
                       setSettings((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                  />
                ))}
              </div>
              <div className="mt-3">
                <AddRulesSettingsButton
                  onClick={() => {
                     setSettings((prev) => [
                       ...prev,
                       { name: "", code: "", tags: [], details: [], isNew: true },
                     ]);
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
