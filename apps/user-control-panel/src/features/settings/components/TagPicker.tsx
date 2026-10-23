import { useEffect, useMemo, useRef, useState } from "react";
import {
  rulesSettingsTagsControllerCreateTag,
  rulesSettingsTagsControllerFindAllTags,
  TagResponseDto,
} from "@trading-assist/api-client";
import { CHIP, COMPACT_FIELD } from "../../../shared/ui/styles";

const normalizeTag = (v: string) => v.trim();
const equalsTag = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export default function TagPicker(props: {
  isAuthenticated: boolean;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const { isAuthenticated, value, onChange } = props;

  const [allTags, setAllTags] = useState<TagResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const cacheRef = useRef<Map<string, TagResponseDto[]>>(new Map());

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (!isAuthenticated) return;

    const raw = normalizeTag(query);
    const search = raw.length >= 2 ? raw : undefined;
    const cacheKey = search ? `s:${search.toLowerCase()}` : "__initial__";

    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setAllTags(cached);
      return;
    }

    let canceled = false;
    const t = setTimeout(() => {
      const load = async () => {
        setLoading(true);
        try {
          const res = await rulesSettingsTagsControllerFindAllTags({ search: search || '', limit: 50 });
          if (!canceled && res.status === 200) {
            cacheRef.current.set(cacheKey, res.data);
            setAllTags(res.data);
          }
        } finally {
          if (!canceled) setLoading(false);
        }
      };

      void load();
    }, 250);

    return () => {
      canceled = true;
      clearTimeout(t);
    };
  }, [open, query, isAuthenticated]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const selected = useMemo(() => {
    const uniq: string[] = [];
    (value || []).forEach((t) => {
      const n = normalizeTag(t);
      if (!n) return;
      if (uniq.some((u) => equalsTag(u, n))) return;
      uniq.push(n);
    });
    return uniq;
  }, [value]);

  const selectedSet = useMemo(() => new Set(selected.map((t) => t.toLowerCase())), [selected]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (allTags || [])
      .map((t) => t.name)
      .filter(Boolean)
      .filter((t) => !selectedSet.has(t.toLowerCase()))
      .filter((t) => (q ? t.toLowerCase().includes(q) : true))
      .slice(0, 20);
  }, [allTags, query, selectedSet]);

  const canCreate = useMemo(() => {
    const q = normalizeTag(query);
    if (!q) return false;
    if (selected.some((t) => equalsTag(t, q))) return false;
    if ((allTags || []).some((t) => equalsTag(t.name, q))) return false;
    return true;
  }, [allTags, query, selected]);

  const addTag = async (raw: string) => {
    const t = normalizeTag(raw);
    if (!t) return;
    if (selected.some((x) => equalsTag(x, t))) return;

    if ((allTags || []).some((x) => equalsTag(x.name, t))) {
      onChange([...selected, t]);
      setQuery("");
      return;
    }

    if (!isAuthenticated) {
      onChange([...selected, t]);
      setQuery("");
      return;
    }

    setLoading(true);
    try {
      const res = await rulesSettingsTagsControllerCreateTag({ name: t });

      if (res.status === 201) {
        setAllTags((prev) => [...prev, res.data]);
        cacheRef.current.clear();
        onChange([...selected, res.data.name]);
        setQuery("");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeTag = (t: string) => {
    onChange(selected.filter((x) => !equalsTag(x, t)));
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`${COMPACT_FIELD} !px-2 flex flex-wrap gap-2 items-center cursor-text focus-within:ring-2 focus-within:border-forest-300 focus-within:ring-forest-300/15 dark:focus-within:border-brand-300 dark:focus-within:ring-brand-300/20`}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map((t) => (
          <span
            key={t.toLowerCase()}
            className={`${CHIP} inline-flex items-center gap-1 !py-0.5`}
          >
            <span>{t}</span>
            <button
              type="button"
              className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(t);
              }}
              aria-label={`Remove tag ${t}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void addTag(query);
            }
            if (e.key === "Backspace" && !query && selected.length > 0) {
              removeTag(selected[selected.length - 1]);
            }
            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="flex-1 min-w-[160px] bg-transparent outline-none text-neutral-950 dark:text-white placeholder:text-neutral-400"
          placeholder={selected.length ? "Search or add tags…" : "Search or add tags…"}
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full py-1 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
          <div className="max-h-56 overflow-auto">
            {loading && (
              <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">Loading…</div>
            )}

            {!loading && canCreate && (
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 dark:text-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                onClick={() => {
                  void addTag(query);
                }}
              >
                Create “{normalizeTag(query)}”
              </button>
            )}

            {!loading && filteredOptions.map((t) => (
              <button
                key={t.toLowerCase()}
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 dark:text-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                onClick={() => {
                  onChange([...selected, t]);
                  setQuery("");
                  setOpen(false);
                }}
              >
                {t}
              </button>
            ))}

            {!loading && !canCreate && filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
