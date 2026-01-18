import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2, Save, X, Plus } from "lucide-react";
import { Input } from "../../../shared/ui/forms/Input";
import { FieldSpec } from "../config/serviceFieldConfigs";

type RuleSettingTag = {
  id: string;
  label: string;
  color?: "red" | "yellow" | "blue" | "green" | "gray";
};

type RuleSettingDetail = {
  label: string;
  value: string;
};

interface RuleSettingProps {
  name: string;
  code: string;
  tags?: RuleSettingTag[];
  details?: RuleSettingDetail[];
  defaultExpanded?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (data: { name: string; code: string; tags: RuleSettingTag[]; details: RuleSettingDetail[] }) => void;
  isNew?: boolean;
  serviceKey?: string;
  detailsSpec?: FieldSpec[];
}

export default function RuleSetting({
  name,
  code,
  tags = [],
  details = [],
  defaultExpanded = false,
  onEdit,
  onDelete,
  onSave,
  isNew = false,
  serviceKey,
  detailsSpec = [],
}: RuleSettingProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [editing, setEditing] = useState(isNew);
  const [localName, setLocalName] = useState(name);
  const [localCode, setLocalCode] = useState(code);
  const [localTags, setLocalTags] = useState<RuleSettingTag[]>(tags);
  const [localDetails, setLocalDetails] = useState<RuleSettingDetail[]>(details);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newDetailLabel, setNewDetailLabel] = useState("");
  const [newDetailValue, setNewDetailValue] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const structuredDetails = useMemo(() => {
    const map: Record<string, string | string[]> = {};
    details.forEach((d) => {
      map[d.label] = d.value;
    });
    return map;
  }, [details]);

  const validateValue = (spec: FieldSpec, value: string | string[]) => {
    if (spec.required) {
      if (spec.type === "array") {
        if (!Array.isArray(value) || value.length === 0) return "Required";
      } else {
        if (!value || String(value).trim().length === 0) return "Required";
      }
    }
    if (spec.type === "string" && typeof value === "string") {
      const len = value.length;
      if (spec.minLength && len < spec.minLength) return `Min length ${spec.minLength}`;
      if (spec.maxLength && len > spec.maxLength) return `Max length ${spec.maxLength}`;
      if (spec.format === "email") {
        const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!re.test(value)) return "Invalid email";
      }
      if (spec.format === "url") {
        try {
          // eslint-disable-next-line no-new
          new URL(value);
        } catch {
          return "Invalid URL";
        }
      }
      if (spec.format === "phone") {
        const re = /^\+?[0-9\-()\s]{10,30}$/;
        if (!re.test(value)) return "Invalid phone";
      }
    }
    if (spec.type === "array" && Array.isArray(value)) {
      if (value.some((v) => typeof v !== "string" || v.trim().length === 0)) return "Empty item";
    }
    return undefined;
  };

  const tagColorClass = (color?: RuleSettingTag["color"]) => {
    switch (color) {
      case "red":
        return "bg-red-200 text-red-900 dark:bg-red-900/30 dark:text-red-300";
      case "yellow":
        return "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "blue":
        return "bg-blue-200 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300";
      case "green":
        return "bg-green-200 text-green-900 dark:bg-green-900/30 dark:text-green-300";
      case "gray":
        return "bg-gray-200 text-gray-900 dark:bg-gray-700/50 dark:text-gray-200";
      default:
        return "bg-accent-hover/40 text-primary";
    }
  };

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-4 px-4 py-3">
        {!editing ? (
          <div className="flex-1">
            <div className="text-primary text-sm md:text-base font-medium">{name}</div>
            <div className="text-text-secondary text-xs md:text-sm">{code}</div>
          </div>
        ) : (
          <div className="flex-1 flex gap-3">
            <Input
              label="Name"
              id="rule-name"
              name="rule-name"
              placeholder="Setting name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
            />
            <Input
              label="Code"
              id="rule-code"
              name="rule-code"
              placeholder="setting-code"
              value={localCode}
              onChange={(e) => setLocalCode(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {!editing ? (
            tags.map((t) => (
              <span
                key={t.id}
                className={`px-2 py-1 rounded-md text-xs border border-border ${tagColorClass(t.color)}`}
              >
                {t.label}
              </span>
            ))
          ) : (
            <>
              {localTags.map((t) => (
                <span
                  key={t.id}
                  className={`px-2 py-1 rounded-md text-xs border border-border ${tagColorClass(t.color)}`}
                >
                  {t.label}
                </span>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  label="Tag"
                  id="new-tag"
                  name="new-tag"
                  placeholder="Tag"
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                />
                <button
                  type="button"
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-accent transition border border-border"
                  onClick={() => {
                    if (newTagLabel.trim()) {
                      setLocalTags([...localTags, { id: `${Date.now()}`, label: newTagLabel }]);
                      setNewTagLabel("");
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  onEdit && onEdit();
                }}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-accent transition border border-border"
                aria-label="Edit rule setting"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-red-500 transition border border-border"
                aria-label="Delete rule setting"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  onSave &&
                    onSave({
                      name: localName,
                      code: localCode,
                      tags: localTags,
                      details: localDetails,
                    });
                  setEditing(false);
                }}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-green-500 transition border border-border"
                aria-label="Save rule setting"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setLocalName(name);
                  setLocalCode(code);
                  setLocalTags(tags);
                  setLocalDetails(details);
                }}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-red-500 transition border border-border"
                aria-label="Cancel edit"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-accent transition border border-border"
            aria-label={expanded ? "Collapse rule setting" : "Expand rule setting"}
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 text-sm">
          {!editing ? (
            (detailsSpec.length > 0
              ? detailsSpec.map((spec) => ({
                  label: spec.label,
                  value:
                    typeof structuredDetails[spec.key] === "object"
                      ? (structuredDetails[spec.key] as string[]).join(", ")
                      : (structuredDetails[spec.key] as string) || "",
                }))
              : localDetails
            ).map((d, idx) => (
              <div key={`${d.label}-${idx}`} className="text-primary">
                <span className="font-medium">{d.label}:</span>{" "}
                <span className="text-text">{d.value}</span>
              </div>
            ))
          ) : (
            <>
              {detailsSpec.length > 0 ? (
                detailsSpec.map((spec) => {
                  const current =
                    typeof structuredDetails[spec.key] === "object"
                      ? (structuredDetails[spec.key] as string[]).join(",")
                      : (structuredDetails[spec.key] as string) || "";
                  return (
                    <Input
                      key={spec.key}
                      label={spec.label}
                      id={`detail-${spec.key}`}
                      name={`detail-${spec.key}`}
                      placeholder={spec.label}
                      value={current}
                      onChange={(e) => {
                        const val = e.target.value;
                        const next: RuleSettingDetail[] = detailsSpec.map((s) => {
                          const isArray = s.type === "array";
                          const v = s.key === spec.key ? val : (structuredDetails[s.key] as string) || "";
                          return { label: s.label, value: isArray ? String(v) : String(v) };
                        });
                        setLocalDetails(next);
                        const valueToValidate = spec.type === "array" ? val.split(",").map((x) => x.trim()).filter(Boolean) : val;
                        const err = validateValue(spec, valueToValidate);
                        setErrors((prev) => ({ ...prev, [spec.key]: err }));
                      }}
                      error={errors[spec.key]}
                      required={spec.required}
                    />
                  );
                })
              ) : (
                <>
                  {localDetails.map((d, idx) => (
                    <div key={`${d.label}-${idx}`} className="flex gap-2">
                      <Input
                        label="Label"
                        id={`detail-label-${idx}`}
                        name={`detail-label-${idx}`}
                        value={d.label}
                        onChange={(e) => {
                          const next = [...localDetails];
                          next[idx] = { ...next[idx], label: e.target.value };
                          setLocalDetails(next);
                        }}
                      />
                      <Input
                        label="Value"
                        id={`detail-value-${idx}`}
                        name={`detail-value-${idx}`}
                        value={d.value}
                        onChange={(e) => {
                          const next = [...localDetails];
                          next[idx] = { ...next[idx], value: e.target.value };
                          setLocalDetails(next);
                        }}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 items-end">
                    <Input
                      label="Label"
                      id="new-detail-label"
                      name="new-detail-label"
                      placeholder="Api Key"
                      value={newDetailLabel}
                      onChange={(e) => setNewDetailLabel(e.target.value)}
                    />
                    <Input
                      label="Value"
                      id="new-detail-value"
                      name="new-detail-value"
                      placeholder="..."
                      value={newDetailValue}
                      onChange={(e) => setNewDetailValue(e.target.value)}
                    />
                    <button
                      type="button"
                      className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent-hover/40 text-accent transition border border-border"
                      onClick={() => {
                        if (newDetailLabel.trim()) {
                          setLocalDetails([...localDetails, { label: newDetailLabel, value: newDetailValue }]);
                          setNewDetailLabel("");
                          setNewDetailValue("");
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
