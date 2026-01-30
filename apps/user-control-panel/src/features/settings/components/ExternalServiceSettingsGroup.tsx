import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "./AddRulesSettingsButton";
import RuleSetting from "./RuleSetting";
import { ConfirmationModal } from "../../../shared/ui/modals/ConfirmationModal";
import { RuleSettingResponseDto } from "@trading-bot/api-client";

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
  ruleSettings?: RuleSettingResponseDto[];
}

export default function ExternalServiceSettingsGroup({
  name,
  logoUrl,
  logoTag,
  logoKey,
  fieldsSchema,
  ruleSettings = [],
}: ExternalServiceSettingsGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [settings, setSettings] = useState<
    {
      name: string;
      code: string;
      tags: string[];
      details: { label: string; value: string }[];
      isNew?: boolean;
      isEditing?: boolean;
    }[]
  >([]);

  const hasSchema = Boolean(fieldsSchema && fieldsSchema.length > 0);

  useEffect(() => {
    if (ruleSettings.length > 0 && fieldsSchema) {
      const mappedSettings = ruleSettings.map((rule) => {
        const details = fieldsSchema.map((field) => ({
          label: field.label,
          value: (rule.configuration[field.key] as string) || "",
        }));
        
        return {
          name: rule.name,
          code: rule.code,
          tags: [], // Tags not yet supported in DTO?
          details,
          isNew: false,
          isEditing: false,
        };
      });
      setSettings(mappedSettings);
    }
  }, [ruleSettings, fieldsSchema]);

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
                    detailsSchema={fieldsSchema || []}
                    mode={s.isNew || s.isEditing ? "edit" : "view"}
                    onSave={(data) => {
                      setSettings((prev) => {
                        const next = [...prev];
                        next[i] = { ...data, isNew: false, isEditing: false };
                        return next;
                      });
                    }}
                    onEdit={() => {
                      setSettings((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], isEditing: true };
                        return next;
                      });
                    }}
                    onCancel={() => {
                      if (s.isNew) {
                        setSettings((prev) => prev.filter((_, idx) => idx !== i));
                      } else {
                        setSettings((prev) => {
                          const next = [...prev];
                          next[i] = { ...next[i], isEditing: false };
                          return next;
                        });
                      }
                    }}
                    onDelete={() => {
                      setDeletingIndex(i);
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

      <ConfirmationModal
        isOpen={deletingIndex !== null}
        onClose={() => setDeletingIndex(null)}
        onConfirm={() => {
          if (deletingIndex !== null) {
            setSettings((prev) => prev.filter((_, idx) => idx !== deletingIndex));
            setDeletingIndex(null);
          }
        }}
      />
    </div>
  );
}
