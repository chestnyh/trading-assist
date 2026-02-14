import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import AddRulesSettingsButton from "./AddRulesSettingsButton";
import { ConfirmationModal } from "../../../shared/ui/modals/ConfirmationModal";
import { rulesSettingsControllerFindAllSettings, rulesSettingsControllerCreateSetting,
  rulesSettingsControllerUpdateSetting,
  rulesSettingsControllerRemoveSetting,
  RuleSettingResponseDto, CreateUserRuleSettingDto, UpdateUserRuleSettingDto } from "@trading-bot/api-client";
import { useAuth } from "../../../app/contexts/AuthContext";
import RuleSetting, { DetailField } from "./RuleSetting";

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
  const [settings, setSettings] = useState<
    {
      id?: number;
      name: string;
      code: string;
      tags: string[];
      details: { label: string; value: string }[];
      isNew?: boolean;
      isEditing?: boolean;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;
  const { token } = useAuth();

  const hasSchema = Boolean(fieldsSchema && fieldsSchema.length > 0);

  const mapRulesToSettings = (rules: RuleSettingResponseDto[]) => {
    if (!fieldsSchema) return [];
    return rules.map((rule) => {
      const details = fieldsSchema.map((field) => ({
        label: field.label,
        value: (rule.configuration[field.key] as string) || "",
      }));
      return {
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
                  <RuleSetting
                    key={`${s.code}-${i}`}
                    name={s.name}
                    code={s.code}
                    tags={s.tags}
                    details={s.details}
                    detailsSchema={fieldsSchema || []}
                    mode={s.isNew || s.isEditing ? "edit" : "view"}
                    onSave={async (data) => {
                      if (s.isNew) {
                        try {
                          if (!token) return;
                          setLoading(true);
                          setError(null);

                          const configuration: Record<string, any> = {};
                          if (fieldsSchema) {
                            data.details.forEach((d) => {
                              const field = fieldsSchema.find((f) => f.label === d.label);
                              if (field) {
                                configuration[field.key] = d.value;
                              }
                            });
                          }

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
                                id: res.data.id,
                                isNew: false,
                                isEditing: false,
                              };
                              return next;
                            });
                          }
                        } catch (e: any) {
                          setError(e.message || "Failed to save setting");
                        } finally {
                          setLoading(false);
                        }
                      } else {
                        try {
                          if (!token) return;
                          setLoading(true);
                          setError(null);

                          const configuration: Record<string, any> = {};
                          if (fieldsSchema) {
                            data.details.forEach((d) => {
                              const field = fieldsSchema.find((f) => f.label === d.label);
                              if (field) {
                                configuration[field.key] = d.value;
                              }
                            });
                          }

                          const dto: UpdateUserRuleSettingDto = {
                            name: data.name,
                            code: data.code,
                            configuration,
                            tags: data.tags,
                          };

                          if (!s.id) {
              setError("Setting ID is missing");
              setLoading(false);
              return;
            }

            const res = await rulesSettingsControllerUpdateSetting(s.id, dto, {
              headers: { Authorization: `Bearer ${token}` },
            });

                          if (res.status === 200) {
                            setSettings((prev) => {
                              const next = [...prev];
                              next[i] = { ...data, isEditing: false, id: s.id };
                              return next;
                            });
                          }
                        } catch (e: any) {
                          setError(e.message || "Failed to update setting");
                        } finally {
                          setLoading(false);
                        }
                      }
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
