import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "./AddRulesSettingsButton";
import { ConfirmationModal } from "../../../shared/ui/modals/ConfirmationModal";
import { rulesSettingsControllerFindAllSettings, rulesSettingsControllerCreateSetting,
  rulesSettingsControllerUpdateSetting,
  rulesSettingsControllerRemoveSetting,
  RuleSettingResponseDto, CreateUserRuleSettingDto, UpdateUserRuleSettingDto } from "@trading-bot/api-client";
import { useAuth } from "../../../app/contexts/AuthContext";
import type { DetailField } from "./RuleSetting";
import DefaultRuleSetting, { SettingItem } from "./DefaultRuleSetting";
import TelegramRuleSetting from "./TelegramRuleSetting";

export type { DetailField };

interface ExternalServiceSettingsGroupProps {
  name: string;
  logoUrl?: string;
  logoTag?: string;
  logoKey?: string;
  fieldsSchema?: DetailField[];
  externalServiceId: number;
}

export default function ExternalServiceSettingsGroup({
  name,
  logoUrl,
  logoTag,
  logoKey,
  fieldsSchema,
  externalServiceId,
}: ExternalServiceSettingsGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;
  const { token } = useAuth();

  const isTelegramService = name === "Telegram";

  const hasSchema = Boolean((fieldsSchema || []).length > 0);

  const onDetailsChange = (clientId: string, nextDetails: { label: string; value: string }[]) => {
    setSettings((prev) => prev.map((s) => (s.clientId === clientId ? { ...s, details: nextDetails } : s)));
  };

  const mapRulesToSettings = (rules: RuleSettingResponseDto[]) => {
    if (!fieldsSchema) return [];
    return rules.map((rule) => {
      const clientId = `rs-${rule.id}`;

      const details = fieldsSchema.map((field) => ({
        label: field.label,
        value: (rule.configuration[field.key] as string) || "",
      }));

      return {
        clientId,
        id: rule.id,
        name: rule.name,
        code: rule.code,
        tags: rule.tags || [],
        details,
        isNew: false,
        isEditing: false,
      };
    });
  };

  const fetchSettingsPage = async (nextPage: number) => {
    if (!token || !hasSchema) return;
    try {
      setError(null);
      setLoading(true);
      const options = { headers: { Authorization: `Bearer ${token}` } };
      const res = await rulesSettingsControllerFindAllSettings({ externalServiceId, page: nextPage, limit }, options);
      if (res.status === 200) {
        const mapped = mapRulesToSettings(res.data);
        setSettings((prev) => [...prev, ...mapped]);
        setPage(nextPage);
      }
    } catch (e: any) {
      const msg = e?.message ? String(e.message) : "Failed to load settings";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && settings.length === 0) {
      fetchSettingsPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const buildConfigurationFromDetails = (details: { label: string; value: string }[]) => {
    const configuration: Record<string, any> = {};
    if (!fieldsSchema) return configuration;

    details.forEach((d) => {
      const field = fieldsSchema.find((f) => f.label === d.label);
      if (field) {
        configuration[field.key] = d.value;
      }
    });

    return configuration;
  };

  const saveNewSetting = async (s: SettingItem, i: number, data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => {
    if (!token) return;

    const configuration = buildConfigurationFromDetails(data.details);
    const dto: CreateUserRuleSettingDto = {
      name: data.name,
      code: data.code,
      externalServiceId,
      configuration,
      tags: data.tags,
    };

    const res = await rulesSettingsControllerCreateSetting(dto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 201) {
      setSettings((prev) => {
        const next = [...prev];
        next[i] = {
          ...data,
          clientId: s.clientId,
          id: res.data.id,
          isNew: false,
          isEditing: false,
        };
        return next;
      });
    }
  };

  const saveExistingSetting = async (s: SettingItem, i: number, data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => {
    if (!token) return;

    if (!s.id) {
      setError("Setting ID is missing");
      return;
    }

    const configuration = buildConfigurationFromDetails(data.details);
    const dto: UpdateUserRuleSettingDto = {
      name: data.name,
      code: data.code,
      configuration,
      tags: data.tags,
    };

    const res = await rulesSettingsControllerUpdateSetting(s.id, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      setSettings((prev) => {
        const next = [...prev];
        next[i] = { ...data, clientId: s.clientId, isEditing: false, id: s.id };
        return next;
      });
    }
  };

  const handleSave = async (s: SettingItem, i: number, data: { name: string; code: string; tags: string[]; details: { label: string; value: string }[] }) => {
    try {
      if (!token) return;
      setLoading(true);
      setError(null);

      if (s.isNew) {
        await saveNewSetting(s, i, data);
      } else {
        await saveExistingSetting(s, i, data);
      }
    } catch (e: any) {
      setError(e.message || "Failed to save setting");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setSettings((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isEditing: true };
      return next;
    });
  };

  const handleCancel = (s: SettingItem, index: number) => {
    if (s.isNew) {
      setSettings((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }

    setSettings((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isEditing: false };
      return next;
    });
  };

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
              {loading && <div className="text-secondary text-sm">Loading settings…</div>}
              {error && <div className="text-error text-sm">{error}</div>}
              <div className="flex flex-col gap-3">
                {settings.map((s, i) => (
                  <div key={s.clientId} className="flex flex-col gap-2">
                    {isTelegramService ? (
                      <TelegramRuleSetting
                        setting={s}
                        fieldsSchema={fieldsSchema}
                        token={token}
                        setLoading={setLoading}
                        setError={setError}
                        onSave={(data) => handleSave(s, i, data)}
                        onEdit={() => handleEdit(i)}
                        onCancel={() => handleCancel(s, i)}
                        onDelete={() => setDeletingIndex(i)}
                        onDetailsChange={onDetailsChange}
                      />
                    ) : (
                      <DefaultRuleSetting
                        setting={s}
                        fieldsSchema={fieldsSchema || []}
                        onSave={(data) => handleSave(s, i, data)}
                        onEdit={() => handleEdit(i)}
                        onCancel={() => handleCancel(s, i)}
                        onDelete={() => setDeletingIndex(i)}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  className="px-3 py-1 text-sm rounded-md border border-border hover:bg-accent-hover/40 text-accent transition"
                  onClick={() => fetchSettingsPage(page + 1)}
                  disabled={loading}
                >
                  Load more
                </button>
              </div>
              <div className="mt-3">
                <AddRulesSettingsButton
                  onClick={() => {
                    const clientId = typeof crypto !== "undefined" && "randomUUID" in crypto
                      ? (crypto as any).randomUUID()
                      : `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                    setSettings((prev) => [
                      ...prev,
                      { clientId, name: "", code: "", tags: [], details: [], isNew: true },
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
        onClose={() => !isDeleting && setDeletingIndex(null)}
        onConfirm={async () => {
          if (deletingIndex === null) return;
          const s = settings[deletingIndex];
          
          // If it's a new unsaved setting, just remove from list
          if (s.isNew || !s.id) {
            setSettings((prev) => prev.filter((_, idx) => idx !== deletingIndex));
            setDeletingIndex(null);
            return;
          }

          try {
            if (!token) return;
            setIsDeleting(true);
            setError(null);
            
            await rulesSettingsControllerRemoveSetting(s.id, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            setSettings((prev) => prev.filter((_, idx) => idx !== deletingIndex));
            setDeletingIndex(null);
          } catch (e: any) {
            setError(e.message || "Failed to delete setting");
            setDeletingIndex(null);
          } finally {
            setIsDeleting(false);
          }
        }}
        isLoading={isDeleting}
      />
    </div>
  );
}
