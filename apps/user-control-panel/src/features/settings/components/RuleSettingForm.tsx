import { useMemo, useState } from "react";

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

interface RuleSettingFormProps {
  initialName?: string;
  initialCode?: string;
  initialTags?: string[];
  detailsSchema: DetailField[];
  onCancel?: () => void;
  onSave?: (data: {
    name: string;
    code: string;
    tags: string[];
    details: { label: string; value: string }[];
  }) => void;
}

export default function RuleSettingForm({
  initialName,
  initialCode,
  initialTags,
  detailsSchema,
  onCancel,
  onSave,
}: RuleSettingFormProps) {
  const [name, setName] = useState(initialName || "");
  const [code, setCode] = useState(initialCode || "");
  const [tagsInput, setTagsInput] = useState(
    (initialTags || []).join(", ")
  );
  const [detailValues, setDetailValues] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    detailsSchema.forEach((f) => {
      obj[f.key] = "";
    });
    return obj;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsInput]
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Required";
    if (!code.trim()) e.code = "Required";
    detailsSchema.forEach((f) => {
      const raw = detailValues[f.key] || "";
      const val = raw.trim();
      if (f.type === "array") {
        const items = val
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
        if (f.required && items.length === 0) e[f.key] = "Required";
      } else {
        if (f.required && !val) e[f.key] = "Required";
        if (val) {
          if (typeof f.exactLength === "number" && val.length !== f.exactLength) {
            e[f.key] = `Length must be ${f.exactLength} (current ${val.length})`;
          } else {
            if (typeof f.minLength === "number" && val.length < f.minLength) {
              e[f.key] = `Min length ${f.minLength} (current ${val.length})`;
            }
            if (typeof f.maxLength === "number" && val.length > f.maxLength) {
              e[f.key] = `Max length ${f.maxLength} (current ${val.length})`;
            }
          }
          if (f.pattern && !f.pattern.test(val)) {
            e[f.key] = "Invalid format";
          }
        }
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isValid = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Required";
    if (!code.trim()) e.code = "Required";
    detailsSchema.forEach((f) => {
      const raw = detailValues[f.key] || "";
      const val = raw.trim();
      if (f.type === "array") {
        const items = val
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
        if (f.required && items.length === 0) e[f.key] = "Required";
      } else {
        if (f.required && !val) e[f.key] = "Required";
        if (val) {
          if (typeof f.exactLength === "number" && val.length !== f.exactLength) {
            e[f.key] = `Length must be ${f.exactLength} (current ${val.length})`;
          } else {
            if (typeof f.minLength === "number" && val.length < f.minLength) {
              e[f.key] = `Min length ${f.minLength} (current ${val.length})`;
            }
            if (typeof f.maxLength === "number" && val.length > f.maxLength) {
              e[f.key] = `Max length ${f.maxLength} (current ${val.length})`;
            }
          }
          if (f.pattern && !f.pattern.test(val)) {
            e[f.key] = "Invalid format";
          }
        }
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, code, detailValues, detailsSchema]);

  const handleSave = () => {
    if (!validate()) return;
    const details = detailsSchema.map((f) => {
      const raw = detailValues[f.key] || "";
      const val = raw.trim();
      if (f.type === "array") {
        const items = val
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
        return { label: f.label, value: items.join(", ") };
      }
      return { label: f.label, value: val };
    });
    onSave?.({
      name: name.trim(),
      code: code.trim(),
      tags,
      details,
    });
  };

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-primary text-xs mb-1">Setting Name *</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-border bg-background text-primary px-3 py-2"
            placeholder="Insert Name here…"
          />
          {errors.name && (
            <div className="text-danger text-xs mt-1">{errors.name}</div>
          )}
        </div>
        <div>
          <div className="text-primary text-xs mb-1">Setting Code *</div>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-md border border-border bg-background text-primary px-3 py-2"
            placeholder="Insert Code here…"
          />
          {errors.code && (
            <div className="text-danger text-xs mt-1">{errors.code}</div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-primary text-xs mb-1">Setting Tags</div>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full rounded-md border border-border bg-background text-primary px-3 py-2"
          placeholder="Tags… (comma separated)"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {detailsSchema.map((f) => (
          <div key={f.key}>
            <div className="text-primary text-xs mb-1">
              {f.label} {f.required ? "*" : ""}
            </div>
            <input
              value={detailValues[f.key]}
              onChange={(e) =>
                setDetailValues((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              className="w-full rounded-md border border-border bg-background text-primary px-3 py-2"
              placeholder={f.placeholder || ""}
            />
            {errors[f.key] && (
              <div className="text-danger text-xs mt-1">{errors[f.key]}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid}
          className={`px-4 py-2 rounded-md border-2 border-border ${isValid ? "bg-accent-hover/50 hover:bg-accent-hover cursor-pointer" : "bg-background opacity-60 cursor-not-allowed"} text-primary transition`}
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border-2 border-border bg-background text-primary hover:bg-accent-hover/40 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
