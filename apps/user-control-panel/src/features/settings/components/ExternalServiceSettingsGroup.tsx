import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "./AddRulesSettingsButton";
import RuleSetting from "./RuleSetting";

interface ExternalServiceSettingsGroupProps {
  name: string;
  logoUrl?: string;
  logoTag?: string;
  logoKey?: string;
}

export default function ExternalServiceSettingsGroup({
  name,
  logoUrl,
  logoTag,
  logoKey,
}: ExternalServiceSettingsGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const candidates = useMemo(() => {
    const base = "/logos";
    const key = (logoKey || name).toLowerCase().replace(/\s+/g, "-");
    const list = [
      `${base}/${key}.svg`,
      `${base}/${key}.png`,
      `${base}/${key}.jpg`,
      `${base}/${key}.jpeg`,
      `${base}/${key}.webp`,
      `${base}/${key}.ico`,
    ];
    return logoUrl ? [logoUrl, ...list] : list;
  }, [logoUrl, logoKey, name]);

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden bg-bg-secondary/50">
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background border border-border overflow-hidden">
          {!showPlaceholder ? (
            <img
              src={candidates[srcIndex]}
              alt={`${name} logo`}
              className="w-full h-full object-contain"
              onError={() => {
                const next = srcIndex + 1;
                if (next < candidates.length) {
                  setSrcIndex(next);
                } else {
                  setShowPlaceholder(true);
                }
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
          <div className="flex flex-col gap-3">
            <RuleSetting
              name="Spot Settings"
              code="spot-settings"
              tags={["Tag1", "Tag2", "Tag3"]}
              details={[
                { label: "Api Key", value: "ABCD1234EFGH5678IJKL9012MNOP3456QRST7890" },
                { label: "Api Secret", value: "xYzAbCDefGhIJKlmNoPqRsTuVwXyZ1234567890abcdef1234567890abcdef" },
                { label: "Base Url", value: "https://api.binance.com" },
              ]}
            />
          </div>
          <div className="mt-3">
            <AddRulesSettingsButton />
          </div>
        </div>
      )}
    </div>
  );
}
