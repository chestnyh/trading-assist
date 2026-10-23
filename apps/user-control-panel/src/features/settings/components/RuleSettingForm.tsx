import { useMemo, useState } from "react";
import { useAuth } from "../../../app/contexts/AuthContext";
import TagPicker from "./TagPicker";
import { COMPACT_FIELD, FIELD_LABEL, SMALL_BUTTON_PRIMARY, SMALL_BUTTON_SECONDARY, SUBTLE_SURFACE } from "../../../shared/ui/styles";

type DetailField = {
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

interface RuleSettingFormProps {
  initialName?: string;
  initialCode?: string;
  initialTags?: string[];
  initialDescription?: string;
  detailsSchema: DetailField[];
  initialDetails?: Record<string, string>;
  onCancel?: () => void;
  onSave?: (data: {
    name: string;
    code: string;
    tags: string[];
    description?: string;
    details: { label: string; value: string }[];
  }) => void;
}

export default function RuleSettingForm({
  initialName,
  initialCode,
  initialTags,
  initialDescription,
  detailsSchema,
  initialDetails,
  onCancel,
  onSave,
}: RuleSettingFormProps) {
  const [name, setName] = useState(initialName || "");
  const [code, setCode] = useState(initialCode || "");
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [description, setDescription] = useState(initialDescription || "");
  const [detailValues, setDetailValues] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    detailsSchema.forEach((f) => {
      obj[f.key] = initialDetails?.[f.key] ?? "";
    });
    return obj;
  });

  const { isAuthenticated } = useAuth();

  const errors = useMemo(() => {
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
          const isBaseUrl =
            (typeof f.label === "string" && /base\s*url/i.test(f.label)) ||
            (typeof f.key === "string" && /^(baseurl|baseUrl)$/i.test(f.key));
          if (typeof f.exactLength === "number" && val.length !== f.exactLength) {
            e[f.key] = `Length must be ${f.exactLength} (current ${val.length})`;
          } else {
            if (!isBaseUrl && typeof f.minLength === "number" && val.length < f.minLength) {
              e[f.key] = `Min length ${f.minLength} (current ${val.length})`;
            }
            if (typeof f.maxLength === "number" && val.length > f.maxLength) {
              e[f.key] = `Max length ${f.maxLength} (current ${val.length})`;
            }
          }
          if (f.pattern && !new RegExp(f.pattern).test(val)) {
            e[f.key] = "Invalid format";
          }
        }
      }
    });
    return e;
  }, [name, code, detailValues, detailsSchema]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleSave = () => {
    if (!isValid) return;
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
      description: description.trim(),
      details,
    });
  };

  return (
    <div className={`${SUBTLE_SURFACE} p-4 md:p-5`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className={`${FIELD_LABEL} mb-1.5`}>Setting Name *</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={COMPACT_FIELD}
            placeholder="Insert Name here…"
          />
          {errors.name && (
            <div className="text-error text-xs mt-1.5">{errors.name}</div>
          )}
        </div>
        <div>
          <div className={`${FIELD_LABEL} mb-1.5`}>Setting Code *</div>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={COMPACT_FIELD}
            placeholder="Insert Code here…"
          />
          {errors.code && (
            <div className="text-error text-xs mt-1.5">{errors.code}</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className={`${FIELD_LABEL} mb-1.5`}>Setting Tags</div>
        <TagPicker isAuthenticated={isAuthenticated} value={tags} onChange={setTags} />
      </div>

      <div className="mt-4">
        <div className={`${FIELD_LABEL} mb-1.5`}>Description</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${COMPACT_FIELD} resize-y`}
          placeholder="Describe this rule setting (optional)…"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {detailsSchema.map((f) => (
          <div key={f.key}>
            <div className={`${FIELD_LABEL} mb-1.5`}>
              {f.label} {f.required ? "*" : ""}
            </div>
            <input
              value={detailValues[f.key]}
              onChange={(e) =>
                setDetailValues((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              className={COMPACT_FIELD}
              placeholder={f.placeholder || ""}
            />
            {errors[f.key] && (
              <div className="text-error text-xs mt-1.5">{errors[f.key]}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid}
          className={SMALL_BUTTON_PRIMARY}
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={SMALL_BUTTON_SECONDARY}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
