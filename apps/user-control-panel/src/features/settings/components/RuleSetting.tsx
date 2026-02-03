import { useMemo, useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";

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
  pattern?: RegExp;
  type?: "string" | "array";
};

interface RuleSettingProps {
  name: string;
  code: string;
  tags?: string[];
  details?: DetailItem[];
  initiallyExpanded?: boolean;
  mode?: "view" | "edit";
  detailsSchema?: DetailField[];
  onSave?: (data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RuleSetting({
  name,
  code,
  tags = [],
  details = [],
  initiallyExpanded,
  mode: controlledMode,
  detailsSchema = [],
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: RuleSettingProps) {
  const [internalMode, setInternalMode] = useState<"view" | "edit">("view");
  const mode = controlledMode ?? internalMode;

  const [expanded, setExpanded] = useState(Boolean(initiallyExpanded));
  const [editName, setEditName] = useState(name);
  const [editCode, setEditCode] = useState(code);
  const [tagsInput, setTagsInput] = useState((tags || []).join(", "));
  const [detailValues, setDetailValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (detailsSchema.length > 0) {
      detailsSchema.forEach((f) => {
        const found = details.find((d) => d.label === f.label);
        map[f.key] = found?.value ?? "";
      });
    }
    return map;
  });
  
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const parsedTags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsInput]
  );

  useEffect(() => {
    setEditName(name);
  }, [name]);

  useEffect(() => {
    setEditCode(code);
  }, [code]);

  useEffect(() => {
    setTagsInput((tags || []).join(", "));
  }, [tags]);

  useEffect(() => {
    const map: Record<string, string> = {};
    if (detailsSchema.length > 0) {
      detailsSchema.forEach((f) => {
        const found = details.find((d) => d.label === f.label);
        map[f.key] = found?.value ?? "";
      });
    }
    setDetailValues(map);
  }, [details, detailsSchema]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (editName.trim().length === 0) {
      errs.name = "Setting Name is required";
    }
    if (editCode.trim().length === 0) {
      errs.code = "Setting Code is required";
    }
    
    detailsSchema.forEach((f) => {
      const val = (detailValues[f.key] ?? "").trim();
      
      if (f.required && val.length === 0) {
        errs[f.key] = `${f.label} is required`;
      } else if (val.length > 0) {
        if (f.minLength && val.length < f.minLength) {
          errs[f.key] = `${f.label} must be at least ${f.minLength} characters`;
        }
        if (f.maxLength && val.length > f.maxLength) {
          errs[f.key] = `${f.label} must be at most ${f.maxLength} characters`;
        }
        if (f.exactLength && val.length !== f.exactLength) {
          errs[f.key] = `${f.label} must be exactly ${f.exactLength} characters`;
        }
        if (f.pattern && !f.pattern.test(val)) {
          errs[f.key] = `${f.label} is invalid`;
        }
      }
    });
    return errs;
  }, [editName, editCode, detailValues, detailsSchema]);

  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  if (mode === "edit") {
    return (
      <form
        className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          
          if (!isValid) {
             const allTouched: Record<string, boolean> = { name: true, code: true };
             detailsSchema.forEach(f => allTouched[f.key] = true);
             setTouched(allTouched);
             return;
          }

          const det = detailsSchema.map((f) => {
            const raw = detailValues[f.key] ?? "";
            if (f.type === "array") {
              const items = raw
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean);
              return { label: f.label, value: items.join(", ") };
            }
            return { label: f.label, value: raw.trim() };
          });
          onSave?.({
            name: editName.trim(),
            code: editCode.trim(),
            tags: parsedTags,
            details: det,
          });
          if (!controlledMode) {
            setInternalMode("view");
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-primary text-xs mb-1">Setting Name *</div>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full rounded-md border ${touched.name && errors.name ? 'border-red-500' : 'border-border'} bg-background text-primary px-3 py-2`}
              placeholder="Insert Name here…"
            />
            {touched.name && errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
          </div>
          <div>
            <div className="text-primary text-xs mb-1">Setting Code *</div>
            <input
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              onBlur={() => handleBlur('code')}
              className={`w-full rounded-md border ${touched.code && errors.code ? 'border-red-500' : 'border-border'} bg-background text-primary px-3 py-2`}
              placeholder="Insert Code here…"
            />
            {touched.code && errors.code && <div className="text-red-500 text-xs mt-1">{errors.code}</div>}
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
                value={detailValues[f.key] ?? ""}
                onChange={(e) =>
                  setDetailValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                onBlur={() => handleBlur(f.key)}
                className={`w-full rounded-md border ${touched[f.key] && errors[f.key] ? 'border-red-500' : 'border-border'} bg-background text-primary px-3 py-2`}
                placeholder={f.placeholder || ""}
              />
              {touched[f.key] && errors[f.key] && <div className="text-red-500 text-xs mt-1">{errors[f.key]}</div>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={!isValid}
            className={`px-4 py-2 rounded-md border-2 border-border text-primary transition ${
              isValid
                ? "bg-accent-hover/50 hover:bg-accent-hover cursor-pointer"
                : "bg-background opacity-60 cursor-not-allowed"
            }`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else if (!controlledMode) {
                setInternalMode("view");
              }
            }}
            className="px-4 py-2 rounded-md border-2 border-border bg-background text-primary hover:bg-accent-hover/40 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="
            h-8 w-8
            flex items-center justify-center
            rounded-md
            hover:bg-accent-hover/40
            text-accent
            transition
            border border-border
          "
          aria-label={expanded ? "Collapse rule setting" : "Expand rule setting"}
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="text-primary text-sm md:text-base font-medium truncate">
              {name}
            </div>
            <span
              className="
                px-2 py-0.5
                rounded-md
                text-xs
                border border-border
                bg-accent-hover/40
                text-accent
              "
            >
              {code}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="
                    px-2 py-0.5
                    rounded-md
                    text-xs
                    border border-border
                    bg-accent-hover/30
                    text-primary
                  "
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onEdit) {
                onEdit();
              } else if (!controlledMode) {
                setInternalMode("edit");
              }
            }}
            className="
              h-8 w-8
              flex items-center justify-center
              rounded-md
              hover:bg-accent-hover/40
              text-accent
              transition
              border border-border
            "
            aria-label="Edit rule setting"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="
              h-8 w-8
              flex items-center justify-center
              rounded-md
              bg-red-500/20
              text-red-500
              transition
              border border-red-500
              hover:bg-red-500/40
            "
            aria-label="Delete rule setting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && details.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-col gap-2 text-primary text-sm">
            {details.map((d, idx) => (
              <div key={`${d.label}-${idx}`} className="leading-relaxed">
                <span className="font-medium">{d.label}:</span>{" "}
                <span className="break-all">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
