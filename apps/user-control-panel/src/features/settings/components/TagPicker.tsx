import { useEffect, useMemo, useRef, useState } from "react";
import {
  rulesSettingsTagsControllerCreateTag,
  rulesSettingsTagsControllerFindAllTags,
  TagResponseDto,
} from "@trading-bot/api-client";

const normalizeTag = (v: string) => v.trim();
const equalsTag = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export default function TagPicker(props: {
  token: string | null;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const { token, value, onChange } = props;

  const [allTags, setAllTags] = useState<TagResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!token) return;

    let canceled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await rulesSettingsTagsControllerFindAllTags({
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!canceled && res.status === 200) {
          setAllTags(res.data);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    void load();

    return () => {
      canceled = true;
    };
  }, [token]);

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

    if (!token) {
      onChange([...selected, t]);
      setQuery("");
      return;
    }

    setLoading(true);
    try {
      const res = await rulesSettingsTagsControllerCreateTag(
        { name: t },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201) {
        setAllTags((prev) => [...prev, res.data]);
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
        className="w-full rounded-md border border-border bg-background text-primary px-2 py-2 flex flex-wrap gap-2 items-center"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map((t) => (
          <span
            key={t.toLowerCase()}
            className="inline-flex items-center gap-1 rounded-full bg-accent-hover/40 border border-border px-2 py-0.5 text-sm"
          >
            <span>{t}</span>
            <button
              type="button"
              className="text-secondary hover:text-primary transition"
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
          className="flex-1 min-w-[160px] bg-transparent outline-none text-primary"
          placeholder={selected.length ? "Search or add tags…" : "Search or add tags…"}
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-background shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-auto">
            {loading && (
              <div className="px-3 py-2 text-sm text-secondary">Loading…</div>
            )}

            {!loading && canCreate && (
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent-hover/30 transition"
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
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent-hover/30 transition"
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
              <div className="px-3 py-2 text-sm text-secondary">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
